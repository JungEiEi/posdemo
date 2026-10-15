import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  bangkokISODate,
  bangkokYear,
  baht,
  receiptNumbers,
  roleLabel,
  roundMoney,
  uid,
} from "./format";
import { movementSum, voidDecision } from "./logic";
import { seedData } from "./seed";
import type {
  ActivityLog,
  CashCount,
  Category,
  ImportPreviewRow,
  LogLevel,
  Notice,
  Order,
  OrderItem,
  PayMethod,
  PrintJob,
  PrintMode,
  Product,
  ProductInput,
  Result,
  Settings,
  Snapshot,
  StockMovement,
  User,
  UserInput,
} from "./types";

type CheckoutInput = { paymentMethod: PayMethod; cashReceived: number | null };

type CheckoutResult =
  | { ok: true; order: Order; duplicate?: boolean }
  | { ok: false; message: string };

type PosState = Snapshot & {
  hydrated: boolean;
  notice: Notice | null;
  printJob: PrintJob | null;
  printTicket: number;
  receiptOrderId: string | null;
  receiptAutoPrint: boolean;
  login: (username: string, password: string) => Result;
  logout: () => void;
  notify: (text: string) => void;
  addToCart: (productId: string) => void;
  changeQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  checkout: (input: CheckoutInput) => CheckoutResult;
  voidOrder: (orderId: string, reason: string) => Result;
  receiveStock: (productId: string, qty: number, date: string, note: string) => Result;
  adjustStock: (productId: string, nextQty: number, date: string, note: string) => Result;
  saveCategory: (input: { id?: string; name: string }) => Result;
  moveCategory: (id: string, dir: -1 | 1) => void;
  setCategoryActive: (id: string, isActive: boolean) => void;
  saveProduct: (input: ProductInput) => Result;
  setProductActive: (id: string, isActive: boolean) => void;
  saveUser: (input: UserInput) => Result;
  updateSettings: (patch: Partial<Settings>) => Result;
  saveCashCount: (input: { date: string; counts: Record<string, number>; coin: number; total: number; system: number }) => Result;
  setTerminal: (name: string, mode: PrintMode) => void;
  requestPrint: (job: PrintJob) => void;
  openReceipt: (orderId: string, auto: boolean) => void;
  closeReceipt: () => void;
  applyImport: (rows: ImportPreviewRow[]) => Result;
  restoreSnapshot: (data: unknown) => Result;
  recalcStock: () => Result;
  resetDemo: () => void;
  exportSnapshot: () => string;
};

const SNAPSHOT_KEYS = [
  "users",
  "categories",
  "products",
  "orders",
  "movements",
  "logs",
  "settings",
  "cashCounts",
  "receiptYear",
  "receiptSeq",
  "sessionUserId",
  "terminalName",
  "printMode",
  "cart",
  "clientUuid",
  "fails",
] as const;

function persistedSnapshot(value: unknown): Partial<Snapshot> | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<Snapshot>;
  if (!Array.isArray(raw.users) || !Array.isArray(raw.products) || !Array.isArray(raw.categories)) return null;
  const users = raw.users.filter((user) => user && typeof user.id === "string" && typeof user.username === "string");
  const products = raw.products.filter((product) => product && typeof product.id === "string" && typeof product.name === "string");
  const categories = raw.categories.filter((category) => category && typeof category.id === "string");
  const sessionUserId =
    typeof raw.sessionUserId === "string" && users.some((user) => user.id === raw.sessionUserId && user.isActive) ? raw.sessionUserId : null;
  const next: Partial<Snapshot> = { users, products, categories, sessionUserId };
  for (const key of SNAPSHOT_KEYS) {
    if (key in next) continue;
    const item = raw[key];
    if (item !== undefined) (next as Record<string, unknown>)[key] = item;
  }
  next.orders = Array.isArray(raw.orders) ? raw.orders : [];
  next.movements = Array.isArray(raw.movements) ? raw.movements : [];
  next.logs = Array.isArray(raw.logs) ? raw.logs : [];
  next.cashCounts = Array.isArray(raw.cashCounts) ? raw.cashCounts : [];
  next.cart = Array.isArray(raw.cart) ? raw.cart.filter((line) => line && typeof line.productId === "string" && line.qty > 0) : [];
  next.fails = raw.fails && typeof raw.fails === "object" ? raw.fails : {};
  next.settings = { ...seedData().settings, ...(raw.settings && typeof raw.settings === "object" ? raw.settings : {}) };
  return next;
}

function actor(user: User) {
  return `${roleLabel(user.role)} ${user.name}`;
}

function makeLog(
  state: Snapshot,
  entry: { actionCode: string; messageTh: string; level: LogLevel; user: User | null },
): ActivityLog {
  return {
    id: uid("log"),
    actionCode: entry.actionCode,
    messageTh: entry.messageTh,
    level: entry.level,
    userId: entry.user?.id ?? null,
    userName: entry.user?.name ?? null,
    terminalName: state.terminalName,
    createdAt: new Date().toISOString(),
  };
}

function withLog(state: Snapshot, entry: Parameters<typeof makeLog>[1]) {
  return [makeLog(state, entry), ...state.logs].slice(0, 2000);
}

const storage = createJSONStorage(() => ({
  getItem: (key: string) => (typeof window === "undefined" ? null : window.localStorage.getItem(key)),
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* quota */
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  },
}));

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      ...seedData(),
      hydrated: false,
      notice: null,
      printJob: null,
      printTicket: 0,
      receiptOrderId: null,
      receiptAutoPrint: false,

      notify: (text) => set({ notice: { id: Date.now(), text } }),

      login: (username, password) => {
        const state = get();
        const key = username.trim().toLowerCase();
        if (!key) return { ok: false, message: "กรอกชื่อผู้ใช้" };
        const fail = state.fails[key];
        const nowMs = Date.now();
        if (fail && fail.lockedUntil > nowMs) {
          const sec = Math.ceil((fail.lockedUntil - nowMs) / 1000);
          return { ok: false, message: `พยายามหลายครั้งเกินไป ลองใหม่ใน ${sec} วินาที` };
        }
        const user = state.users.find((item) => item.username.toLowerCase() === key);
        if (!user || user.password !== password) {
          const count = (fail?.count ?? 0) + 1;
          const lockedUntil = count >= 5 ? nowMs + 60_000 : 0;
          const who = username.trim();
          set({
            fails: { ...state.fails, [key]: { count: lockedUntil ? 0 : count, lockedUntil } },
            logs: withLog(state, {
              actionCode: "login_fail",
              level: "warning",
              user: user ?? null,
              messageTh: `เข้าสู่ระบบไม่สำเร็จ ชื่อผู้ใช้ ${who} รหัสผ่านไม่ถูกต้อง (ครั้งที่ ${count})`,
            }),
            notice: { id: nowMs, text: lockedUntil ? "รหัสไม่ถูกต้องครบ 5 ครั้ง ล็อก 1 นาที" : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
          });
          return { ok: false, message: lockedUntil ? "รหัสไม่ถูกต้องครบ 5 ครั้ง ล็อก 1 นาที" : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
        }
        if (!user.isActive) {
          set({
            logs: withLog(state, {
              actionCode: "login_fail",
              level: "warning",
              user,
              messageTh: `ผู้ใช้ ${user.username} (${roleLabel(user.role)}) พยายามเข้าสู่ระบบ แต่บัญชีถูกปิด`,
            }),
            notice: { id: nowMs, text: "บัญชีนี้ถูกปิดใช้งาน" },
          });
          return { ok: false, message: "บัญชีนี้ถูกปิดใช้งาน" };
        }
        const fails = { ...state.fails };
        delete fails[key];
        set({
          fails,
          sessionUserId: user.id,
          logs: withLog(state, {
            actionCode: "login",
            level: "info",
            user,
            messageTh: `ผู้ใช้ ${user.username} (${roleLabel(user.role)}) เข้าสู่ระบบ จากเครื่อง ${state.terminalName}`,
          }),
        });
        return { ok: true };
      },

      logout: () => {
        const state = get();
        const user = state.users.find((item) => item.id === state.sessionUserId) ?? null;
        set({
          sessionUserId: null,
          cart: [],
          clientUuid: uid("cart"),
          logs: user
            ? withLog(state, {
                actionCode: "logout",
                level: "info",
                user,
                messageTh: `${actor(user)} ออกจากระบบ (เครื่อง ${state.terminalName})`,
              })
            : state.logs,
        });
      },

      addToCart: (productId) => {
        const state = get();
        const product = state.products.find((item) => item.id === productId);
        if (!product || !product.isActive) return;
        const category = state.categories.find((item) => item.id === product.categoryId);
        if (!category?.isActive) return;
        if (product.trackStock && product.stockQty <= 0) {
          set({ notice: { id: Date.now(), text: `${product.name} หมด` } });
          return;
        }
        const line = state.cart.find((item) => item.productId === productId);
        const nextQty = (line?.qty ?? 0) + 1;
        if (product.trackStock && nextQty > product.stockQty) {
          set({ notice: { id: Date.now(), text: `${product.name} เหลือ ${product.stockQty} ชิ้น` } });
          return;
        }
        const cart = line
          ? state.cart.map((item) => (item.productId === productId ? { ...item, qty: nextQty } : item))
          : [...state.cart, { productId, qty: 1 }];
        set({ cart, clientUuid: state.clientUuid === "cart-seed" ? uid("cart") : state.clientUuid });
      },

      changeQty: (productId, delta) => {
        const state = get();
        const line = state.cart.find((item) => item.productId === productId);
        if (!line) return;
        const product = state.products.find((item) => item.id === productId);
        const nextQty = line.qty + delta;
        if (nextQty <= 0) {
          set({ cart: state.cart.filter((item) => item.productId !== productId) });
          return;
        }
        if (product?.trackStock && nextQty > product.stockQty) {
          set({ notice: { id: Date.now(), text: `${product.name} เหลือ ${product.stockQty} ชิ้น` } });
          return;
        }
        set({ cart: state.cart.map((item) => (item.productId === productId ? { ...item, qty: nextQty } : item)) });
      },

      clearCart: () => set({ cart: [], clientUuid: uid("cart") }),

      checkout: (input) => {
        const state = get();
        const existing = state.orders.find((order) => order.clientUuid === state.clientUuid);
        if (existing) return { ok: true, order: existing, duplicate: true };
        const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
        if (!user) return { ok: false, message: "กรุณาเข้าสู่ระบบ" };
        if (state.cart.length === 0) return { ok: false, message: "ยังไม่มีรายการในตะกร้า" };
        if (input.paymentMethod === "transfer" && !state.settings.allowTransfer) {
          return { ok: false, message: "ปิดรับชำระด้วยการโอน" };
        }
        if (input.paymentMethod === "credit" && !state.settings.allowCredit) {
          return { ok: false, message: "ปิดรับชำระด้วยบัตรเครดิต" };
        }

        const sorted = [...state.cart].sort((a, b) => a.productId.localeCompare(b.productId));
        const items: OrderItem[] = [];
        let total = 0;
        for (const line of sorted) {
          const product = state.products.find((item) => item.id === line.productId);
          const qty = Math.floor(line.qty);
          if (!product || !product.isActive || qty <= 0) {
            return { ok: false, message: "มีสินค้าที่ปิดขายอยู่ในตะกร้า" };
          }
          if (product.trackStock && product.stockQty < qty) {
            const available = Math.max(0, product.stockQty);
            const cart =
              available <= 0
                ? state.cart.filter((item) => item.productId !== product.id)
                : state.cart.map((item) => (item.productId === product.id ? { ...item, qty: available } : item));
            const message = `${product.name} เหลือ ${product.stockQty} ชิ้น แต่ต้องการ ${qty} ชิ้น`;
            set({
              cart,
              logs: withLog(state, {
                actionCode: "sale_fail",
                level: "warning",
                user,
                messageTh: `ไม่สามารถออกบิลได้ ${message} (เครื่อง ${state.terminalName})`,
              }),
              notice: { id: Date.now(), text: message },
            });
            return { ok: false, message };
          }
          const unitPrice = roundMoney(product.price);
          const lineTotal = roundMoney(unitPrice * qty);
          total = roundMoney(total + lineTotal);
          items.push({
            productId: product.id,
            productName: product.name,
            unitPrice,
            qty,
            lineTotal,
            trackStock: product.trackStock,
          });
        }
        if (items.length === 0) return { ok: false, message: "ยังไม่มีรายการในตะกร้า" };

        let cashReceived: number | null = null;
        let changeAmount: number | null = null;
        if (input.paymentMethod === "cash") {
          const cash = roundMoney(input.cashReceived ?? 0);
          if (cash < total) return { ok: false, message: "เงินที่รับไม่พอ" };
          cashReceived = cash;
          changeAmount = roundMoney(cash - total);
        }

        const today = bangkokISODate();
        const year = bangkokYear();
        const seq = state.receiptYear === year ? state.receiptSeq + 1 : 1;
        const numbers = receiptNumbers(year, seq);
        const now = new Date().toISOString();
        const orderId = uid("ord");
        const used = new Map(items.filter((item) => item.trackStock).map((item) => [item.productId, item.qty]));
        const products = state.products.map((product) => {
          const qty = used.get(product.id);
          return qty ? { ...product, stockQty: product.stockQty - qty } : product;
        });
        const movements: StockMovement[] = [...state.movements];
        for (const item of items) {
          if (!item.trackStock) continue;
          const after = products.find((product) => product.id === item.productId)?.stockQty ?? 0;
          movements.push({
            id: uid("mv"),
            productId: item.productId,
            type: "sale",
            qty: -item.qty,
            stockAfter: after,
            orderId,
            userId: user.id,
            userName: user.name,
            note: "ขาย",
            movementDate: today,
            createdAt: now,
          });
        }
        const order: Order = {
          id: orderId,
          clientUuid: state.clientUuid,
          receiptYear: year,
          seqNo: seq,
          receiptShort: numbers.short,
          receiptLong: numbers.long,
          userId: user.id,
          userName: user.name,
          terminalName: state.terminalName,
          paymentMethod: input.paymentMethod,
          total,
          cashReceived,
          changeAmount,
          status: "normal",
          voidedBy: null,
          voidedByName: null,
          voidedAt: null,
          voidReason: null,
          createdAt: now,
          items,
        };
        set({
          products,
          movements,
          orders: [order, ...state.orders],
          receiptYear: year,
          receiptSeq: seq,
          cart: [],
          clientUuid: uid("cart"),
          logs: withLog(state, {
            actionCode: "sale",
            level: "info",
            user,
            messageTh: `${actor(user)} ออกบิล ${numbers.short} ยอด ${baht(total)} บาท ชำระด้วย${payName(input.paymentMethod)} (เครื่อง ${state.terminalName})`,
          }),
          notice: { id: Date.now(), text: `ขายสำเร็จ ${numbers.short}` },
          receiptOrderId: order.id,
          receiptAutoPrint: state.printMode === "auto",
        });
        return { ok: true, order };
      },

      voidOrder: (orderId, reason) => {
        const state = get();
        const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
        if (!user) return { ok: false, message: "กรุณาเข้าสู่ระบบ" };
        const reasonText = reason.trim();
        if (!reasonText) return { ok: false, message: "กรุณาระบุเหตุผล" };
        const order = state.orders.find((item) => item.id === orderId);
        if (!order) return { ok: false, message: "ไม่พบบิล" };
        const today = bangkokISODate();
        const decision = voidDecision(user, order, state.settings, today);
        if (!decision.ok) {
          set({
            logs: withLog(state, {
              actionCode: "void_denied",
              level: "warning",
              user,
              messageTh: `${actor(user)} พยายามยกเลิกบิล ${order.receiptShort} — ${decision.message}`,
            }),
            notice: { id: Date.now(), text: decision.message },
          });
          return decision;
        }
        const now = new Date().toISOString();
        let products = state.products;
        const movements = [...state.movements];
        for (const item of order.items) {
          if (!item.trackStock) continue;
          products = products.map((product) =>
            product.id === item.productId ? { ...product, stockQty: product.stockQty + item.qty } : product,
          );
          const after = products.find((product) => product.id === item.productId)?.stockQty ?? item.qty;
          movements.push({
            id: uid("mv"),
            productId: item.productId,
            type: "void",
            qty: item.qty,
            stockAfter: after,
            orderId: order.id,
            userId: user.id,
            userName: user.name,
            note: "คืนจากยกเลิกบิล",
            movementDate: today,
            createdAt: now,
          });
        }
        set({
          products,
          movements,
          orders: state.orders.map((item) =>
            item.id === order.id
              ? { ...item, status: "void", voidedBy: user.id, voidedByName: user.name, voidedAt: now, voidReason: reasonText }
              : item,
          ),
          logs: withLog(state, {
            actionCode: "void",
            level: "info",
            user,
            messageTh: `${actor(user)} ยกเลิกบิล ${order.receiptShort} ยอด ${baht(order.total)} บาท เหตุผล: ${reasonText} (เครื่อง ${state.terminalName})`,
          }),
          notice: { id: Date.now(), text: `ยกเลิกบิล ${order.receiptShort} แล้ว` },
        });
        return { ok: true };
      },

      receiveStock: (productId, qty, date, note) => {
        const state = get();
        const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
        if (!user) return { ok: false, message: "กรุณาเข้าสู่ระบบ" };
        const amount = Math.floor(qty);
        if (!Number.isFinite(amount) || amount <= 0) return { ok: false, message: "จำนวนรับเข้าต้องมากกว่า 0" };
        const today = bangkokISODate();
        if (user.role !== "admin" && date !== today) return { ok: false, message: "ผู้ขายรับเข้าได้เฉพาะวันนี้" };
        if (date > today) return { ok: false, message: "รับเข้าล่วงหน้าไม่ได้" };
        const product = state.products.find((item) => item.id === productId);
        if (!product) return { ok: false, message: "ไม่พบสินค้า" };
        if (!product.trackStock) return { ok: false, message: "เมนูนี้ทำสด ไม่นับสต๊อก" };
        const after = product.stockQty + amount;
        const now = new Date().toISOString();
        const movement: StockMovement = {
          id: uid("mv"),
          productId,
          type: "receive",
          qty: amount,
          stockAfter: after,
          orderId: null,
          userId: user.id,
          userName: user.name,
          note: note.trim() || "รับเข้า",
          movementDate: date,
          createdAt: now,
        };
        set({
          products: state.products.map((item) => (item.id === productId ? { ...item, stockQty: after } : item)),
          movements: [...state.movements, movement],
          logs: withLog(state, {
            actionCode: "stock_in",
            level: "info",
            user,
            messageTh: `${actor(user)} เพิ่มสต๊อก ${product.name} +${amount} (คงเหลือ ${after})`,
          }),
          notice: { id: Date.now(), text: `รับเข้า ${product.name} +${amount}` },
        });
        return { ok: true };
      },

      adjustStock: (productId, nextQty, date, note) => {
        const state = get();
        const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
        if (!user) return { ok: false, message: "กรุณาเข้าสู่ระบบ" };
        if (user.role !== "admin") return { ok: false, message: "เฉพาะแอดมินปรับยอดได้" };
        const qty = Math.floor(nextQty);
        if (!Number.isFinite(qty) || qty < 0) return { ok: false, message: "ยอดคงเหลือต้องเป็นจำนวนเต็มตั้งแต่ 0" };
        const today = bangkokISODate();
        if (date > today) return { ok: false, message: "ปรับยอดล่วงหน้าไม่ได้" };
        const product = state.products.find((item) => item.id === productId);
        if (!product) return { ok: false, message: "ไม่พบสินค้า" };
        if (!product.trackStock) return { ok: false, message: "เมนูนี้ไม่นับสต๊อก" };
        const delta = qty - product.stockQty;
        if (delta === 0) return { ok: false, message: "ยอดไม่เปลี่ยน" };
        const now = new Date().toISOString();
        const movement: StockMovement = {
          id: uid("mv"),
          productId,
          type: "adjust",
          qty: delta,
          stockAfter: qty,
          orderId: null,
          userId: user.id,
          userName: user.name,
          note: note.trim() || "ปรับยอด",
          movementDate: date,
          createdAt: now,
        };
        set({
          products: state.products.map((item) => (item.id === productId ? { ...item, stockQty: qty } : item)),
          movements: [...state.movements, movement],
          logs: withLog(state, {
            actionCode: "stock_adjust",
            level: "info",
            user,
            messageTh: `${actor(user)} ปรับสต๊อก ${product.name} ${delta > 0 ? "+" : ""}${delta} (คงเหลือ ${qty})`,
          }),
          notice: { id: Date.now(), text: `ปรับ ${product.name} เป็น ${qty}` },
        });
        return { ok: true };
      },

      saveCategory: ({ id, name }) => {
        const state = get();
        const user = adminOf(state);
        if (!user) return { ok: false, message: "เฉพาะแอดมิน" };
        const trimmed = name.trim();
        if (!trimmed) return { ok: false, message: "กรอกชื่อหมวด" };
        if (state.categories.some((item) => item.name === trimmed && item.id !== id)) {
          return { ok: false, message: "มีหมวดชื่อนี้อยู่แล้ว" };
        }
        let categories: Category[];
        let message: string;
        if (id) {
          categories = state.categories.map((item) => (item.id === id ? { ...item, name: trimmed } : item));
          message = `${actor(user)} แก้ชื่อหมวดหมู่เป็น ${trimmed}`;
        } else {
          const sortOrder = Math.max(0, ...state.categories.map((item) => item.sortOrder)) + 1;
          categories = [...state.categories, { id: uid("cat"), name: trimmed, sortOrder, isActive: true }];
          message = `${actor(user)} เพิ่มหมวดหมู่ ${trimmed}`;
        }
        set({
          categories,
          logs: withLog(state, { actionCode: "category", level: "info", user, messageTh: message }),
          notice: { id: Date.now(), text: id ? "บันทึกหมวดแล้ว" : "เพิ่มหมวดแล้ว" },
        });
        return { ok: true };
      },

      moveCategory: (id, dir) => {
        const state = get();
        if (!adminOf(state)) return;
        const sorted = [...state.categories].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "th"));
        const index = sorted.findIndex((item) => item.id === id);
        const target = index + dir;
        if (index < 0 || target < 0 || target >= sorted.length) return;
        const next = [...sorted];
        const [row] = next.splice(index, 1);
        next.splice(target, 0, row);
        set({ categories: next.map((item, order) => ({ ...item, sortOrder: order + 1 })) });
      },

      setCategoryActive: (id, isActive) => {
        const state = get();
        const user = adminOf(state);
        if (!user) return;
        const category = state.categories.find((item) => item.id === id);
        if (!category) return;
        set({
          categories: state.categories.map((item) => (item.id === id ? { ...item, isActive } : item)),
          logs: withLog(state, {
            actionCode: "category",
            level: "info",
            user,
            messageTh: `${actor(user)} ${isActive ? "เปิด" : "ปิด"}หมวดหมู่ ${category.name}`,
          }),
        });
      },

      saveProduct: (input) => {
        const state = get();
        const user = adminOf(state);
        if (!user) return { ok: false, message: "เฉพาะแอดมิน" };
        const name = input.name.trim();
        const sku = input.sku.trim();
        if (!name) return { ok: false, message: "กรอกชื่อเมนู" };
        if (!sku) return { ok: false, message: "กรอกรหัสเมนู" };
        if (!state.categories.some((item) => item.id === input.categoryId)) return { ok: false, message: "เลือกหมวดหมู่" };
        if (!Number.isFinite(input.price) || input.price < 0) return { ok: false, message: "ราคาไม่ถูกต้อง" };
        if (state.products.some((item) => item.sku.toLowerCase() === sku.toLowerCase() && item.id !== input.id)) {
          return { ok: false, message: "รหัสเมนูซ้ำ" };
        }
        const price = roundMoney(input.price);
        const now = new Date().toISOString();
        const today = bangkokISODate();
        if (!input.id) {
          const stockQty = input.trackStock ? Math.max(0, Math.floor(input.stockQty) || 0) : 0;
          const id = uid("p");
          const sortOrder = Math.max(0, ...state.products.filter((item) => item.categoryId === input.categoryId).map((item) => item.sortOrder)) + 1;
          const product: Product = {
            id,
            categoryId: input.categoryId,
            sku,
            name,
            price,
            trackStock: input.trackStock,
            stockQty,
            image: input.image,
            isActive: input.isActive,
            sortOrder,
          };
          const movements = [...state.movements];
          if (input.trackStock && stockQty > 0) {
            movements.push({
              id: uid("mv"),
              productId: id,
              type: "receive",
              qty: stockQty,
              stockAfter: stockQty,
              orderId: null,
              userId: user.id,
              userName: user.name,
              note: "สต๊อกเริ่มต้น",
              movementDate: today,
              createdAt: now,
            });
          }
          set({
            products: [...state.products, product],
            movements,
            logs: withLog(state, { actionCode: "product", level: "info", user, messageTh: `${actor(user)} เพิ่มเมนู ${name} ราคา ${baht(price)} บาท` }),
            notice: { id: Date.now(), text: `เพิ่มเมนู ${name}` },
          });
          return { ok: true };
        }
        const prev = state.products.find((item) => item.id === input.id);
        if (!prev) return { ok: false, message: "ไม่พบเมนู" };
        const products = state.products.map((item) =>
          item.id === input.id
            ? { ...item, categoryId: input.categoryId, sku, name, price, trackStock: input.trackStock, image: input.image, isActive: input.isActive }
            : item,
        );
        const priceNote = prev.price !== price ? `แก้ราคาเมนู ${name} จาก ${baht(prev.price)} เป็น ${baht(price)} บาท` : `แก้เมนู ${name}`;
        set({
          products,
          logs: withLog(state, { actionCode: "product", level: "info", user, messageTh: `${actor(user)} ${priceNote}` }),
          notice: { id: Date.now(), text: "บันทึกเมนูแล้ว" },
        });
        return { ok: true };
      },

      setProductActive: (id, isActive) => {
        const state = get();
        const user = adminOf(state);
        if (!user) return;
        const product = state.products.find((item) => item.id === id);
        if (!product) return;
        set({
          products: state.products.map((item) => (item.id === id ? { ...item, isActive } : item)),
          logs: withLog(state, {
            actionCode: "product",
            level: "info",
            user,
            messageTh: `${actor(user)} ${isActive ? "เปิด" : "ปิด"}ขายเมนู ${product.name}`,
          }),
        });
      },

      saveUser: (input) => {
        const state = get();
        const actorUser = adminOf(state);
        if (!actorUser) return { ok: false, message: "เฉพาะแอดมิน" };
        const username = input.username.trim();
        const name = input.name.trim();
        if (!username || !name) return { ok: false, message: "กรอกชื่อผู้ใช้และชื่อที่แสดง" };
        if (state.users.some((item) => item.username.toLowerCase() === username.toLowerCase() && item.id !== input.id)) {
          return { ok: false, message: "ชื่อผู้ใช้ซ้ำ" };
        }
        const activeAdmins = state.users.filter((item) => item.role === "admin" && item.isActive && item.id !== input.id);
        const staysAdmin = input.role === "admin" && input.isActive;
        if (!staysAdmin && activeAdmins.length === 0) return { ok: false, message: "ต้องมีแอดมินที่ใช้งานได้อย่างน้อย 1 คน" };
        if (input.id && input.id === state.sessionUserId && !input.isActive) return { ok: false, message: "ปิดบัญชีที่กำลังใช้งานอยู่ไม่ได้" };
        if (!input.id) {
          if (!input.password || input.password.length < 4) return { ok: false, message: "รหัสผ่านอย่างน้อย 4 ตัว" };
          const user: User = { id: uid("u"), username, name, password: input.password, role: input.role, isActive: input.isActive };
          set({
            users: [...state.users, user],
            logs: withLog(state, { actionCode: "user", level: "info", user: actorUser, messageTh: `${actor(actorUser)} เพิ่มผู้ใช้ ${username} (${roleLabel(input.role)})` }),
            notice: { id: Date.now(), text: `เพิ่มผู้ใช้ ${username}` },
          });
          return { ok: true };
        }
        const prev = state.users.find((item) => item.id === input.id);
        if (!prev) return { ok: false, message: "ไม่พบผู้ใช้" };
        if (input.password && input.password.length < 4) return { ok: false, message: "รหัสผ่านอย่างน้อย 4 ตัว" };
        const users = state.users.map((item) =>
          item.id === input.id
            ? { ...item, username, name, role: input.role, isActive: input.isActive, password: input.password ? input.password : item.password }
            : item,
        );
        set({
          users,
          logs: withLog(state, { actionCode: "user", level: "info", user: actorUser, messageTh: `${actor(actorUser)} แก้ไขผู้ใช้ ${username}` }),
          notice: { id: Date.now(), text: "บันทึกผู้ใช้แล้ว" },
        });
        return { ok: true };
      },

      updateSettings: (patch) => {
        const state = get();
        const user = adminOf(state);
        if (!user) return { ok: false, message: "เฉพาะแอดมิน" };
        const next: Settings = { ...state.settings, ...patch };
        if (!Number.isFinite(next.lowStockThreshold) || next.lowStockThreshold < 1) {
          return { ok: false, message: "เกณฑ์ใกล้หมดต้องมากกว่า 0" };
        }
        next.lowStockThreshold = Math.floor(next.lowStockThreshold);
        const notes: string[] = [];
        if (patch.showImages !== undefined && patch.showImages !== state.settings.showImages) {
          notes.push(patch.showImages ? "เปิดการแสดงภาพเมนู" : "ปิดการแสดงภาพเมนู");
        }
        if (patch.logoDataUrl !== undefined && patch.logoDataUrl !== state.settings.logoDataUrl) {
          notes.push(patch.logoDataUrl ? "เปลี่ยนโลโก้โปรแกรม" : "ลบโลโก้โปรแกรม");
        }
        if (patch.companyName && patch.companyName !== state.settings.companyName) notes.push("แก้ข้อมูลบริษัทบนใบเสร็จ");
        if (patch.lowStockThreshold !== undefined && next.lowStockThreshold !== state.settings.lowStockThreshold) {
          notes.push(`ตั้งค่าสินค้าใกล้หมดเป็นต่ำกว่า ${next.lowStockThreshold} ชิ้น`);
        }
        if (patch.sellerCanVoidOwn !== undefined && patch.sellerCanVoidOwn !== state.settings.sellerCanVoidOwn) {
          notes.push(patch.sellerCanVoidOwn ? "เปิดให้ผู้ขายยกเลิกบิลของตนเองในวันเดียวกัน" : "ปิดการยกเลิกบิลโดยผู้ขาย");
        }
        set({
          settings: next,
          logs:
            notes.length > 0
              ? withLog(state, { actionCode: "settings", level: "info", user, messageTh: `${actor(user)} ${notes.join(", ")}` })
              : state.logs,
          notice: { id: Date.now(), text: "บันทึกการตั้งค่าแล้ว" },
        });
        return { ok: true };
      },

      saveCashCount: ({ date, counts, coin, total, system }) => {
        const state = get();
        const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
        if (!user) return { ok: false, message: "กรุณาเข้าสู่ระบบ" };
        const row: CashCount = {
          id: uid("cash"),
          countDate: date,
          userId: user.id,
          userName: user.name,
          counts,
          coinAmount: coin,
          totalCounted: total,
          systemCash: system,
          difference: roundMoney(total - system),
          createdAt: new Date().toISOString(),
        };
        set({
          cashCounts: [row, ...state.cashCounts],
          logs: withLog(state, {
            actionCode: "cash",
            level: "info",
            user,
            messageTh: `${actor(user)} บันทึกนำส่งเงินสดวันที่ ${date} นับได้ ${baht(total)} บาท ระบบ ${baht(system)} บาท`,
          }),
          notice: { id: Date.now(), text: "บันทึกการนำส่งเงินสดแล้ว" },
        });
        return { ok: true };
      },

      setTerminal: (name, mode) => {
        const trimmed = name.trim() || "POS-1";
        set({ terminalName: trimmed.slice(0, 32), printMode: mode });
      },

      requestPrint: (job) => set({ printJob: job, printTicket: get().printTicket + 1 }),
      openReceipt: (orderId, auto) => set({ receiptOrderId: orderId, receiptAutoPrint: auto }),
      closeReceipt: () => set({ receiptOrderId: null, receiptAutoPrint: false }),

      applyImport: (rows) => {
        const state = get();
        const user = adminOf(state);
        if (!user) return { ok: false, message: "เฉพาะแอดมิน" };
        if (rows.length === 0) return { ok: false, message: "ไม่มีแถวให้นำเข้า" };
        if (rows.some((row) => row.error)) return { ok: false, message: "มีแถวที่ไม่ผ่านการตรวจ แก้ไฟล์ก่อนนำเข้า" };
        let categories = [...state.categories];
        let products = [...state.products];
        const movements = [...state.movements];
        const today = bangkokISODate();
        const now = new Date().toISOString();
        let added = 0;
        let updated = 0;
        for (const row of rows) {
          let category = categories.find((item) => item.name === row.category);
          if (!category) {
            category = { id: uid("cat"), name: row.category, sortOrder: categories.length + 1, isActive: true };
            categories = [...categories, category];
          }
          const existing = products.find((item) => item.sku.toLowerCase() === row.sku.toLowerCase());
          if (!existing) {
            const id = uid("p");
            const stockQty = row.track ? row.stock : 0;
            products = [
              ...products,
              {
                id,
                categoryId: category.id,
                sku: row.sku,
                name: row.name,
                price: roundMoney(row.price),
                trackStock: row.track,
                stockQty,
                image: null,
                isActive: row.active,
                sortOrder: products.filter((item) => item.categoryId === category!.id).length + 1,
              },
            ];
            if (row.track && stockQty > 0) {
              movements.push({
                id: uid("mv"),
                productId: id,
                type: "receive",
                qty: stockQty,
                stockAfter: stockQty,
                orderId: null,
                userId: user.id,
                userName: user.name,
                note: "นำเข้าเมนู",
                movementDate: today,
                createdAt: now,
              });
            }
            added += 1;
          } else {
            const delta = row.track ? row.stock - (existing.trackStock ? existing.stockQty : 0) : 0;
            const stockQty = row.track ? row.stock : existing.stockQty;
            products = products.map((item) =>
              item.id === existing.id
                ? { ...item, categoryId: category!.id, name: row.name, price: roundMoney(row.price), trackStock: row.track, isActive: row.active, stockQty }
                : item,
            );
            if (row.track && delta !== 0) {
              movements.push({
                id: uid("mv"),
                productId: existing.id,
                type: "adjust",
                qty: delta,
                stockAfter: stockQty,
                orderId: null,
                userId: user.id,
                userName: user.name,
                note: "นำเข้าเมนูปรับยอด",
                movementDate: today,
                createdAt: now,
              });
            }
            updated += 1;
          }
        }
        set({
          categories,
          products,
          movements,
          logs: withLog(state, {
            actionCode: "import",
            level: "info",
            user,
            messageTh: `${actor(user)} นำเข้าเมนู เพิ่ม ${added} แก้ไข ${updated}`,
          }),
          notice: { id: Date.now(), text: `นำเข้าแล้ว เพิ่ม ${added} แก้ไข ${updated}` },
        });
        return { ok: true, message: `เพิ่ม ${added} แก้ไข ${updated}` };
      },

      restoreSnapshot: (data) => {
        const state = get();
        const user = adminOf(state);
        if (!user) return { ok: false, message: "เฉพาะแอดมิน" };
        const parsed = unwrapBackup(data);
        if (!parsed) return { ok: false, message: "ไฟล์สำรองไม่ถูกต้อง" };
        const fresh = seedData();
        const restoredLogs = Array.isArray(parsed.logs) ? parsed.logs : [];
        const restoreLog = makeLog(state, {
          actionCode: "restore",
          messageTh: `${actor(user)} กู้คืนข้อมูลจากไฟล์สำรอง`,
          level: "warning",
          user,
        });
        set({
          ...fresh,
          ...parsed,
          settings: { ...fresh.settings, ...parsed.settings },
          terminalName: state.terminalName,
          printMode: state.printMode,
          sessionUserId: parsed.users?.some((item) => item.id === state.sessionUserId && item.isActive) ? state.sessionUserId : null,
          cart: [],
          clientUuid: uid("cart"),
          fails: {},
          hydrated: true,
          notice: { id: Date.now(), text: "กู้คืนข้อมูลแล้ว" },
          logs: [restoreLog, ...restoredLogs].slice(0, 2000),
        });
        return { ok: true };
      },

      recalcStock: () => {
        const state = get();
        const user = adminOf(state);
        if (!user) return { ok: false, message: "เฉพาะแอดมิน" };
        let changed = 0;
        const products = state.products.map((product) => {
          if (!product.trackStock) return product;
          const sum = movementSum(state.movements, product.id);
          if (sum !== product.stockQty) changed += 1;
          return { ...product, stockQty: sum };
        });
        set({
          products,
          logs: withLog(state, {
            actionCode: "recalc",
            level: "info",
            user,
            messageTh: `${actor(user)} คำนวณสต๊อกใหม่จากประวัติ ปรับ ${changed} รายการ`,
          }),
          notice: { id: Date.now(), text: changed ? `ปรับสต๊อก ${changed} รายการ` : "สต๊อกตรงกับประวัติอยู่แล้ว" },
        });
        return { ok: true };
      },

      resetDemo: () => {
        const state = get();
        const fresh = seedData();
        set({
          ...fresh,
          terminalName: state.terminalName,
          printMode: state.printMode,
          hydrated: true,
          notice: { id: Date.now(), text: "กลับไปข้อมูลตัวอย่างแล้ว" },
          printJob: null,
          receiptOrderId: null,
          receiptAutoPrint: false,
        });
      },

      exportSnapshot: () => {
        const state = get();
        const data: Snapshot = {
          users: state.users,
          categories: state.categories,
          products: state.products,
          orders: state.orders,
          movements: state.movements,
          logs: state.logs,
          settings: state.settings,
          cashCounts: state.cashCounts,
          receiptYear: state.receiptYear,
          receiptSeq: state.receiptSeq,
          sessionUserId: null,
          terminalName: state.terminalName,
          printMode: state.printMode,
          cart: [],
          clientUuid: "cart-seed",
          fails: {},
        };
        const user = state.users.find((item) => item.id === state.sessionUserId) ?? null;
        if (user) {
          set({
            logs: withLog(state, { actionCode: "backup", level: "info", user, messageTh: `${actor(user)} สำรองข้อมูลเป็นไฟล์` }),
          });
        }
        return JSON.stringify({ app: "onedaypos", version: 1, exportedAt: new Date().toISOString(), data }, null, 2);
      },
    }),
    {
      name: "onedaypos-v1",
      skipHydration: true,
      storage,
      merge: (persisted, current) => {
        const safe = persistedSnapshot(persisted);
        return safe ? { ...current, ...safe } : current;
      },
      partialize: (state) => ({
        users: state.users,
        categories: state.categories,
        products: state.products,
        orders: state.orders,
        movements: state.movements,
        logs: state.logs,
        settings: state.settings,
        cashCounts: state.cashCounts,
        receiptYear: state.receiptYear,
        receiptSeq: state.receiptSeq,
        sessionUserId: state.sessionUserId,
        terminalName: state.terminalName,
        printMode: state.printMode,
        cart: state.cart,
        clientUuid: state.clientUuid,
        fails: state.fails,
      }),
    },
  ),
);

function adminOf(state: Snapshot) {
  const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
  if (!user || user.role !== "admin") return null;
  return user;
}

function payName(method: PayMethod) {
  if (method === "cash") return "เงินสด";
  if (method === "transfer") return "โอนเงิน";
  return "บัตรเครดิต";
}

function unwrapBackup(data: unknown): Partial<Snapshot> | null {
  if (!data || typeof data !== "object") return null;
  const record = data as { data?: unknown; users?: unknown };
  const body = record.data && typeof record.data === "object" ? (record.data as Partial<Snapshot>) : (record as Partial<Snapshot>);
  if (!Array.isArray(body.users) || !Array.isArray(body.products) || !Array.isArray(body.orders) || !Array.isArray(body.categories)) {
    return null;
  }
  return body;
}

export function useSessionUser() {
  return usePosStore((state) => {
    if (!state.sessionUserId || !Array.isArray(state.users)) return null;
    const user = state.users.find((item) => item.id === state.sessionUserId) ?? null;
    if (!user?.isActive) return null;
    return user;
  });
}
