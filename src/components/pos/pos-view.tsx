import { Minus, Plus, Printer, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Field, Modal, TextInput } from "@/components/pos/ui";
import { baht, bangkokISODate, PAY_LABEL, VOID_REASONS } from "@/lib/pos/format";
import { usePosStore, useSessionUser } from "@/lib/pos/store";
import type { PayMethod } from "@/lib/pos/types";

const QUICK = [20, 50, 100, 500, 1000];

export function PosView() {
  const user = useSessionUser();
  const categories = usePosStore((state) => (Array.isArray(state.categories) ? state.categories : []));
  const products = usePosStore((state) => (Array.isArray(state.products) ? state.products : []));
  const cart = usePosStore((state) => (Array.isArray(state.cart) ? state.cart : []));
  const settings = usePosStore((state) => state.settings);
  const orders = usePosStore((state) => (Array.isArray(state.orders) ? state.orders : []));
  const addToCart = usePosStore((state) => state.addToCart);
  const changeQty = usePosStore((state) => state.changeQty);
  const clearCart = usePosStore((state) => state.clearCart);
  const checkout = usePosStore((state) => state.checkout);
  const voidOrder = usePosStore((state) => state.voidOrder);
  const openReceipt = usePosStore((state) => state.openReceipt);
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [method, setMethod] = useState<PayMethod>("cash");
  const [cash, setCash] = useState("");
  const [busy, setBusy] = useState(false);
  const [billsOpen, setBillsOpen] = useState(false);
  const [billDate, setBillDate] = useState(bangkokISODate());
  const [voidId, setVoidId] = useState<string | null>(null);
  const [reason, setReason] = useState<string>(VOID_REASONS[0]);
  const [custom, setCustom] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const activeCategories = useMemo(
    () => categories.filter((item) => item.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((product) => product.isActive && activeCategories.some((category) => category.id === product.categoryId))
      .filter((product) => categoryId === "all" || product.categoryId === categoryId)
      .filter((product) => !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "th"));
  }, [products, activeCategories, categoryId, query]);

  const lines = cart
    .map((line) => {
      const product = products.find((item) => item.id === line.productId);
      if (!product) return null;
      return { line, product, amount: product.price * line.qty };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const total = lines.reduce((sum, item) => sum + item.amount, 0);
  const count = lines.reduce((sum, item) => sum + item.line.qty, 0);
  const received = Number(cash);
  const change = method === "cash" ? Math.max(0, (Number.isFinite(received) ? received : 0) - total) : 0;
  const cashOk = method !== "cash" || (Number.isFinite(received) && received >= total);

  const today = bangkokISODate();
  const bills = orders.filter((order) => {
    const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(order.createdAt));
    if (day !== (user?.role === "admin" ? billDate : today)) return false;
    if (user?.role !== "admin" && order.userId !== user?.id) return false;
    return true;
  });

  function pay() {
    if (busy || !cashOk) return;
    setBusy(true);
    const result = checkout({
      paymentMethod: method,
      cashReceived: method === "cash" ? received : null,
    });
    setBusy(false);
    if (result.ok) {
      setPayOpen(false);
      setCartOpen(false);
      setCash("");
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:flex-row">
      <section className="min-w-0 flex-1 pb-24 lg:pb-0">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h1 className="text-xl text-brand">ขายหน้าร้าน</h1>
          <Button variant="sand" onClick={() => setBillsOpen(true)}>
            บิลวันนี้
          </Button>
        </div>
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategoryId("all")}
            className={`min-h-11 shrink-0 rounded-lg px-4 text-sm ${categoryId === "all" ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`}
          >
            รวมเมนูทั้งหมด
          </button>
          {activeCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              className={`min-h-11 shrink-0 rounded-lg px-4 text-sm ${categoryId === category.id ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อหรือรหัสเมนู" className="mb-3" />
        {visible.length === 0 ? <p className="rounded-xl bg-card p-6 text-center text-muted">ไม่พบเมนูในหมวดนี้</p> : null}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => {
            const soldOut = product.trackStock && product.stockQty <= 0;
            const low = product.trackStock && product.stockQty > 0 && product.stockQty < settings.lowStockThreshold;
            return (
              <button
                key={product.id}
                type="button"
                disabled={soldOut}
                onClick={() => addToCart(product.id)}
                className={`overflow-hidden rounded-xl border border-sand bg-card text-left ${soldOut ? "opacity-50" : ""}`}
              >
                {settings.showImages ? (
                  <div className="relative aspect-square bg-sand">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-brand">ไม่มีรูป</div>
                    )}
                    <span className="absolute right-2 bottom-2 rounded-md bg-brand px-2 py-1 text-sm text-brand-ink">{baht(product.price)}</span>
                    {soldOut ? <span className="absolute top-2 left-2 rounded-md bg-brand px-2 py-1 text-xs text-brand-ink">หมด</span> : null}
                  </div>
                ) : null}
                <div className="p-3">
                  <div className="text-sm leading-snug">{product.name}</div>
                  {!settings.showImages ? <div className="mt-1 text-brand">{baht(product.price)}</div> : null}
                  {soldOut ? <div className="text-xs text-brand">หมด</div> : null}
                  {low ? <div className="text-xs text-brand">เหลือ {product.stockQty}</div> : null}
                  {!product.trackStock ? <div className="text-xs text-muted">ทำสด</div> : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="sticky top-16 hidden w-80 shrink-0 self-start lg:block xl:w-96">
        <CartPanel
          lines={lines}
          total={total}
          onDec={(id) => changeQty(id, -1)}
          onInc={(id) => changeQty(id, 1)}
          onClear={clearCart}
          onPay={() => {
            setMethod("cash");
            setCash("");
            setPayOpen(true);
          }}
        />
      </aside>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed right-3 bottom-4 z-30 flex min-h-12 items-center gap-2 rounded-xl bg-brand px-4 text-brand-ink shadow-lg lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <ShoppingBag className="size-5" />
          ตะกร้า {count}
        </span>
        <span>{baht(total)}</span>
      </button>

      {cartOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="ปิดตะกร้า" className="absolute inset-0 bg-ink/40" onClick={() => setCartOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-auto rounded-t-2xl bg-card p-4">
            <CartPanel
              lines={lines}
              total={total}
              onDec={(id) => changeQty(id, -1)}
              onInc={(id) => changeQty(id, 1)}
              onClear={clearCart}
              onPay={() => {
                setMethod("cash");
                setCash("");
                setPayOpen(true);
              }}
            />
          </div>
        </div>
      ) : null}

      {payOpen ? (
        <Modal title="ชำระเงิน" onClose={() => setPayOpen(false)}>
          <div className="mb-3 text-sm text-muted">
            ต้องชำระ <span className="text-lg text-brand">{baht(total)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <PayChoice label="เงินสด" active={method === "cash"} onClick={() => setMethod("cash")} />
            {settings.allowTransfer ? <PayChoice label="โอนเงิน" active={method === "transfer"} onClick={() => setMethod("transfer")} /> : null}
            {settings.allowCredit ? <PayChoice label="บัตรเครดิต" active={method === "credit"} onClick={() => setMethod("credit")} /> : null}
          </div>
          {method === "cash" ? (
            <div className="mt-3 grid gap-2">
              <Field label="เงินที่ได้รับ">
                <TextInput inputMode="decimal" value={cash} onChange={(event) => setCash(event.target.value)} placeholder="0" />
              </Field>
              <div className="flex flex-wrap gap-2">
                {QUICK.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="min-h-11 rounded-lg bg-sand px-3 text-sm text-ink"
                    onClick={() => setCash(String((Number(cash) || 0) + value))}
                  >
                    {baht(value)}
                  </button>
                ))}
                <button type="button" className="min-h-11 rounded-lg bg-sky px-3 text-sm text-ink" onClick={() => setCash(String(total))}>
                  พอดี
                </button>
              </div>
              <div className="text-sm">
                ทอน <span className="text-lg text-brand">{baht(change)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">บันทึกประเภท {PAY_LABEL[method]} และยอดเท่านั้น ไม่เก็บเลขบัตร</p>
          )}
          <Button className="mt-4 w-full" disabled={!cashOk || busy || total <= 0} onClick={pay}>
            {busy ? "กำลังบันทึก..." : "ยืนยันการขาย"}
          </Button>
        </Modal>
      ) : null}

      {billsOpen ? (
        <Modal title="บิลวันนี้" onClose={() => setBillsOpen(false)} wide>
          {user?.role === "admin" ? (
            <Field label="วันที่">
              <TextInput type="date" value={billDate} onChange={(event) => setBillDate(event.target.value)} />
            </Field>
          ) : (
            <p className="text-sm text-muted">ผู้ขายเห็นเฉพาะบิลของตนเองในวันนี้</p>
          )}
          <div className="mt-3 grid gap-2">
            {bills.length === 0 ? <p className="text-sm text-muted">ยังไม่มีบิล</p> : null}
            {bills.map((order) => (
              <div key={order.id} className="rounded-xl border border-sand p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div>
                      {order.receiptShort} · {baht(order.total)} บาท
                    </div>
                    <div className="text-sm text-muted">
                      {PAY_LABEL[order.paymentMethod]} · {order.userName} · {order.terminalName}
                      {order.status === "void" ? " · ยกเลิกแล้ว" : ""}
                    </div>
                  </div>
                  <button type="button" aria-label="พิมพ์ซ้ำ" className="grid size-11 place-items-center rounded-lg bg-sand" onClick={() => openReceipt(order.id, false)}>
                    <Printer className="size-4" />
                  </button>
                </div>
                {order.status === "normal" ? (
                  <Button variant="ghost" className="mt-1 px-0 text-brand" onClick={() => setVoidId(order.id)}>
                    ยกเลิกบิล
                  </Button>
                ) : (
                  <p className="mt-1 text-sm text-brand">เหตุผล: {order.voidReason}</p>
                )}
              </div>
            ))}
          </div>
        </Modal>
      ) : null}

      {voidId ? (
        <Modal title="ยกเลิกบิล" onClose={() => setVoidId(null)}>
          <p className="mb-2 text-sm text-muted">บิลที่ยกเลิกจะไม่นับยอดขาย และคืนสต๊อก ย้อนกลับไม่ได้</p>
          <div className="grid grid-cols-2 gap-2">
            {VOID_REASONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setReason(item)}
                className={`min-h-11 rounded-lg px-3 text-sm ${reason === item ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`}
              >
                {item}
              </button>
            ))}
          </div>
          {reason === "อื่นๆ" ? (
            <TextInput className="mt-2" value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="ระบุเหตุผล" />
          ) : null}
          <Button
            className="mt-3 w-full"
            onClick={() => {
              const text = reason === "อื่นๆ" ? custom : reason;
              const result = voidOrder(voidId, text);
              if (result.ok) {
                setVoidId(null);
                setCustom("");
              }
            }}
          >
            ยืนยันยกเลิกบิล
          </Button>
        </Modal>
      ) : null}
    </div>
  );
}

function PayChoice({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`min-h-11 rounded-lg px-2 text-sm ${active ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`}>
      {label}
    </button>
  );
}

function CartPanel({
  lines,
  total,
  onDec,
  onInc,
  onClear,
  onPay,
}: {
  lines: { line: { productId: string; qty: number }; product: { name: string; price: number }; amount: number }[];
  total: number;
  onDec: (id: string) => void;
  onInc: (id: string) => void;
  onClear: () => void;
  onPay: () => void;
}) {
  return (
    <div className="cart-pane flex flex-col rounded-xl border border-sand bg-card p-3">
      <h2 className="text-lg text-brand">ตะกร้า</h2>
      <div className="mt-2 min-h-24 flex-1 overflow-auto">
        {lines.length === 0 ? <p className="py-8 text-center text-sm text-muted">แตะเมนูเพื่อเพิ่มรายการ</p> : null}
        {lines.map(({ line, product, amount }) => (
          <div key={line.productId} className="flex items-center gap-2 border-b border-sand py-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">{product.name}</div>
              <div className="text-xs text-muted">
                x{line.qty} · {baht(amount)}
              </div>
            </div>
            <button type="button" aria-label="ลดจำนวน" className="grid size-11 place-items-center rounded-lg bg-sand" onClick={() => onDec(line.productId)}>
              <Minus className="size-4" />
            </button>
            <button type="button" aria-label="เพิ่มจำนวน" className="grid size-11 place-items-center rounded-lg bg-sand" onClick={() => onInc(line.productId)}>
              <Plus className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-sand pt-3">
        <span>รวมทั้งหมด</span>
        <span className="text-2xl text-brand">{baht(total)}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Button variant="sand" onClick={onClear} disabled={lines.length === 0}>
          ล้าง
        </Button>
        <Button className="col-span-2" disabled={lines.length === 0} onClick={onPay}>
          ชำระเงิน
        </Button>
      </div>
    </div>
  );
}
