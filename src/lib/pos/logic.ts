import { parseCsv } from "./format";
import type { ImportPreviewRow, Order, Settings, StockMovement, User } from "./types";
import { bangkokISODate } from "./format";

const TRACK_YES = new Set(["y", "yes", "1", "ใช่", "นับ", "true"]);
const TRACK_NO = new Set(["n", "no", "0", "ไม่", "ไม่นับ", "false"]);
const OPEN = new Set(["เปิด", "y", "yes", "1", "active", "ใช้งาน", "true"]);
const CLOSED = new Set(["ปิด", "n", "no", "0", "inactive", "false"]);

export type DayStock = {
  opening: number;
  received: number;
  sold: number;
  returned: number;
  adjusted: number;
  closing: number;
};

export function stockOnDate(moves: StockMovement[], productId: string, date: string): DayStock {
  let opening = 0;
  let received = 0;
  let sold = 0;
  let returned = 0;
  let adjusted = 0;
  for (const move of moves) {
    if (move.productId !== productId) continue;
    if (move.movementDate < date) opening += move.qty;
    else if (move.movementDate === date) {
      if (move.type === "receive") received += move.qty;
      else if (move.type === "sale") sold += Math.abs(move.qty);
      else if (move.type === "void") returned += move.qty;
      else adjusted += move.qty;
    }
  }
  return {
    opening,
    received,
    sold,
    returned,
    adjusted,
    closing: opening + received - sold + returned + adjusted,
  };
}

export function movementSum(moves: StockMovement[], productId: string) {
  return moves.filter((move) => move.productId === productId).reduce((sum, move) => sum + move.qty, 0);
}

export function voidDecision(user: User, order: Order, settings: Settings, today: string) {
  if (order.status === "void") return { ok: false as const, message: "บิลนี้ถูกยกเลิกไปแล้ว" };
  if (user.role === "admin") return { ok: true as const };
  if (!settings.sellerCanVoidOwn) return { ok: false as const, message: "ผู้ขายไม่มีสิทธิ์ยกเลิกบิล" };
  const sameDay = bangkokISODate(new Date(order.createdAt)) === today;
  if (order.userId !== user.id || !sameDay) {
    return { ok: false as const, message: "ผู้ขายยกเลิกได้เฉพาะบิลของตนเองภายในวันนี้" };
  }
  return { ok: true as const };
}

export function previewMenuImport(text: string): ImportPreviewRow[] {
  const table = parseCsv(text);
  if (table.length === 0) return [];
  let start = 0;
  let idx = { sku: 0, category: 1, name: 2, price: 3, track: 4, stock: 5, status: 6 };
  const head = table[0].map((cell) => cell.trim().toLowerCase());
  const known = ["sku", "รหัสเมนู", "หมวดหมู่", "category", "ชื่อเมนู", "name", "ราคา", "price", "นับสต๊อก", "track", "สต๊อกเริ่มต้น", "stock", "สถานะ", "status"];
  if (head.some((cell) => known.includes(cell))) {
    start = 1;
    const find = (...names: string[]) => head.findIndex((cell) => names.includes(cell));
    idx = {
      sku: find("sku", "รหัสเมนู"),
      category: find("หมวดหมู่", "category"),
      name: find("ชื่อเมนู", "name"),
      price: find("ราคา", "price"),
      track: find("นับสต๊อก", "track"),
      stock: find("สต๊อกเริ่มต้น", "stock"),
      status: find("สถานะ", "status"),
    };
  }
  const seen = new Set<string>();
  const rows: ImportPreviewRow[] = [];
  for (let i = start; i < table.length; i += 1) {
    const line = table[i];
    const cell = (index: number) => (index >= 0 ? (line[index] ?? "").trim() : "");
    const sku = cell(idx.sku);
    const category = cell(idx.category);
    const name = cell(idx.name);
    const price = Number(cell(idx.price).replace(/,/g, ""));
    const trackRaw = cell(idx.track).toLowerCase();
    const stock = cell(idx.stock) === "" ? 0 : Number(cell(idx.stock).replace(/,/g, ""));
    const statusRaw = cell(idx.status).toLowerCase();
    let error: string | null = null;
    if (!sku) error = "ไม่มีรหัสเมนู";
    else if (seen.has(sku.toLowerCase())) error = "รหัสเมนูซ้ำในไฟล์";
    else if (!category) error = "ไม่มีหมวดหมู่";
    else if (!name) error = "ไม่มีชื่อเมนู";
    else if (!Number.isFinite(price) || price < 0) error = "ราคาไม่ถูกต้อง";
    else if (trackRaw && !TRACK_YES.has(trackRaw) && !TRACK_NO.has(trackRaw)) error = "นับสต๊อกต้องเป็น Y หรือ N";
    else if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) error = "สต๊อกเริ่มต้นต้องเป็นจำนวนเต็มตั้งแต่ 0";
    else if (statusRaw && !OPEN.has(statusRaw) && !CLOSED.has(statusRaw)) error = "สถานะต้องเป็น เปิด หรือ ปิด";
    if (sku) seen.add(sku.toLowerCase());
    rows.push({
      line: i + 1,
      sku,
      category,
      name,
      price: Number.isFinite(price) ? price : 0,
      track: !TRACK_NO.has(trackRaw),
      stock: Number.isFinite(stock) ? stock : 0,
      active: !CLOSED.has(statusRaw),
      error,
    });
  }
  return rows;
}

export function systemCash(orders: Order[], date: string) {
  return orders
    .filter((order) => order.status === "normal" && order.paymentMethod === "cash" && bangkokISODate(new Date(order.createdAt)) === date)
    .reduce((sum, order) => sum + order.total, 0);
}
