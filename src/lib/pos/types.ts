export type Role = "admin" | "seller";
export type PayMethod = "cash" | "transfer" | "credit";
export type OrderStatus = "normal" | "void";
export type MoveType = "receive" | "sale" | "void" | "adjust";
export type LogLevel = "info" | "warning" | "error";
export type PrintMode = "auto" | "pdf";

export type User = {
  id: string;
  username: string;
  name: string;
  password: string;
  role: Role;
  isActive: boolean;
};

export type Category = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  sku: string;
  name: string;
  price: number;
  trackStock: boolean;
  stockQty: number;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type CartLine = { productId: string; qty: number };

export type OrderItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  trackStock: boolean;
};

export type Order = {
  id: string;
  clientUuid: string;
  receiptYear: number;
  seqNo: number;
  receiptShort: string;
  receiptLong: string;
  userId: string;
  userName: string;
  terminalName: string;
  paymentMethod: PayMethod;
  total: number;
  cashReceived: number | null;
  changeAmount: number | null;
  status: OrderStatus;
  voidedBy: string | null;
  voidedByName: string | null;
  voidedAt: string | null;
  voidReason: string | null;
  createdAt: string;
  items: OrderItem[];
};

export type StockMovement = {
  id: string;
  productId: string;
  type: MoveType;
  qty: number;
  stockAfter: number;
  orderId: string | null;
  userId: string;
  userName: string;
  note: string;
  movementDate: string;
  createdAt: string;
};

export type ActivityLog = {
  id: string;
  actionCode: string;
  messageTh: string;
  level: LogLevel;
  userId: string | null;
  userName: string | null;
  terminalName: string | null;
  createdAt: string;
};

export type Settings = {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  showImages: boolean;
  lowStockThreshold: number;
  logoDataUrl: string | null;
  sellerCanVoidOwn: boolean;
  allowTransfer: boolean;
  allowCredit: boolean;
};

export type CashCount = {
  id: string;
  countDate: string;
  userId: string;
  userName: string;
  counts: Record<string, number>;
  coinAmount: number;
  totalCounted: number;
  systemCash: number;
  difference: number;
  createdAt: string;
};

export type FailState = { count: number; lockedUntil: number };

export type Snapshot = {
  users: User[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  movements: StockMovement[];
  logs: ActivityLog[];
  settings: Settings;
  cashCounts: CashCount[];
  receiptYear: number;
  receiptSeq: number;
  sessionUserId: string | null;
  terminalName: string;
  printMode: PrintMode;
  cart: CartLine[];
  clientUuid: string;
  fails: Record<string, FailState>;
};

export type Notice = { id: number; text: string };

export type SalesPrintJob = {
  kind: "sales";
  from: string;
  to: string;
  pay: "all" | PayMethod;
  cashDate: string;
  counts: Record<string, number>;
  coin: number;
};

export type PrintJob =
  | { kind: "receipt"; order: Order }
  | SalesPrintJob
  | { kind: "items"; from: string; to: string }
  | { kind: "voids"; from: string; to: string };

export type ProductInput = {
  id?: string;
  categoryId: string;
  sku: string;
  name: string;
  price: number;
  trackStock: boolean;
  stockQty: number;
  image: string | null;
  isActive: boolean;
};

export type UserInput = {
  id?: string;
  username: string;
  name: string;
  password?: string;
  role: Role;
  isActive: boolean;
};

export type ImportPreviewRow = {
  line: number;
  sku: string;
  category: string;
  name: string;
  price: number;
  track: boolean;
  stock: number;
  active: boolean;
  error: string | null;
};

export type Result = { ok: true; message?: string } | { ok: false; message: string };
