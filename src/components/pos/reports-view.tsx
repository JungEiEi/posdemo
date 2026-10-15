import { useMemo, useState } from "react";
import { itemGroups } from "@/components/pos/print-sheet";
import { Button, Field, PageHeader, SelectInput, TextInput } from "@/components/pos/ui";
import {
  baht,
  bangkokISODate,
  BILL_VALUES,
  cashTotal,
  downloadCsv,
  formatBe,
  formatBeStamp,
  formatCeStamp,
  inRange,
  orderDay,
  PAY_LABEL,
} from "@/lib/pos/format";
import { systemCash } from "@/lib/pos/logic";
import { usePosStore } from "@/lib/pos/store";
import type { PayMethod } from "@/lib/pos/types";

type Tab = "bills" | "items" | "voids" | "cash";

export function ReportsView() {
  const orders = usePosStore((state) => state.orders);
  const products = usePosStore((state) => state.products);
  const categories = usePosStore((state) => state.categories);
  const users = usePosStore((state) => state.users);
  const openReceipt = usePosStore((state) => state.openReceipt);
  const requestPrint = usePosStore((state) => state.requestPrint);
  const saveCashCount = usePosStore((state) => state.saveCashCount);
  const cashCounts = usePosStore((state) => state.cashCounts);
  const today = bangkokISODate();
  const [tab, setTab] = useState<Tab>("bills");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [pay, setPay] = useState<"all" | PayMethod>("all");
  const [status, setStatus] = useState<"normal" | "void" | "all">("normal");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [cashDate, setCashDate] = useState(today);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [coin, setCoin] = useState(0);

  const bills = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((order) => inRange(orderDay(order.createdAt), from, to))
      .filter((order) => status === "all" || order.status === status)
      .filter((order) => pay === "all" || order.paymentMethod === pay)
      .filter((order) => {
        if (!q) return true;
        return (
          order.receiptShort.toLowerCase().includes(q) ||
          order.receiptLong.toLowerCase().includes(q) ||
          order.userName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [orders, from, to, status, pay, query]);

  const normalBills = bills.filter((order) => order.status === "normal");
  const sums = { cash: 0, transfer: 0, credit: 0 };
  for (const order of normalBills) sums[order.paymentMethod] += order.total;

  const voids = useMemo(
    () =>
      orders
        .filter((order) => order.status === "void" && order.voidedAt && inRange(orderDay(order.voidedAt), from, to))
        .sort((a, b) => (a.voidedAt ?? "").localeCompare(b.voidedAt ?? "")),
    [orders, from, to],
  );
  const groups = useMemo(() => itemGroups(orders, products, categories, from, to), [orders, products, categories, from, to]);
  const system = systemCash(orders, cashDate);
  const counted = cashTotal(counts, coin);
  const saved = cashCounts.filter((row) => row.countDate === cashDate);

  return (
    <div>
      <PageHeader title="รายงานยอดขาย" hint="บิลที่ยกเลิกไม่ถูกนับในยอดขาย">
        <Button variant="sand" onClick={() => exportCurrent(tab, bills, voids, groups, from, to)}>
          ดาวน์โหลด Excel
        </Button>
        <Button
          onClick={() => {
            if (tab === "items") requestPrint({ kind: "items", from, to });
            else if (tab === "voids") requestPrint({ kind: "voids", from, to });
            else requestPrint({ kind: "sales", from, to, pay, cashDate, counts, coin });
          }}
        >
          พิมพ์ / PDF
        </Button>
      </PageHeader>
      <div className="mb-3 flex gap-2 overflow-x-auto">
        {(
          [
            ["bills", "รายการบิล"],
            ["items", "สรุปสินค้า"],
            ["voids", "บิลที่ยกเลิก"],
            ["cash", "นำส่งเงินสด"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`min-h-11 shrink-0 rounded-lg px-4 text-sm ${tab === id ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab !== "cash" ? (
        <div className="mb-3 grid gap-2 sm:grid-cols-4">
          <Field label="จากวันที่">
            <TextInput type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </Field>
          <Field label="ถึงวันที่">
            <TextInput type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </Field>
          {tab === "bills" ? (
            <>
              <Field label="ประเภทชำระ">
                <SelectInput value={pay} onChange={(event) => setPay(event.target.value as "all" | PayMethod)}>
                  <option value="all">ทั้งหมด</option>
                  <option value="cash">เงินสด</option>
                  <option value="transfer">โอนเงิน</option>
                  <option value="credit">บัตรเครดิต</option>
                </SelectInput>
              </Field>
              <Field label="สถานะ">
                <SelectInput value={status} onChange={(event) => setStatus(event.target.value as "normal" | "void" | "all")}>
                  <option value="normal">ปกติ</option>
                  <option value="void">ยกเลิก</option>
                  <option value="all">ทั้งหมด</option>
                </SelectInput>
              </Field>
            </>
          ) : null}
        </div>
      ) : null}

      {tab === "bills" ? (
        <div>
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาเลขที่หรือผู้ขาย" className="mb-3" />
          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <SumCard label="เงินสด" value={sums.cash} />
            <SumCard label="โอนเงิน" value={sums.transfer} />
            <SumCard label="บัตรเครดิต" value={sums.credit} />
            <SumCard label="รวมปกติ" value={sums.cash + sums.transfer + sums.credit} />
          </div>
          <div className="grid gap-2">
            {bills.length === 0 ? <p className="rounded-xl bg-card p-6 text-center text-muted">ยังไม่มีบิลในช่วงนี้</p> : null}
            {bills.map((order, index) => (
              <article key={order.id} className="rounded-xl border border-sand bg-card p-3">
                <button type="button" className="flex w-full items-start justify-between gap-3 text-left" onClick={() => setOpenId(openId === order.id ? null : order.id)}>
                  <div>
                    <div>
                      {index + 1}. {order.receiptLong}
                    </div>
                    <div className="text-sm text-muted">
                      {formatBeStamp(order.createdAt)} · {PAY_LABEL[order.paymentMethod]} · {order.userName}
                      {order.status === "void" ? " · ยกเลิก" : ""}
                    </div>
                  </div>
                  <div className="text-brand">{baht(order.total)}</div>
                </button>
                {openId === order.id ? (
                  <div className="mt-2 border-t border-sand pt-2 text-sm">
                    <div className="text-muted">ใบเสร็จ {order.receiptShort}</div>
                    {order.items.map((item, itemIndex) => (
                      <div key={`${item.productName}-${itemIndex}`} className="flex justify-between py-1">
                        <span>
                          {item.productName} x{item.qty}
                        </span>
                        <span>{baht(item.lineTotal)}</span>
                      </div>
                    ))}
                    <Button variant="sand" className="mt-2" onClick={() => openReceipt(order.id, false)}>
                      พิมพ์ใบเสร็จซ้ำ
                    </Button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "items" ? (
        <div className="grid gap-3">
          {groups.length === 0 ? <p className="rounded-xl bg-card p-6 text-center text-muted">ยังไม่มียอดขายในช่วงนี้</p> : null}
          {groups.map((group) => (
            <section key={group.name} className="rounded-xl border border-sand bg-card p-3">
              <h2 className="text-brand">{group.name}</h2>
              {group.rows.map((row) => (
                <div key={row.name} className="flex justify-between border-b border-sand py-2 text-sm">
                  <span>{row.name}</span>
                  <span>
                    {row.qty} ชิ้น · {baht(row.amount)}
                  </span>
                </div>
              ))}
              <div className="pt-2 text-right text-sm">รวมหมวด {baht(group.rows.reduce((sum, row) => sum + row.amount, 0))}</div>
            </section>
          ))}
        </div>
      ) : null}

      {tab === "voids" ? (
        <div className="grid gap-2">
          <p className="text-sm text-muted">
            {voids.length} ใบ · {baht(voids.reduce((sum, order) => sum + order.total, 0))} บาท
          </p>
          {voids.length === 0 ? <p className="rounded-xl bg-card p-6 text-center text-muted">ไม่มีบิลที่ยกเลิกในช่วงนี้</p> : null}
          {voids.map((order) => (
            <article key={order.id} className="rounded-xl border border-sand bg-card p-3 text-sm">
              <div className="flex justify-between gap-2">
                <span>{order.receiptLong}</span>
                <span className="text-brand">{baht(order.total)}</span>
              </div>
              <div className="text-muted">
                {PAY_LABEL[order.paymentMethod]} · ออกโดย {order.userName} · เครื่อง {order.terminalName}
              </div>
              <div>
                ยกเลิก {order.voidedAt ? formatBeStamp(order.voidedAt) : ""} โดย {order.voidedByName}
              </div>
              <div>เหตุผล: {order.voidReason}</div>
              <div className="mt-1 text-muted">{order.items.map((item) => `${item.productName} x${item.qty}`).join(", ")}</div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "cash" ? (
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-xl border border-sand bg-card p-3">
            <Field label="วันที่นำส่ง">
              <TextInput type="date" value={cashDate} onChange={(event) => setCashDate(event.target.value)} />
            </Field>
            <p className="mt-3 text-sm">
              ยอดเงินสดตามระบบ <span className="text-brand">{baht(system)}</span> บาท
            </p>
            <div className="mt-3 grid gap-2">
              {BILL_VALUES.map((value) => (
                <label key={value} className="grid grid-cols-[6rem_1fr_6rem] items-center gap-2 text-sm">
                  <span>{baht(value)}</span>
                  <TextInput
                    inputMode="numeric"
                    value={counts[String(value)] ?? ""}
                    onChange={(event) =>
                      setCounts((prev) => ({ ...prev, [String(value)]: Math.max(0, Math.floor(Number(event.target.value) || 0)) }))
                    }
                    placeholder="จำนวนใบ"
                  />
                  <span className="text-right">{baht(value * (counts[String(value)] || 0))}</span>
                </label>
              ))}
              <label className="grid grid-cols-[6rem_1fr] items-center gap-2 text-sm">
                <span>เหรียญ/อื่นๆ</span>
                <TextInput inputMode="decimal" value={coin || ""} onChange={(event) => setCoin(Math.max(0, Number(event.target.value) || 0))} placeholder="บาท" />
              </label>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <span>รวมเงินสดที่นำส่ง</span>
              <span className="text-xl text-brand">{baht(counted)}</span>
            </div>
            <p className="text-sm text-muted">ส่วนต่าง {baht(counted - system)} บาท</p>
            <Button className="mt-3" onClick={() => saveCashCount({ date: cashDate, counts, coin, total: counted, system })}>
              บันทึกนำส่ง
            </Button>
          </section>
          <section className="rounded-xl border border-sand bg-card p-3 text-sm">
            <h2 className="text-brand">ประวัติวันนี้</h2>
            {saved.length === 0 ? <p className="mt-2 text-muted">ยังไม่บันทึก</p> : null}
            {saved.map((row) => (
              <div key={row.id} className="mt-2 border-b border-sand py-2">
                <div>
                  {row.userName} · นับได้ {baht(row.totalCounted)}
                </div>
                <div className="text-muted">
                  ระบบ {baht(row.systemCash)} · ส่วนต่าง {baht(row.difference)} · {formatCeStamp(row.createdAt)}
                </div>
              </div>
            ))}
            <p className="mt-3 text-muted">ผู้รับเงินเซ็นบนกระดาษตอนพิมพ์รายงาน</p>
            <p className="text-muted">ผู้ขายในระบบ: {users.filter((user) => user.role === "seller" && user.isActive).map((user) => user.name).join(", ") || "-"}</p>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function SumCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-card px-3 py-2">
      <div className="text-xs text-muted">{label}</div>
      <div className="text-brand">{baht(value)}</div>
    </div>
  );
}

function exportCurrent(
  tab: Tab,
  bills: ReturnType<typeof usePosStore.getState>["orders"],
  voids: ReturnType<typeof usePosStore.getState>["orders"],
  groups: ReturnType<typeof itemGroups>,
  from: string,
  to: string,
) {
  if (tab === "items") {
    const rows: (string | number)[][] = [["หมวดหมู่", "สินค้า", "จำนวน", "ยอดเงิน"]];
    for (const group of groups) {
      for (const row of group.rows) rows.push([group.name, row.name, row.qty, row.amount]);
      rows.push([group.name, "รวมหมวด", "", group.rows.reduce((sum, row) => sum + row.amount, 0)]);
    }
    downloadCsv(`onedaypos-items-${from}-${to}.csv`, rows);
    return;
  }
  if (tab === "voids") {
    downloadCsv(`onedaypos-voids-${from}-${to}.csv`, [
      ["เลขที่", "ยอด", "ชำระ", "ออกบิล", "ยกเลิกเมื่อ", "ผู้ยกเลิก", "เหตุผล", "ผู้ขาย", "เครื่อง"],
      ...voids.map((order) => [
        order.receiptLong,
        order.total,
        PAY_LABEL[order.paymentMethod],
        formatBeStamp(order.createdAt),
        order.voidedAt ? formatBeStamp(order.voidedAt) : "",
        order.voidedByName ?? "",
        order.voidReason ?? "",
        order.userName,
        order.terminalName,
      ]),
    ]);
    return;
  }
  downloadCsv(`onedaypos-sales-${from}-${to}.csv`, [
    ["ลำดับ", "วันที่", "เลขที่", "เงินสด", "โอน", "บัตร", "สถานะ", "ผู้ขาย"],
    ...bills.map((order, index) => [
      index + 1,
      formatBe(orderDay(order.createdAt)),
      order.receiptLong,
      order.status === "normal" && order.paymentMethod === "cash" ? order.total : "",
      order.status === "normal" && order.paymentMethod === "transfer" ? order.total : "",
      order.status === "normal" && order.paymentMethod === "credit" ? order.total : "",
      order.status === "void" ? "ยกเลิก" : "ปกติ",
      order.userName,
    ]),
  ]);
}
