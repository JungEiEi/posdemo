import type { PayMethod, Role } from "./types";

export const PAY_LABEL: Record<PayMethod, string> = {
  cash: "เงินสด",
  transfer: "โอนเงิน",
  credit: "บัตรเครดิต",
};

export const ACTION_LABEL: Record<string, string> = {
  install: "ติดตั้ง",
  login: "เข้าสู่ระบบ",
  login_fail: "เข้าสู่ระบบไม่สำเร็จ",
  logout: "ออกจากระบบ",
  sale: "ขาย",
  sale_fail: "ขายไม่สำเร็จ",
  void: "ยกเลิกบิล",
  void_denied: "ปฏิเสธการยกเลิก",
  stock_in: "รับสต๊อก",
  stock_adjust: "ปรับสต๊อก",
  product: "เมนู",
  category: "หมวดหมู่",
  settings: "ตั้งค่า",
  user: "ผู้ใช้",
  backup: "สำรองข้อมูล",
  restore: "กู้คืน",
  import: "นำเข้าเมนู",
  recalc: "คำนวณสต๊อก",
  cash: "นำส่งเงินสด",
};

export const BILL_VALUES = [1000, 500, 100, 50, 20, 10, 5, 1] as const;

export const VOID_REASONS = ["คีย์ผิดเมนู", "ลูกค้ายกเลิก", "ทอนเงินผิด", "อื่นๆ"] as const;

export function roleLabel(role: Role) {
  return role === "admin" ? "แอดมิน" : "ผู้ขาย";
}

export function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

export function baht(n: number) {
  const v = roundMoney(n);
  return v.toLocaleString("th-TH", {
    minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function uid(prefix: string) {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(16).slice(2, 10);
  return `${prefix}-${rand}`;
}

export function bangkokISODate(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function bangkokYear(d = new Date()) {
  return Number(bangkokISODate(d).slice(0, 4));
}

export function addDays(iso: string, days: number) {
  const [y, m, day] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, day ?? 1));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function formatCe(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

export function formatBe(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${Number(y) + 543}`;
}

export function orderDay(iso: string) {
  return bangkokISODate(new Date(iso));
}

export function formatCeStamp(iso: string) {
  const day = orderDay(iso);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
  return `${formatCe(day)} ${time}`;
}

export function formatBeStamp(iso: string) {
  const day = orderDay(iso);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
  return `${formatBe(day)} ${time}`;
}

export function receiptNumbers(year: number, seq: number) {
  const be2 = String((year + 543) % 100).padStart(2, "0");
  const width = Math.max(4, String(seq).length);
  const body = String(seq).padStart(width, "0");
  return { short: `MP${be2}${body}`, long: `MP${year}${body}` };
}

export function cashTotal(counts: Record<string, number>, coin: number) {
  const bills = BILL_VALUES.reduce((sum, value) => sum + value * Math.max(0, Math.floor(counts[String(value)] || 0)), 0);
  const coins = Number.isFinite(coin) ? coin : 0;
  return roundMoney(bills + Math.max(0, coins));
}

export function toCsv(rows: (string | number)[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\r\n");
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  downloadText(filename, `\uFEFF${toCsv(rows)}`, "text/csv;charset=utf-8");
}

export function parseCsv(text: string) {
  const src = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((line) => line.some((value) => value.trim() !== ""));
}

export function inRange(date: string, from: string, to: string) {
  return date >= from && date <= to;
}
