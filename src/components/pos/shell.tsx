import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, LogOut, Menu, Package, Settings, ShoppingBag, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { PrintSheet } from "@/components/pos/print-sheet";
import { ReceiptSlip } from "@/components/pos/receipt-slip";
import { Button, Field, Modal, SelectInput, TextInput } from "@/components/pos/ui";
import { roleLabel } from "@/lib/pos/format";
import { usePosStore, useSessionUser } from "@/lib/pos/store";
import type { PrintMode } from "@/lib/pos/types";

const links = [
  { to: "/", label: "ขายหน้าร้าน", icon: ShoppingBag },
  { to: "/reports", label: "รายงานยอดขาย", icon: BarChart3 },
  { to: "/stock", label: "สต๊อก", icon: Package },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const user = useSessionUser();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const logout = usePosStore((state) => state.logout);
  const terminalName = usePosStore((state) => state.terminalName);
  const printMode = usePosStore((state) => state.printMode);
  const setTerminal = usePosStore((state) => state.setTerminal);
  const notice = usePosStore((state) => state.notice);
  const printJob = usePosStore((state) => state.printJob);
  const printTicket = usePosStore((state) => state.printTicket);
  const cartCount = usePosStore((state) => (Array.isArray(state.cart) ? state.cart : []).reduce((sum, line) => sum + line.qty, 0));
  const [open, setOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [name, setName] = useState(terminalName);
  const [mode, setMode] = useState<PrintMode>(printMode);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => {
      const current = usePosStore.getState().notice;
      if (current?.id === notice.id) usePosStore.setState({ notice: null });
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!printTicket) return;
    // พิมพ์อัตโนมัติในหน้าพรีวิว (iframe) ทำให้จอขายหายบนมือถือ — ให้กดพิมพ์เองจากใบเสร็จ
    if (window.self !== window.top) return;
    const timer = window.setTimeout(() => {
      window.addEventListener(
        "afterprint",
        () => usePosStore.setState({ printJob: null }),
        { once: true },
      );
      window.print();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [printTicket]);

  if (!user) return null;

  function requestLeave() {
    if (cartCount > 0) setLeaveOpen(true);
    else logout();
  }

  return (
    <div className={`min-h-dvh bg-cream text-ink ${printJob ? "print-active" : ""}`}>
      <div className={printJob ? "no-print" : undefined}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-brand px-2 text-brand-ink sm:px-3">
          <button type="button" aria-label="เปิดเมนู" onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-lg">
            <Menu className="size-5" />
          </button>
          <div className="min-w-0">
            <div className="truncate">OneDayPOS</div>
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <span className="hidden max-w-36 truncate text-sm sm:inline">{user.name}</span>
            <span className="rounded-md bg-sky px-2 py-1 text-xs text-ink">{roleLabel(user.role)}</span>
            <button type="button" aria-label="ออกจากระบบ" onClick={requestLeave} className="grid size-11 place-items-center rounded-lg">
              <LogOut className="size-5" />
            </button>
          </div>
        </header>

        {open ? (
          <button type="button" aria-label="ปิดเมนู" className="fixed inset-0 z-40 bg-ink/40" onClick={() => setOpen(false)} />
        ) : null}
        <aside
          className={`sidebar-panel fixed top-0 left-0 z-50 flex h-dvh w-72 flex-col bg-card p-4 shadow-xl ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-brand">OneDayPOS</div>
              <div className="text-sm text-muted">
                {user.name} · {roleLabel(user.role)}
              </div>
            </div>
            <button type="button" aria-label="ยุบเมนู" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-lg">
              <X className="size-5" />
            </button>
          </div>
          <nav className="grid gap-1">
            {links.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center gap-3 rounded-lg px-3 ${active ? "bg-sky text-ink" : "text-ink"}`}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
            {user.role === "admin" ? (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 ${path.startsWith("/admin") ? "bg-sky text-ink" : "text-ink"}`}
              >
                <Settings className="size-5" />
                ระบบแอดมิน
              </Link>
            ) : null}
          </nav>
          <div className="mt-auto grid gap-2 pt-6 text-sm">
            <div className="rounded-lg bg-cream px-3 py-2">
              เครื่องนี้: {terminalName}
              <div className="text-muted">{printMode === "auto" ? "พิมพ์อัตโนมัติหลังขาย" : "แสดงใบเสร็จให้บันทึก PDF"}</div>
            </div>
            <Button
              variant="sand"
              onClick={() => {
                setName(terminalName);
                setMode(printMode);
                setTerminalOpen(true);
              }}
            >
              ตั้งค่าเครื่องนี้
            </Button>
            <p className="text-xs text-muted">ข้อมูลขายเก็บบนเบราว์เซอร์ของเครื่องนี้ สำรองไฟล์ได้ในเมนูแอดมิน</p>
          </div>
        </aside>

        <main className="mx-auto min-w-0 max-w-7xl p-3 sm:p-4">{children}</main>
        <ReceiptDialog />
        {notice ? (
          <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4">
            <div className="max-w-md rounded-lg bg-brand px-4 py-3 text-sm text-brand-ink shadow-lg">{notice.text}</div>
          </div>
        ) : null}
        {terminalOpen ? (
          <Modal title="ตั้งค่าเครื่องนี้" onClose={() => setTerminalOpen(false)}>
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                setTerminal(name, mode);
                setTerminalOpen(false);
              }}
            >
              <Field label="ชื่อเครื่อง">
                <TextInput value={name} onChange={(event) => setName(event.target.value)} placeholder="POS-1" />
              </Field>
              <Field label="โหมดพิมพ์">
                <SelectInput value={mode} onChange={(event) => setMode(event.target.value as PrintMode)}>
                  <option value="auto">พิมพ์อัตโนมัติหลังขาย</option>
                  <option value="pdf">แสดงใบเสร็จ (บันทึก PDF)</option>
                </SelectInput>
              </Field>
              <p className="text-sm text-muted">ค่านี้เก็บเฉพาะเครื่องนี้ ไม่กระทบเครื่องขายเครื่องอื่น</p>
              <div className="flex gap-2">
                <Button type="submit">บันทึก</Button>
                <Button
                  variant="sand"
                  onClick={() => {
                    setTerminal(name, mode);
                    const sample = {
                      id: "test",
                      clientUuid: "test",
                      receiptYear: new Date().getFullYear(),
                      seqNo: 0,
                      receiptShort: "TEST",
                      receiptLong: "TEST",
                      userId: user.id,
                      userName: user.name,
                      terminalName: name.trim() || "POS-1",
                      paymentMethod: "cash" as const,
                      total: 1,
                      cashReceived: 1,
                      changeAmount: 0,
                      status: "normal" as const,
                      voidedBy: null,
                      voidedByName: null,
                      voidedAt: null,
                      voidReason: null,
                      createdAt: new Date().toISOString(),
                      items: [
                        {
                          productId: "test",
                          productName: "ทดสอบการพิมพ์",
                          unitPrice: 1,
                          qty: 1,
                          lineTotal: 1,
                          trackStock: false,
                        },
                      ],
                    };
                    usePosStore.getState().requestPrint({ kind: "receipt", order: sample });
                  }}
                >
                  ทดสอบพิมพ์
                </Button>
              </div>
            </form>
          </Modal>
        ) : null}
        {leaveOpen ? (
          <Modal title="ออกจากระบบ" onClose={() => setLeaveOpen(false)}>
            <p className="text-sm">มีรายการค้างในตะกร้า จะละทิ้งแล้วออกจากระบบหรือไม่</p>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => {
                  setLeaveOpen(false);
                  logout();
                }}
              >
                ออกจากระบบ
              </Button>
              <Button variant="sand" onClick={() => setLeaveOpen(false)}>
                อยู่ต่อ
              </Button>
            </div>
          </Modal>
        ) : null}
      </div>
      <div className="print-mount" aria-hidden="true">
        {printJob?.kind === "receipt" ? <ReceiptSlip order={printJob.order} settings={usePosStore.getState().settings} /> : null}
        {printJob && printJob.kind !== "receipt" ? <PrintSheet job={printJob} /> : null}
      </div>
    </div>
  );
}

function ReceiptDialog() {
  const orderId = usePosStore((state) => state.receiptOrderId);
  const auto = usePosStore((state) => state.receiptAutoPrint);
  const order = usePosStore((state) => (Array.isArray(state.orders) ? state.orders : []).find((item) => item.id === orderId) ?? null);
  const settings = usePosStore((state) => state.settings);
  const closeReceipt = usePosStore((state) => state.closeReceipt);
  const requestPrint = usePosStore((state) => state.requestPrint);

  useEffect(() => {
    if (!order || !auto) return;
    requestPrint({ kind: "receipt", order });
    usePosStore.setState({ receiptAutoPrint: false });
  }, [auto, order, requestPrint]);

  if (!order) return null;
  return (
    <Modal title={`ใบเสร็จ ${order.receiptShort}`} onClose={closeReceipt}>
      <div className="rounded-xl border border-sand">
        <ReceiptSlip order={order} settings={settings} />
      </div>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => requestPrint({ kind: "receipt", order })}>พิมพ์ / PDF</Button>
        <Button variant="sand" onClick={closeReceipt}>
          ลูกค้าถัดไป
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted">เลือกกระดาษ 80 มม. ถ้าเครื่องพิมพ์ไม่พร้อม ให้บันทึกเป็น PDF</p>
    </Modal>
  );
}
