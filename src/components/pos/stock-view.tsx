import { useMemo, useState } from "react";
import { Button, Field, Modal, PageHeader, TextInput } from "@/components/pos/ui";
import { baht, bangkokISODate, downloadCsv } from "@/lib/pos/format";
import { stockOnDate } from "@/lib/pos/logic";
import { usePosStore, useSessionUser } from "@/lib/pos/store";

export function StockView() {
  const user = useSessionUser();
  const categories = usePosStore((state) => state.categories);
  const products = usePosStore((state) => state.products);
  const movements = usePosStore((state) => state.movements);
  const settings = usePosStore((state) => state.settings);
  const receiveStock = usePosStore((state) => state.receiveStock);
  const adjustStock = usePosStore((state) => state.adjustStock);
  const today = bangkokISODate();
  const [date, setDate] = useState(today);
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [targetId, setTargetId] = useState<string | null>(null);
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<"receive" | "adjust">("receive");

  const activeCategories = categories.filter((item) => item.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((product) => product.trackStock)
      .filter((product) => categoryId === "all" || product.categoryId === categoryId)
      .filter((product) => !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q))
      .map((product) => ({ product, day: stockOnDate(movements, product.id, date) }))
      .sort((a, b) => a.product.name.localeCompare(b.product.name, "th"));
  }, [products, movements, categoryId, query, date]);

  const low = products
    .filter((product) => product.trackStock && product.isActive && product.stockQty < settings.lowStockThreshold)
    .sort((a, b) => a.stockQty - b.stockQty);
  const target = products.find((product) => product.id === targetId) ?? null;

  return (
    <div>
      <PageHeader title="สต๊อก" hint={`ใกล้หมดเมื่อคงเหลือต่ำกว่า ${settings.lowStockThreshold} ชิ้น`}>
        <Button
          variant="sand"
          onClick={() =>
            downloadCsv(`onedaypos-stock-${date}.csv`, [
              ["รหัส", "เมนู", "ยกมา", "รับเข้า", "ขาย", "คืน", "ปรับ", "คงเหลือ"],
              ...rows.map(({ product, day }) => [product.sku, product.name, day.opening, day.received, day.sold, day.returned, day.adjusted, day.closing]),
            ])
          }
        >
          ดาวน์โหลด Excel
        </Button>
      </PageHeader>
      <div className="mb-3 grid gap-3 lg:grid-cols-[1fr_16rem]">
        <div className="min-w-0">
          <div className="mb-3 grid gap-2 sm:grid-cols-[12rem_1fr]">
            <Field label={user?.role === "admin" ? "ดูวันที่" : "วันนี้"}>
              <TextInput
                type="date"
                value={user?.role === "admin" ? date : today}
                max={today}
                disabled={user?.role !== "admin"}
                onChange={(event) => setDate(event.target.value)}
              />
            </Field>
            <Field label="ค้นหาเมนู">
              <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ชื่อหรือรหัส" />
            </Field>
          </div>
          <div className="mb-3 flex gap-2 overflow-x-auto">
            <FilterChip active={categoryId === "all"} onClick={() => setCategoryId("all")} label="ทั้งหมด" />
            {activeCategories.map((category) => (
              <FilterChip key={category.id} active={categoryId === category.id} onClick={() => setCategoryId(category.id)} label={category.name} />
            ))}
          </div>
          <div className="grid gap-2">
            {rows.map(({ product, day }) => (
              <article key={product.id} className="rounded-xl border border-sand bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div>{product.name}</div>
                    <div className="text-xs text-muted">{product.sku}</div>
                  </div>
                  <div className={`text-right ${day.closing < settings.lowStockThreshold ? "text-brand" : ""}`}>
                    <div className="text-lg">{day.closing}</div>
                    <div className="text-xs">คงเหลือ</div>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted sm:grid-cols-5">
                  <span>ยกมา {day.opening}</span>
                  <span>รับเข้า {day.received}</span>
                  <span>ขาย {day.sold}</span>
                  <span>คืน {day.returned}</span>
                  <span>ปรับ {day.adjusted}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="sand"
                    onClick={() => {
                      setTargetId(product.id);
                      setMode("receive");
                      setQty("");
                      setNote("");
                    }}
                  >
                    รับเข้า
                  </Button>
                  {user?.role === "admin" ? (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setTargetId(product.id);
                        setMode("adjust");
                        setQty(String(product.stockQty));
                        setNote("");
                      }}
                    >
                      ปรับยอด
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="rounded-xl border border-sand bg-card p-3 lg:sticky lg:top-16 lg:self-start">
          <h2 className="text-brand">ใกล้หมด</h2>
          {low.length === 0 ? <p className="mt-2 text-sm text-muted">ไม่มีรายการต่ำกว่าเกณฑ์</p> : null}
          <div className="mt-2 grid gap-2">
            {low.map((product) => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <span>{product.name}</span>
                <span className="text-brand">{product.stockQty === 0 ? "หมด" : product.stockQty}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">ราคาตัวอย่างเมนูทำสด กาแฟลาเต้ {baht(products.find((item) => item.sku === "D02")?.price ?? 0)} ไม่ถูกนับในสต๊อก</p>
        </aside>
      </div>
      {target ? (
        <Modal title={mode === "receive" ? `รับเข้า ${target.name}` : `ปรับยอด ${target.name}`} onClose={() => setTargetId(null)}>
          <p className="mb-2 text-sm text-muted">คงเหลือปัจจุบัน {target.stockQty} ชิ้น · วันที่ {user?.role === "admin" ? date : today}</p>
          <Field label={mode === "receive" ? "จำนวนรับเข้า" : "ยอดคงเหลือใหม่"}>
            <TextInput inputMode="numeric" value={qty} onChange={(event) => setQty(event.target.value)} />
          </Field>
          <Field label="หมายเหตุ">
            <TextInput className="mt-2" value={note} onChange={(event) => setNote(event.target.value)} />
          </Field>
          <Button
            className="mt-3 w-full"
            onClick={() => {
              const amount = Number(qty);
              const when = user?.role === "admin" ? date : today;
              const result = mode === "receive" ? receiveStock(target.id, amount, when, note) : adjustStock(target.id, amount, when, note);
              if (result.ok) setTargetId(null);
            }}
          >
            บันทึก
          </Button>
        </Modal>
      ) : null}
    </div>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`min-h-11 shrink-0 rounded-lg px-4 text-sm ${active ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`}>
      {label}
    </button>
  );
}
