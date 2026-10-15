import { ReceiptSlip } from "@/components/pos/receipt-slip";
import { baht, BILL_VALUES, cashTotal, formatBe, formatBeStamp, inRange, orderDay, PAY_LABEL } from "@/lib/pos/format";
import { systemCash } from "@/lib/pos/logic";
import { usePosStore } from "@/lib/pos/store";
import type { PrintJob } from "@/lib/pos/types";

export function PrintSheet({ job }: { job: Exclude<PrintJob, { kind: "receipt" }> }) {
  if (job.kind === "sales") return <SalesSheet job={job} />;
  if (job.kind === "items") return <ItemsSheet from={job.from} to={job.to} />;
  return <VoidsSheet from={job.from} to={job.to} />;
}

function SalesSheet({ job }: { job: Extract<PrintJob, { kind: "sales" }> }) {
  const orders = usePosStore((state) => state.orders);
  const settings = usePosStore((state) => state.settings);
  const list = orders
    .filter((order) => order.status === "normal" && inRange(orderDay(order.createdAt), job.from, job.to))
    .filter((order) => job.pay === "all" || order.paymentMethod === job.pay)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const voids = orders.filter(
    (order) => order.status === "void" && order.voidedAt && inRange(orderDay(order.voidedAt), job.from, job.to),
  );
  const sums = { cash: 0, transfer: 0, credit: 0 };
  for (const order of list) sums[order.paymentMethod] += order.total;
  const counted = cashTotal(job.counts, job.coin);
  const system = systemCash(orders, job.cashDate);
  const filled = counted > 0;
  return (
    <article className="bg-card p-4 text-sm text-ink">
      <h1 className="text-center text-lg text-brand">{settings.companyName}</h1>
      <p className="mt-2 text-center">
        รายงานการขาย ประจำวันที่ {formatBe(job.from)}
        {job.from !== job.to ? ` – ${formatBe(job.to)}` : ""}
      </p>
      <table className="mt-4 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ink">
            <th className="py-1">ลำดับ</th>
            <th>วันที่ใบเสร็จ</th>
            <th>เลขที่ใบเสร็จ</th>
            <th className="text-right">ชำระเงินสด</th>
            <th className="text-right">เงินโอน</th>
            <th className="text-right">เครดิตการ์ด</th>
          </tr>
        </thead>
        <tbody>
          {list.map((order, index) => (
            <tr key={order.id} className="border-b border-sand">
              <td className="py-1">{index + 1}</td>
              <td>{formatBe(orderDay(order.createdAt))}</td>
              <td>{order.receiptLong}</td>
              <td className="text-right">{order.paymentMethod === "cash" ? baht(order.total) : ""}</td>
              <td className="text-right">{order.paymentMethod === "transfer" ? baht(order.total) : ""}</td>
              <td className="text-right">{order.paymentMethod === "credit" ? baht(order.total) : ""}</td>
            </tr>
          ))}
          <tr>
            <td />
            <td />
            <td className="py-2">รวมทั้งสิ้น</td>
            <td className="text-right">{baht(sums.cash)}</td>
            <td className="text-right">{baht(sums.transfer)}</td>
            <td className="text-right">{baht(sums.credit)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-muted">
        บิลที่ยกเลิกไม่รวมในยอด: {voids.length} ใบ รวม {baht(voids.reduce((sum, order) => sum + order.total, 0))} บาท
      </p>
      <h2 className="mt-6 text-brand">สรุปการนำส่งเงินสด วันที่ {formatBe(job.cashDate)}</h2>
      <p>ยอดเงินสดตามระบบ {baht(system)} บาท</p>
      <table className="mt-2 w-full">
        <thead>
          <tr>
            <th className="text-left">ลำดับ</th>
            <th className="text-left">แบงค์/เหรียญ</th>
            <th className="text-right">จำนวน</th>
            <th className="text-right">รวมเป็นเงิน</th>
          </tr>
        </thead>
        <tbody>
          {BILL_VALUES.map((value, index) => {
            const count = Math.floor(job.counts[String(value)] || 0);
            return (
              <tr key={value}>
                <td>{index + 1}</td>
                <td>{baht(value)}</td>
                <td className="text-right">{filled ? count : "________"}</td>
                <td className="text-right">{filled ? baht(value * count) : "________"}</td>
              </tr>
            );
          })}
          <tr>
            <td>{BILL_VALUES.length + 1}</td>
            <td>เหรียญ/อื่นๆ</td>
            <td />
            <td className="text-right">{filled ? baht(job.coin) : "________"}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3">รวมเงินสดที่นำส่ง {filled ? baht(counted) : "________________"} บาท</p>
      <p>ส่วนต่างเทียบระบบ {filled ? baht(counted - system) : "________________"} บาท</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <p>ลงชื่อผู้นำส่งเงิน ________________</p>
        <p>ลงชื่อผู้รับเงิน ________________</p>
      </div>
    </article>
  );
}

function ItemsSheet({ from, to }: { from: string; to: string }) {
  const orders = usePosStore((state) => state.orders);
  const products = usePosStore((state) => state.products);
  const categories = usePosStore((state) => state.categories);
  const groups = itemGroups(orders, products, categories, from, to);
  const grand = groups.reduce((sum, group) => sum + group.rows.reduce((inner, row) => inner + row.amount, 0), 0);
  return (
    <article className="bg-card p-4 text-sm text-ink">
      <h1 className="text-center text-lg text-brand">สรุปจำนวนสินค้าที่ขาย</h1>
      <p className="mt-1 text-center">
        {formatBe(from)}
        {from !== to ? ` – ${formatBe(to)}` : ""}
      </p>
      {groups.map((group) => (
        <section key={group.name} className="mt-4">
          <h2 className="text-brand">{group.name}</h2>
          {group.rows.map((row) => (
            <div key={row.name} className="flex justify-between border-b border-sand py-1">
              <span>{row.name}</span>
              <span>
                {row.qty} · {baht(row.amount)}
              </span>
            </div>
          ))}
          <div className="py-1 text-right">รวมหมวด {baht(group.rows.reduce((sum, row) => sum + row.amount, 0))}</div>
        </section>
      ))}
      <p className="mt-4 text-right text-base">รวมทั้งสิ้น {baht(grand)}</p>
    </article>
  );
}

function VoidsSheet({ from, to }: { from: string; to: string }) {
  const orders = usePosStore((state) => state.orders);
  const list = orders
    .filter((order) => order.status === "void" && order.voidedAt && inRange(orderDay(order.voidedAt), from, to))
    .sort((a, b) => (a.voidedAt ?? "").localeCompare(b.voidedAt ?? ""));
  return (
    <article className="bg-card p-4 text-sm text-ink">
      <h1 className="text-center text-lg text-brand">ประวัติการยกเลิกบิล</h1>
      <p className="mt-1 text-center">
        {formatBe(from)} – {formatBe(to)} · {list.length} ใบ · {baht(list.reduce((sum, order) => sum + order.total, 0))} บาท
      </p>
      <table className="mt-4 w-full text-left">
        <thead>
          <tr className="border-b border-ink">
            <th className="py-1">เลขที่</th>
            <th>ยอด</th>
            <th>ชำระ</th>
            <th>ยกเลิกเมื่อ</th>
            <th>ผู้ยกเลิก</th>
            <th>เหตุผล</th>
          </tr>
        </thead>
        <tbody>
          {list.map((order) => (
            <tr key={order.id} className="border-b border-sand">
              <td className="py-1">{order.receiptLong}</td>
              <td>{baht(order.total)}</td>
              <td>{PAY_LABEL[order.paymentMethod]}</td>
              <td>{order.voidedAt ? formatBeStamp(order.voidedAt) : ""}</td>
              <td>{order.voidedByName}</td>
              <td>{order.voidReason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export function itemGroups(
  orders: ReturnType<typeof usePosStore.getState>["orders"],
  products: ReturnType<typeof usePosStore.getState>["products"],
  categories: ReturnType<typeof usePosStore.getState>["categories"],
  from: string,
  to: string,
) {
  const map = new Map<string, { name: string; qty: number; amount: number; categoryId: string }>();
  for (const order of orders) {
    if (order.status !== "normal" || !inRange(orderDay(order.createdAt), from, to)) continue;
    for (const item of order.items) {
      const key = item.productId || item.productName;
      const prev = map.get(key) ?? {
        name: item.productName,
        qty: 0,
        amount: 0,
        categoryId: products.find((product) => product.id === item.productId)?.categoryId ?? "",
      };
      prev.qty += item.qty;
      prev.amount += item.lineTotal;
      map.set(key, prev);
    }
  }
  const grouped = new Map<string, { name: string; sort: number; rows: { name: string; qty: number; amount: number }[] }>();
  for (const row of map.values()) {
    const category = categories.find((item) => item.id === row.categoryId);
    const name = category?.name ?? "ไม่ระบุหมวด";
    const bucket = grouped.get(name) ?? { name, sort: category?.sortOrder ?? 99, rows: [] };
    bucket.rows.push({ name: row.name, qty: row.qty, amount: row.amount });
    grouped.set(name, bucket);
  }
  return [...grouped.values()]
    .sort((a, b) => a.sort - b.sort)
    .map((group) => ({ ...group, rows: group.rows.sort((a, b) => a.name.localeCompare(b.name, "th")) }));
}

export function ReceiptPrint({ orderId }: { orderId: string }) {
  const order = usePosStore((state) => state.orders.find((item) => item.id === orderId));
  const settings = usePosStore((state) => state.settings);
  if (!order) return null;
  return <ReceiptSlip order={order} settings={settings} />;
}
