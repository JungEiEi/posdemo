import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CNKdKW2n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
var variants = {
	primary: "bg-brand text-brand-ink disabled:opacity-40",
	sand: "bg-sand text-ink disabled:opacity-40",
	ghost: "bg-transparent text-ink hover:bg-sand",
	sky: "bg-sky text-ink"
};
function Button({ variant = "primary", className = "", type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm ${variants[variant]} ${className}`,
		...props
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-sm text-muted",
			children: label
		}), children]
	});
}
var fieldClass = "h-11 w-full rounded-lg border border-sand bg-card px-3 text-ink";
function TextInput({ className = "", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: `${fieldClass} ${className}`,
		...props
	});
}
function SelectInput({ className = "", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: `${fieldClass} ${className}`,
		...props
	});
}
function TextArea({ className = "", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: `w-full rounded-lg border border-sand bg-card px-3 py-2 text-ink ${className}`,
		...props
	});
}
function Modal({ title, onClose, children, wide = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "no-print fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4",
		role: "presentation",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": title,
			className: `max-h-[92dvh] w-full overflow-auto rounded-t-2xl bg-card p-4 shadow-xl sm:rounded-2xl ${wide ? "sm:max-w-3xl" : "sm:max-w-md"}`,
			onClick: (event) => event.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg text-brand",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "ปิด",
					onClick: onClose,
					className: "grid size-11 shrink-0 place-items-center rounded-lg text-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), children]
		})
	});
}
function PageHeader({ title, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl text-brand",
				children: title
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: hint
			}) : null]
		}), children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children
		}) : null]
	});
}
function SwitchRow({ on, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "switch",
		"aria-checked": on,
		onClick,
		className: "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-sand bg-card px-3 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `grid h-7 min-w-12 place-items-center rounded-full px-2 text-xs ${on ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`,
			children: on ? "เปิด" : "ปิด"
		})]
	});
}
var PAY_LABEL = {
	cash: "เงินสด",
	transfer: "โอนเงิน",
	credit: "บัตรเครดิต"
};
var ACTION_LABEL = {
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
	cash: "นำส่งเงินสด"
};
var BILL_VALUES = [
	1e3,
	500,
	100,
	50,
	20,
	10,
	5,
	1
];
var VOID_REASONS = [
	"คีย์ผิดเมนู",
	"ลูกค้ายกเลิก",
	"ทอนเงินผิด",
	"อื่นๆ"
];
function roleLabel(role) {
	return role === "admin" ? "แอดมิน" : "ผู้ขาย";
}
function roundMoney(n) {
	return Math.round(n * 100) / 100;
}
function baht(n) {
	const v = roundMoney(n);
	return v.toLocaleString("th-TH", {
		minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
		maximumFractionDigits: 2
	});
}
function uid(prefix) {
	return `${prefix}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(16).slice(2, 10)}`;
}
function bangkokISODate(d = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Bangkok",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(d);
}
function bangkokYear(d = /* @__PURE__ */ new Date()) {
	return Number(bangkokISODate(d).slice(0, 4));
}
function addDays(iso, days) {
	const [y, m, day] = iso.split("-").map(Number);
	const dt = new Date(Date.UTC(y, (m ?? 1) - 1, day ?? 1));
	dt.setUTCDate(dt.getUTCDate() + days);
	return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}
function formatCe(isoDate) {
	const [y, m, d] = isoDate.split("-");
	return `${d}/${m}/${y}`;
}
function formatBe(isoDate) {
	const [y, m, d] = isoDate.split("-");
	return `${d}/${m}/${Number(y) + 543}`;
}
function orderDay(iso) {
	return bangkokISODate(new Date(iso));
}
function formatCeStamp(iso) {
	const day = orderDay(iso);
	const time = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Bangkok",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).format(new Date(iso));
	return `${formatCe(day)} ${time}`;
}
function formatBeStamp(iso) {
	const day = orderDay(iso);
	const time = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Bangkok",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).format(new Date(iso));
	return `${formatBe(day)} ${time}`;
}
function receiptNumbers(year, seq) {
	const be2 = String((year + 543) % 100).padStart(2, "0");
	const width = Math.max(4, String(seq).length);
	const body = String(seq).padStart(width, "0");
	return {
		short: `MP${be2}${body}`,
		long: `MP${year}${body}`
	};
}
function cashTotal(counts, coin) {
	return roundMoney(BILL_VALUES.reduce((sum, value) => sum + value * Math.max(0, Math.floor(counts[String(value)] || 0)), 0) + Math.max(0, Number.isFinite(coin) ? coin : 0));
}
function toCsv(rows) {
	return rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, "\"\"")}"`).join(",")).join("\r\n");
}
function downloadText(filename, content, mime) {
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
function downloadCsv(filename, rows) {
	downloadText(filename, `\uFEFF${toCsv(rows)}`, "text/csv;charset=utf-8");
}
function parseCsv(text) {
	const src = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	const rows = [];
	let row = [];
	let cell = "";
	let quoted = false;
	for (let i = 0; i < src.length; i += 1) {
		const ch = src[i];
		if (quoted) {
			if (ch === "\"") {
				if (src[i + 1] === "\"") {
					cell += "\"";
					i += 1;
				} else quoted = false;
			} else cell += ch;
		} else if (ch === "\"") quoted = true;
		else if (ch === ",") {
			row.push(cell);
			cell = "";
		} else if (ch === "\n") {
			row.push(cell);
			rows.push(row);
			row = [];
			cell = "";
		} else cell += ch;
	}
	if (cell.length > 0 || row.length > 0) {
		row.push(cell);
		rows.push(row);
	}
	return rows.filter((line) => line.some((value) => value.trim() !== ""));
}
function inRange(date, from, to) {
	return date >= from && date <= to;
}
var TRACK_YES = /* @__PURE__ */ new Set([
	"y",
	"yes",
	"1",
	"ใช่",
	"นับ",
	"true"
]);
var TRACK_NO = /* @__PURE__ */ new Set([
	"n",
	"no",
	"0",
	"ไม่",
	"ไม่นับ",
	"false"
]);
var OPEN = /* @__PURE__ */ new Set([
	"เปิด",
	"y",
	"yes",
	"1",
	"active",
	"ใช้งาน",
	"true"
]);
var CLOSED = /* @__PURE__ */ new Set([
	"ปิด",
	"n",
	"no",
	"0",
	"inactive",
	"false"
]);
function stockOnDate(moves, productId, date) {
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
		closing: opening + received - sold + returned + adjusted
	};
}
function movementSum(moves, productId) {
	return moves.filter((move) => move.productId === productId).reduce((sum, move) => sum + move.qty, 0);
}
function voidDecision(user, order, settings, today) {
	if (order.status === "void") return {
		ok: false,
		message: "บิลนี้ถูกยกเลิกไปแล้ว"
	};
	if (user.role === "admin") return { ok: true };
	if (!settings.sellerCanVoidOwn) return {
		ok: false,
		message: "ผู้ขายไม่มีสิทธิ์ยกเลิกบิล"
	};
	const sameDay = bangkokISODate(new Date(order.createdAt)) === today;
	if (order.userId !== user.id || !sameDay) return {
		ok: false,
		message: "ผู้ขายยกเลิกได้เฉพาะบิลของตนเองภายในวันนี้"
	};
	return { ok: true };
}
function previewMenuImport(text) {
	const table = parseCsv(text);
	if (table.length === 0) return [];
	let start = 0;
	let idx = {
		sku: 0,
		category: 1,
		name: 2,
		price: 3,
		track: 4,
		stock: 5,
		status: 6
	};
	const head = table[0].map((cell) => cell.trim().toLowerCase());
	const known = [
		"sku",
		"รหัสเมนู",
		"หมวดหมู่",
		"category",
		"ชื่อเมนู",
		"name",
		"ราคา",
		"price",
		"นับสต๊อก",
		"track",
		"สต๊อกเริ่มต้น",
		"stock",
		"สถานะ",
		"status"
	];
	if (head.some((cell) => known.includes(cell))) {
		start = 1;
		const find = (...names) => head.findIndex((cell) => names.includes(cell));
		idx = {
			sku: find("sku", "รหัสเมนู"),
			category: find("หมวดหมู่", "category"),
			name: find("ชื่อเมนู", "name"),
			price: find("ราคา", "price"),
			track: find("นับสต๊อก", "track"),
			stock: find("สต๊อกเริ่มต้น", "stock"),
			status: find("สถานะ", "status")
		};
	}
	const seen = /* @__PURE__ */ new Set();
	const rows = [];
	for (let i = start; i < table.length; i += 1) {
		const line = table[i];
		const cell = (index) => index >= 0 ? (line[index] ?? "").trim() : "";
		const sku = cell(idx.sku);
		const category = cell(idx.category);
		const name = cell(idx.name);
		const price = Number(cell(idx.price).replace(/,/g, ""));
		const trackRaw = cell(idx.track).toLowerCase();
		const stock = cell(idx.stock) === "" ? 0 : Number(cell(idx.stock).replace(/,/g, ""));
		const statusRaw = cell(idx.status).toLowerCase();
		let error = null;
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
			error
		});
	}
	return rows;
}
function systemCash(orders, date) {
	return orders.filter((order) => order.status === "normal" && order.paymentMethod === "cash" && bangkokISODate(new Date(order.createdAt)) === date).reduce((sum, order) => sum + order.total, 0);
}
var settings = {
	companyName: "บริษัท วันเดย์ คาเฟ่ แอนด์ เบเกอรี่ จำกัด",
	companyAddress: "88/9 ถนนสุขุมวิท ซอย 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110",
	companyPhone: "02-123-4567",
	showImages: true,
	lowStockThreshold: 10,
	logoDataUrl: null,
	sellerCanVoidOwn: true,
	allowTransfer: true,
	allowCredit: true
};
var users = [
	{
		id: "u-admin",
		username: "admin",
		name: "ผู้ดูแลระบบ",
		password: "admin",
		role: "admin",
		isActive: true
	},
	{
		id: "u-somchai",
		username: "somchai",
		name: "สมชาย",
		password: "1234",
		role: "seller",
		isActive: true
	},
	{
		id: "u-somying",
		username: "somying",
		name: "สมหญิง",
		password: "1234",
		role: "seller",
		isActive: true
	}
];
var categories = [
	{
		id: "c-rice",
		name: "ข้าว",
		sortOrder: 1,
		isActive: true
	},
	{
		id: "c-bakery",
		name: "เบเกอรี่",
		sortOrder: 2,
		isActive: true
	},
	{
		id: "c-drink",
		name: "เครื่องดื่ม",
		sortOrder: 3,
		isActive: true
	}
];
var products = [
	{
		id: "p-khao-pad",
		categoryId: "c-rice",
		sku: "R01",
		name: "ข้าวผัดไก่",
		price: 55,
		trackStock: true,
		stockQty: 24,
		image: "/menu/khao-pad.jpg",
		isActive: true,
		sortOrder: 1
	},
	{
		id: "p-krapao",
		categoryId: "c-rice",
		sku: "R02",
		name: "ข้าวกะเพราหมูสับ",
		price: 60,
		trackStock: true,
		stockQty: 18,
		image: "/menu/krapao.jpg",
		isActive: true,
		sortOrder: 2
	},
	{
		id: "p-khao-man",
		categoryId: "c-rice",
		sku: "R03",
		name: "ข้าวมันไก่",
		price: 50,
		trackStock: true,
		stockQty: 20,
		image: "/menu/khao-man.jpg",
		isActive: true,
		sortOrder: 3
	},
	{
		id: "p-omelette",
		categoryId: "c-rice",
		sku: "R04",
		name: "ข้าวไข่เจียว",
		price: 45,
		trackStock: true,
		stockQty: 16,
		image: "/menu/omelette.jpg",
		isActive: true,
		sortOrder: 4
	},
	{
		id: "p-croissant",
		categoryId: "c-bakery",
		sku: "B01",
		name: "ครัวซองต์เนย",
		price: 65,
		trackStock: true,
		stockQty: 12,
		image: "/menu/croissant.jpg",
		isActive: true,
		sortOrder: 1
	},
	{
		id: "p-sangkhaya",
		categoryId: "c-bakery",
		sku: "B02",
		name: "ขนมปังสังขยา",
		price: 35,
		trackStock: true,
		stockQty: 8,
		image: "/menu/sangkhaya.jpg",
		isActive: true,
		sortOrder: 2
	},
	{
		id: "p-cake",
		categoryId: "c-bakery",
		sku: "B03",
		name: "เค้กช็อกโกแลต",
		price: 85,
		trackStock: true,
		stockQty: 6,
		image: "/menu/cake.jpg",
		isActive: true,
		sortOrder: 3
	},
	{
		id: "p-cookie",
		categoryId: "c-bakery",
		sku: "B04",
		name: "คุกกี้ช็อกชิพ",
		price: 30,
		trackStock: true,
		stockQty: 2,
		image: "/menu/cookie.jpg",
		isActive: true,
		sortOrder: 4
	},
	{
		id: "p-tea",
		categoryId: "c-drink",
		sku: "D01",
		name: "ชาไทยเย็น",
		price: 40,
		trackStock: true,
		stockQty: 30,
		image: "/menu/thai-tea.jpg",
		isActive: true,
		sortOrder: 1
	},
	{
		id: "p-latte",
		categoryId: "c-drink",
		sku: "D02",
		name: "กาแฟลาเต้",
		price: 55,
		trackStock: false,
		stockQty: 0,
		image: "/menu/latte.jpg",
		isActive: true,
		sortOrder: 2
	},
	{
		id: "p-orange",
		categoryId: "c-drink",
		sku: "D03",
		name: "น้ำส้มสด",
		price: 45,
		trackStock: true,
		stockQty: 14,
		image: "/menu/orange.jpg",
		isActive: true,
		sortOrder: 3
	},
	{
		id: "p-cocoa",
		categoryId: "c-drink",
		sku: "D04",
		name: "โกโก้เย็น",
		price: 40,
		trackStock: true,
		stockQty: 9,
		image: "/menu/cocoa.jpg",
		isActive: true,
		sortOrder: 4
	}
];
function seedData() {
	const yesterday = addDays(bangkokISODate(), -1);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return {
		users,
		categories,
		products,
		orders: [],
		movements: products.filter((product) => product.trackStock).map((product) => ({
			id: `mv-seed-${product.id}`,
			productId: product.id,
			type: "receive",
			qty: product.stockQty,
			stockAfter: product.stockQty,
			orderId: null,
			userId: "u-admin",
			userName: "ผู้ดูแลระบบ",
			note: "สต๊อกเริ่มต้น",
			movementDate: yesterday,
			createdAt: now
		})),
		logs: [{
			id: uid("log"),
			actionCode: "install",
			messageTh: "เตรียมข้อมูลตัวอย่างของร้านวันเดย์ คาเฟ่ แอนด์ เบเกอรี่",
			level: "info",
			userId: "u-admin",
			userName: "ผู้ดูแลระบบ",
			terminalName: "POS-1",
			createdAt: now
		}],
		settings: { ...settings },
		cashCounts: [],
		receiptYear: bangkokYear(),
		receiptSeq: 0,
		sessionUserId: null,
		terminalName: "POS-1",
		printMode: "auto",
		cart: [],
		clientUuid: "cart-seed",
		fails: {}
	};
}
function actor(user) {
	return `${roleLabel(user.role)} ${user.name}`;
}
function makeLog(state, entry) {
	return {
		id: uid("log"),
		actionCode: entry.actionCode,
		messageTh: entry.messageTh,
		level: entry.level,
		userId: entry.user?.id ?? null,
		userName: entry.user?.name ?? null,
		terminalName: state.terminalName,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function withLog(state, entry) {
	return [makeLog(state, entry), ...state.logs].slice(0, 2e3);
}
var storage = createJSONStorage(() => ({
	getItem: (key) => typeof window === "undefined" ? null : window.localStorage.getItem(key),
	setItem: (key, value) => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(key, value);
		} catch {}
	},
	removeItem: (key) => {
		if (typeof window !== "undefined") window.localStorage.removeItem(key);
	}
}));
var usePosStore = create()(persist((set, get) => ({
	...seedData(),
	hydrated: false,
	notice: null,
	printJob: null,
	printTicket: 0,
	receiptOrderId: null,
	receiptAutoPrint: false,
	notify: (text) => set({ notice: {
		id: Date.now(),
		text
	} }),
	login: (username, password) => {
		const state = get();
		const key = username.trim().toLowerCase();
		if (!key) return {
			ok: false,
			message: "กรอกชื่อผู้ใช้"
		};
		const fail = state.fails[key];
		const nowMs = Date.now();
		if (fail && fail.lockedUntil > nowMs) return {
			ok: false,
			message: `พยายามหลายครั้งเกินไป ลองใหม่ใน ${Math.ceil((fail.lockedUntil - nowMs) / 1e3)} วินาที`
		};
		const user = state.users.find((item) => item.username.toLowerCase() === key);
		if (!user || user.password !== password) {
			const count = (fail?.count ?? 0) + 1;
			const lockedUntil = count >= 5 ? nowMs + 6e4 : 0;
			const who = username.trim();
			set({
				fails: {
					...state.fails,
					[key]: {
						count: lockedUntil ? 0 : count,
						lockedUntil
					}
				},
				logs: withLog(state, {
					actionCode: "login_fail",
					level: "warning",
					user: user ?? null,
					messageTh: `เข้าสู่ระบบไม่สำเร็จ ชื่อผู้ใช้ ${who} รหัสผ่านไม่ถูกต้อง (ครั้งที่ ${count})`
				}),
				notice: {
					id: nowMs,
					text: lockedUntil ? "รหัสไม่ถูกต้องครบ 5 ครั้ง ล็อก 1 นาที" : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
				}
			});
			return {
				ok: false,
				message: lockedUntil ? "รหัสไม่ถูกต้องครบ 5 ครั้ง ล็อก 1 นาที" : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
			};
		}
		if (!user.isActive) {
			set({
				logs: withLog(state, {
					actionCode: "login_fail",
					level: "warning",
					user,
					messageTh: `ผู้ใช้ ${user.username} (${roleLabel(user.role)}) พยายามเข้าสู่ระบบ แต่บัญชีถูกปิด`
				}),
				notice: {
					id: nowMs,
					text: "บัญชีนี้ถูกปิดใช้งาน"
				}
			});
			return {
				ok: false,
				message: "บัญชีนี้ถูกปิดใช้งาน"
			};
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
				messageTh: `ผู้ใช้ ${user.username} (${roleLabel(user.role)}) เข้าสู่ระบบ จากเครื่อง ${state.terminalName}`
			})
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
			logs: user ? withLog(state, {
				actionCode: "logout",
				level: "info",
				user,
				messageTh: `${actor(user)} ออกจากระบบ (เครื่อง ${state.terminalName})`
			}) : state.logs
		});
	},
	addToCart: (productId) => {
		const state = get();
		const product = state.products.find((item) => item.id === productId);
		if (!product || !product.isActive) return;
		if (!state.categories.find((item) => item.id === product.categoryId)?.isActive) return;
		if (product.trackStock && product.stockQty <= 0) {
			set({ notice: {
				id: Date.now(),
				text: `${product.name} หมด`
			} });
			return;
		}
		const line = state.cart.find((item) => item.productId === productId);
		const nextQty = (line?.qty ?? 0) + 1;
		if (product.trackStock && nextQty > product.stockQty) {
			set({ notice: {
				id: Date.now(),
				text: `${product.name} เหลือ ${product.stockQty} ชิ้น`
			} });
			return;
		}
		set({
			cart: line ? state.cart.map((item) => item.productId === productId ? {
				...item,
				qty: nextQty
			} : item) : [...state.cart, {
				productId,
				qty: 1
			}],
			clientUuid: state.clientUuid === "cart-seed" ? uid("cart") : state.clientUuid
		});
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
			set({ notice: {
				id: Date.now(),
				text: `${product.name} เหลือ ${product.stockQty} ชิ้น`
			} });
			return;
		}
		set({ cart: state.cart.map((item) => item.productId === productId ? {
			...item,
			qty: nextQty
		} : item) });
	},
	clearCart: () => set({
		cart: [],
		clientUuid: uid("cart")
	}),
	checkout: (input) => {
		const state = get();
		const existing = state.orders.find((order) => order.clientUuid === state.clientUuid);
		if (existing) return {
			ok: true,
			order: existing,
			duplicate: true
		};
		const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
		if (!user) return {
			ok: false,
			message: "กรุณาเข้าสู่ระบบ"
		};
		if (state.cart.length === 0) return {
			ok: false,
			message: "ยังไม่มีรายการในตะกร้า"
		};
		if (input.paymentMethod === "transfer" && !state.settings.allowTransfer) return {
			ok: false,
			message: "ปิดรับชำระด้วยการโอน"
		};
		if (input.paymentMethod === "credit" && !state.settings.allowCredit) return {
			ok: false,
			message: "ปิดรับชำระด้วยบัตรเครดิต"
		};
		const sorted = [...state.cart].sort((a, b) => a.productId.localeCompare(b.productId));
		const items = [];
		let total = 0;
		for (const line of sorted) {
			const product = state.products.find((item) => item.id === line.productId);
			const qty = Math.floor(line.qty);
			if (!product || !product.isActive || qty <= 0) return {
				ok: false,
				message: "มีสินค้าที่ปิดขายอยู่ในตะกร้า"
			};
			if (product.trackStock && product.stockQty < qty) {
				const available = Math.max(0, product.stockQty);
				const cart = available <= 0 ? state.cart.filter((item) => item.productId !== product.id) : state.cart.map((item) => item.productId === product.id ? {
					...item,
					qty: available
				} : item);
				const message = `${product.name} เหลือ ${product.stockQty} ชิ้น แต่ต้องการ ${qty} ชิ้น`;
				set({
					cart,
					logs: withLog(state, {
						actionCode: "sale_fail",
						level: "warning",
						user,
						messageTh: `ไม่สามารถออกบิลได้ ${message} (เครื่อง ${state.terminalName})`
					}),
					notice: {
						id: Date.now(),
						text: message
					}
				});
				return {
					ok: false,
					message
				};
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
				trackStock: product.trackStock
			});
		}
		if (items.length === 0) return {
			ok: false,
			message: "ยังไม่มีรายการในตะกร้า"
		};
		let cashReceived = null;
		let changeAmount = null;
		if (input.paymentMethod === "cash") {
			const cash = roundMoney(input.cashReceived ?? 0);
			if (cash < total) return {
				ok: false,
				message: "เงินที่รับไม่พอ"
			};
			cashReceived = cash;
			changeAmount = roundMoney(cash - total);
		}
		const today = bangkokISODate();
		const year = bangkokYear();
		const seq = state.receiptYear === year ? state.receiptSeq + 1 : 1;
		const numbers = receiptNumbers(year, seq);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const orderId = uid("ord");
		const used = new Map(items.filter((item) => item.trackStock).map((item) => [item.productId, item.qty]));
		const products = state.products.map((product) => {
			const qty = used.get(product.id);
			return qty ? {
				...product,
				stockQty: product.stockQty - qty
			} : product;
		});
		const movements = [...state.movements];
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
				createdAt: now
			});
		}
		const order = {
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
			items
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
				messageTh: `${actor(user)} ออกบิล ${numbers.short} ยอด ${baht(total)} บาท ชำระด้วย${payName(input.paymentMethod)} (เครื่อง ${state.terminalName})`
			}),
			notice: {
				id: Date.now(),
				text: `ขายสำเร็จ ${numbers.short}`
			},
			receiptOrderId: order.id,
			receiptAutoPrint: state.printMode === "auto"
		});
		return {
			ok: true,
			order
		};
	},
	voidOrder: (orderId, reason) => {
		const state = get();
		const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
		if (!user) return {
			ok: false,
			message: "กรุณาเข้าสู่ระบบ"
		};
		const reasonText = reason.trim();
		if (!reasonText) return {
			ok: false,
			message: "กรุณาระบุเหตุผล"
		};
		const order = state.orders.find((item) => item.id === orderId);
		if (!order) return {
			ok: false,
			message: "ไม่พบบิล"
		};
		const today = bangkokISODate();
		const decision = voidDecision(user, order, state.settings, today);
		if (!decision.ok) {
			set({
				logs: withLog(state, {
					actionCode: "void_denied",
					level: "warning",
					user,
					messageTh: `${actor(user)} พยายามยกเลิกบิล ${order.receiptShort} — ${decision.message}`
				}),
				notice: {
					id: Date.now(),
					text: decision.message
				}
			});
			return decision;
		}
		const now = (/* @__PURE__ */ new Date()).toISOString();
		let products = state.products;
		const movements = [...state.movements];
		for (const item of order.items) {
			if (!item.trackStock) continue;
			products = products.map((product) => product.id === item.productId ? {
				...product,
				stockQty: product.stockQty + item.qty
			} : product);
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
				createdAt: now
			});
		}
		set({
			products,
			movements,
			orders: state.orders.map((item) => item.id === order.id ? {
				...item,
				status: "void",
				voidedBy: user.id,
				voidedByName: user.name,
				voidedAt: now,
				voidReason: reasonText
			} : item),
			logs: withLog(state, {
				actionCode: "void",
				level: "info",
				user,
				messageTh: `${actor(user)} ยกเลิกบิล ${order.receiptShort} ยอด ${baht(order.total)} บาท เหตุผล: ${reasonText} (เครื่อง ${state.terminalName})`
			}),
			notice: {
				id: Date.now(),
				text: `ยกเลิกบิล ${order.receiptShort} แล้ว`
			}
		});
		return { ok: true };
	},
	receiveStock: (productId, qty, date, note) => {
		const state = get();
		const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
		if (!user) return {
			ok: false,
			message: "กรุณาเข้าสู่ระบบ"
		};
		const amount = Math.floor(qty);
		if (!Number.isFinite(amount) || amount <= 0) return {
			ok: false,
			message: "จำนวนรับเข้าต้องมากกว่า 0"
		};
		const today = bangkokISODate();
		if (user.role !== "admin" && date !== today) return {
			ok: false,
			message: "ผู้ขายรับเข้าได้เฉพาะวันนี้"
		};
		if (date > today) return {
			ok: false,
			message: "รับเข้าล่วงหน้าไม่ได้"
		};
		const product = state.products.find((item) => item.id === productId);
		if (!product) return {
			ok: false,
			message: "ไม่พบสินค้า"
		};
		if (!product.trackStock) return {
			ok: false,
			message: "เมนูนี้ทำสด ไม่นับสต๊อก"
		};
		const after = product.stockQty + amount;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const movement = {
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
			createdAt: now
		};
		set({
			products: state.products.map((item) => item.id === productId ? {
				...item,
				stockQty: after
			} : item),
			movements: [...state.movements, movement],
			logs: withLog(state, {
				actionCode: "stock_in",
				level: "info",
				user,
				messageTh: `${actor(user)} เพิ่มสต๊อก ${product.name} +${amount} (คงเหลือ ${after})`
			}),
			notice: {
				id: Date.now(),
				text: `รับเข้า ${product.name} +${amount}`
			}
		});
		return { ok: true };
	},
	adjustStock: (productId, nextQty, date, note) => {
		const state = get();
		const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
		if (!user) return {
			ok: false,
			message: "กรุณาเข้าสู่ระบบ"
		};
		if (user.role !== "admin") return {
			ok: false,
			message: "เฉพาะแอดมินปรับยอดได้"
		};
		const qty = Math.floor(nextQty);
		if (!Number.isFinite(qty) || qty < 0) return {
			ok: false,
			message: "ยอดคงเหลือต้องเป็นจำนวนเต็มตั้งแต่ 0"
		};
		if (date > bangkokISODate()) return {
			ok: false,
			message: "ปรับยอดล่วงหน้าไม่ได้"
		};
		const product = state.products.find((item) => item.id === productId);
		if (!product) return {
			ok: false,
			message: "ไม่พบสินค้า"
		};
		if (!product.trackStock) return {
			ok: false,
			message: "เมนูนี้ไม่นับสต๊อก"
		};
		const delta = qty - product.stockQty;
		if (delta === 0) return {
			ok: false,
			message: "ยอดไม่เปลี่ยน"
		};
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const movement = {
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
			createdAt: now
		};
		set({
			products: state.products.map((item) => item.id === productId ? {
				...item,
				stockQty: qty
			} : item),
			movements: [...state.movements, movement],
			logs: withLog(state, {
				actionCode: "stock_adjust",
				level: "info",
				user,
				messageTh: `${actor(user)} ปรับสต๊อก ${product.name} ${delta > 0 ? "+" : ""}${delta} (คงเหลือ ${qty})`
			}),
			notice: {
				id: Date.now(),
				text: `ปรับ ${product.name} เป็น ${qty}`
			}
		});
		return { ok: true };
	},
	saveCategory: ({ id, name }) => {
		const state = get();
		const user = adminOf(state);
		if (!user) return {
			ok: false,
			message: "เฉพาะแอดมิน"
		};
		const trimmed = name.trim();
		if (!trimmed) return {
			ok: false,
			message: "กรอกชื่อหมวด"
		};
		if (state.categories.some((item) => item.name === trimmed && item.id !== id)) return {
			ok: false,
			message: "มีหมวดชื่อนี้อยู่แล้ว"
		};
		let categories;
		let message;
		if (id) {
			categories = state.categories.map((item) => item.id === id ? {
				...item,
				name: trimmed
			} : item);
			message = `${actor(user)} แก้ชื่อหมวดหมู่เป็น ${trimmed}`;
		} else {
			const sortOrder = Math.max(0, ...state.categories.map((item) => item.sortOrder)) + 1;
			categories = [...state.categories, {
				id: uid("cat"),
				name: trimmed,
				sortOrder,
				isActive: true
			}];
			message = `${actor(user)} เพิ่มหมวดหมู่ ${trimmed}`;
		}
		set({
			categories,
			logs: withLog(state, {
				actionCode: "category",
				level: "info",
				user,
				messageTh: message
			}),
			notice: {
				id: Date.now(),
				text: id ? "บันทึกหมวดแล้ว" : "เพิ่มหมวดแล้ว"
			}
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
		set({ categories: next.map((item, order) => ({
			...item,
			sortOrder: order + 1
		})) });
	},
	setCategoryActive: (id, isActive) => {
		const state = get();
		const user = adminOf(state);
		if (!user) return;
		const category = state.categories.find((item) => item.id === id);
		if (!category) return;
		set({
			categories: state.categories.map((item) => item.id === id ? {
				...item,
				isActive
			} : item),
			logs: withLog(state, {
				actionCode: "category",
				level: "info",
				user,
				messageTh: `${actor(user)} ${isActive ? "เปิด" : "ปิด"}หมวดหมู่ ${category.name}`
			})
		});
	},
	saveProduct: (input) => {
		const state = get();
		const user = adminOf(state);
		if (!user) return {
			ok: false,
			message: "เฉพาะแอดมิน"
		};
		const name = input.name.trim();
		const sku = input.sku.trim();
		if (!name) return {
			ok: false,
			message: "กรอกชื่อเมนู"
		};
		if (!sku) return {
			ok: false,
			message: "กรอกรหัสเมนู"
		};
		if (!state.categories.some((item) => item.id === input.categoryId)) return {
			ok: false,
			message: "เลือกหมวดหมู่"
		};
		if (!Number.isFinite(input.price) || input.price < 0) return {
			ok: false,
			message: "ราคาไม่ถูกต้อง"
		};
		if (state.products.some((item) => item.sku.toLowerCase() === sku.toLowerCase() && item.id !== input.id)) return {
			ok: false,
			message: "รหัสเมนูซ้ำ"
		};
		const price = roundMoney(input.price);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const today = bangkokISODate();
		if (!input.id) {
			const stockQty = input.trackStock ? Math.max(0, Math.floor(input.stockQty) || 0) : 0;
			const id = uid("p");
			const sortOrder = Math.max(0, ...state.products.filter((item) => item.categoryId === input.categoryId).map((item) => item.sortOrder)) + 1;
			const product = {
				id,
				categoryId: input.categoryId,
				sku,
				name,
				price,
				trackStock: input.trackStock,
				stockQty,
				image: input.image,
				isActive: input.isActive,
				sortOrder
			};
			const movements = [...state.movements];
			if (input.trackStock && stockQty > 0) movements.push({
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
				createdAt: now
			});
			set({
				products: [...state.products, product],
				movements,
				logs: withLog(state, {
					actionCode: "product",
					level: "info",
					user,
					messageTh: `${actor(user)} เพิ่มเมนู ${name} ราคา ${baht(price)} บาท`
				}),
				notice: {
					id: Date.now(),
					text: `เพิ่มเมนู ${name}`
				}
			});
			return { ok: true };
		}
		const prev = state.products.find((item) => item.id === input.id);
		if (!prev) return {
			ok: false,
			message: "ไม่พบเมนู"
		};
		const products = state.products.map((item) => item.id === input.id ? {
			...item,
			categoryId: input.categoryId,
			sku,
			name,
			price,
			trackStock: input.trackStock,
			image: input.image,
			isActive: input.isActive
		} : item);
		const priceNote = prev.price !== price ? `แก้ราคาเมนู ${name} จาก ${baht(prev.price)} เป็น ${baht(price)} บาท` : `แก้เมนู ${name}`;
		set({
			products,
			logs: withLog(state, {
				actionCode: "product",
				level: "info",
				user,
				messageTh: `${actor(user)} ${priceNote}`
			}),
			notice: {
				id: Date.now(),
				text: "บันทึกเมนูแล้ว"
			}
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
			products: state.products.map((item) => item.id === id ? {
				...item,
				isActive
			} : item),
			logs: withLog(state, {
				actionCode: "product",
				level: "info",
				user,
				messageTh: `${actor(user)} ${isActive ? "เปิด" : "ปิด"}ขายเมนู ${product.name}`
			})
		});
	},
	saveUser: (input) => {
		const state = get();
		const actorUser = adminOf(state);
		if (!actorUser) return {
			ok: false,
			message: "เฉพาะแอดมิน"
		};
		const username = input.username.trim();
		const name = input.name.trim();
		if (!username || !name) return {
			ok: false,
			message: "กรอกชื่อผู้ใช้และชื่อที่แสดง"
		};
		if (state.users.some((item) => item.username.toLowerCase() === username.toLowerCase() && item.id !== input.id)) return {
			ok: false,
			message: "ชื่อผู้ใช้ซ้ำ"
		};
		const activeAdmins = state.users.filter((item) => item.role === "admin" && item.isActive && item.id !== input.id);
		if (!(input.role === "admin" && input.isActive) && activeAdmins.length === 0) return {
			ok: false,
			message: "ต้องมีแอดมินที่ใช้งานได้อย่างน้อย 1 คน"
		};
		if (input.id && input.id === state.sessionUserId && !input.isActive) return {
			ok: false,
			message: "ปิดบัญชีที่กำลังใช้งานอยู่ไม่ได้"
		};
		if (!input.id) {
			if (!input.password || input.password.length < 4) return {
				ok: false,
				message: "รหัสผ่านอย่างน้อย 4 ตัว"
			};
			const user = {
				id: uid("u"),
				username,
				name,
				password: input.password,
				role: input.role,
				isActive: input.isActive
			};
			set({
				users: [...state.users, user],
				logs: withLog(state, {
					actionCode: "user",
					level: "info",
					user: actorUser,
					messageTh: `${actor(actorUser)} เพิ่มผู้ใช้ ${username} (${roleLabel(input.role)})`
				}),
				notice: {
					id: Date.now(),
					text: `เพิ่มผู้ใช้ ${username}`
				}
			});
			return { ok: true };
		}
		if (!state.users.find((item) => item.id === input.id)) return {
			ok: false,
			message: "ไม่พบผู้ใช้"
		};
		if (input.password && input.password.length < 4) return {
			ok: false,
			message: "รหัสผ่านอย่างน้อย 4 ตัว"
		};
		set({
			users: state.users.map((item) => item.id === input.id ? {
				...item,
				username,
				name,
				role: input.role,
				isActive: input.isActive,
				password: input.password ? input.password : item.password
			} : item),
			logs: withLog(state, {
				actionCode: "user",
				level: "info",
				user: actorUser,
				messageTh: `${actor(actorUser)} แก้ไขผู้ใช้ ${username}`
			}),
			notice: {
				id: Date.now(),
				text: "บันทึกผู้ใช้แล้ว"
			}
		});
		return { ok: true };
	},
	updateSettings: (patch) => {
		const state = get();
		const user = adminOf(state);
		if (!user) return {
			ok: false,
			message: "เฉพาะแอดมิน"
		};
		const next = {
			...state.settings,
			...patch
		};
		if (!Number.isFinite(next.lowStockThreshold) || next.lowStockThreshold < 1) return {
			ok: false,
			message: "เกณฑ์ใกล้หมดต้องมากกว่า 0"
		};
		next.lowStockThreshold = Math.floor(next.lowStockThreshold);
		const notes = [];
		if (patch.showImages !== void 0 && patch.showImages !== state.settings.showImages) notes.push(patch.showImages ? "เปิดการแสดงภาพเมนู" : "ปิดการแสดงภาพเมนู");
		if (patch.logoDataUrl !== void 0 && patch.logoDataUrl !== state.settings.logoDataUrl) notes.push(patch.logoDataUrl ? "เปลี่ยนโลโก้โปรแกรม" : "ลบโลโก้โปรแกรม");
		if (patch.companyName && patch.companyName !== state.settings.companyName) notes.push("แก้ข้อมูลบริษัทบนใบเสร็จ");
		if (patch.lowStockThreshold !== void 0 && next.lowStockThreshold !== state.settings.lowStockThreshold) notes.push(`ตั้งค่าสินค้าใกล้หมดเป็นต่ำกว่า ${next.lowStockThreshold} ชิ้น`);
		if (patch.sellerCanVoidOwn !== void 0 && patch.sellerCanVoidOwn !== state.settings.sellerCanVoidOwn) notes.push(patch.sellerCanVoidOwn ? "เปิดให้ผู้ขายยกเลิกบิลของตนเองในวันเดียวกัน" : "ปิดการยกเลิกบิลโดยผู้ขาย");
		set({
			settings: next,
			logs: notes.length > 0 ? withLog(state, {
				actionCode: "settings",
				level: "info",
				user,
				messageTh: `${actor(user)} ${notes.join(", ")}`
			}) : state.logs,
			notice: {
				id: Date.now(),
				text: "บันทึกการตั้งค่าแล้ว"
			}
		});
		return { ok: true };
	},
	saveCashCount: ({ date, counts, coin, total, system }) => {
		const state = get();
		const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
		if (!user) return {
			ok: false,
			message: "กรุณาเข้าสู่ระบบ"
		};
		set({
			cashCounts: [{
				id: uid("cash"),
				countDate: date,
				userId: user.id,
				userName: user.name,
				counts,
				coinAmount: coin,
				totalCounted: total,
				systemCash: system,
				difference: roundMoney(total - system),
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			}, ...state.cashCounts],
			logs: withLog(state, {
				actionCode: "cash",
				level: "info",
				user,
				messageTh: `${actor(user)} บันทึกนำส่งเงินสดวันที่ ${date} นับได้ ${baht(total)} บาท ระบบ ${baht(system)} บาท`
			}),
			notice: {
				id: Date.now(),
				text: "บันทึกการนำส่งเงินสดแล้ว"
			}
		});
		return { ok: true };
	},
	setTerminal: (name, mode) => {
		set({
			terminalName: (name.trim() || "POS-1").slice(0, 32),
			printMode: mode
		});
	},
	requestPrint: (job) => set({
		printJob: job,
		printTicket: get().printTicket + 1
	}),
	openReceipt: (orderId, auto) => set({
		receiptOrderId: orderId,
		receiptAutoPrint: auto
	}),
	closeReceipt: () => set({
		receiptOrderId: null,
		receiptAutoPrint: false
	}),
	applyImport: (rows) => {
		const state = get();
		const user = adminOf(state);
		if (!user) return {
			ok: false,
			message: "เฉพาะแอดมิน"
		};
		if (rows.length === 0) return {
			ok: false,
			message: "ไม่มีแถวให้นำเข้า"
		};
		if (rows.some((row) => row.error)) return {
			ok: false,
			message: "มีแถวที่ไม่ผ่านการตรวจ แก้ไฟล์ก่อนนำเข้า"
		};
		let categories = [...state.categories];
		let products = [...state.products];
		const movements = [...state.movements];
		const today = bangkokISODate();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		let added = 0;
		let updated = 0;
		for (const row of rows) {
			let category = categories.find((item) => item.name === row.category);
			if (!category) {
				category = {
					id: uid("cat"),
					name: row.category,
					sortOrder: categories.length + 1,
					isActive: true
				};
				categories = [...categories, category];
			}
			const existing = products.find((item) => item.sku.toLowerCase() === row.sku.toLowerCase());
			if (!existing) {
				const id = uid("p");
				const stockQty = row.track ? row.stock : 0;
				products = [...products, {
					id,
					categoryId: category.id,
					sku: row.sku,
					name: row.name,
					price: roundMoney(row.price),
					trackStock: row.track,
					stockQty,
					image: null,
					isActive: row.active,
					sortOrder: products.filter((item) => item.categoryId === category.id).length + 1
				}];
				if (row.track && stockQty > 0) movements.push({
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
					createdAt: now
				});
				added += 1;
			} else {
				const delta = row.track ? row.stock - (existing.trackStock ? existing.stockQty : 0) : 0;
				const stockQty = row.track ? row.stock : existing.stockQty;
				products = products.map((item) => item.id === existing.id ? {
					...item,
					categoryId: category.id,
					name: row.name,
					price: roundMoney(row.price),
					trackStock: row.track,
					isActive: row.active,
					stockQty
				} : item);
				if (row.track && delta !== 0) movements.push({
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
					createdAt: now
				});
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
				messageTh: `${actor(user)} นำเข้าเมนู เพิ่ม ${added} แก้ไข ${updated}`
			}),
			notice: {
				id: Date.now(),
				text: `นำเข้าแล้ว เพิ่ม ${added} แก้ไข ${updated}`
			}
		});
		return {
			ok: true,
			message: `เพิ่ม ${added} แก้ไข ${updated}`
		};
	},
	restoreSnapshot: (data) => {
		const state = get();
		const user = adminOf(state);
		if (!user) return {
			ok: false,
			message: "เฉพาะแอดมิน"
		};
		const parsed = unwrapBackup(data);
		if (!parsed) return {
			ok: false,
			message: "ไฟล์สำรองไม่ถูกต้อง"
		};
		const fresh = seedData();
		const restoredLogs = Array.isArray(parsed.logs) ? parsed.logs : [];
		const restoreLog = makeLog(state, {
			actionCode: "restore",
			messageTh: `${actor(user)} กู้คืนข้อมูลจากไฟล์สำรอง`,
			level: "warning",
			user
		});
		set({
			...fresh,
			...parsed,
			settings: {
				...fresh.settings,
				...parsed.settings
			},
			terminalName: state.terminalName,
			printMode: state.printMode,
			sessionUserId: parsed.users?.some((item) => item.id === state.sessionUserId && item.isActive) ? state.sessionUserId : null,
			cart: [],
			clientUuid: uid("cart"),
			fails: {},
			hydrated: true,
			notice: {
				id: Date.now(),
				text: "กู้คืนข้อมูลแล้ว"
			},
			logs: [restoreLog, ...restoredLogs].slice(0, 2e3)
		});
		return { ok: true };
	},
	recalcStock: () => {
		const state = get();
		const user = adminOf(state);
		if (!user) return {
			ok: false,
			message: "เฉพาะแอดมิน"
		};
		let changed = 0;
		set({
			products: state.products.map((product) => {
				if (!product.trackStock) return product;
				const sum = movementSum(state.movements, product.id);
				if (sum !== product.stockQty) changed += 1;
				return {
					...product,
					stockQty: sum
				};
			}),
			logs: withLog(state, {
				actionCode: "recalc",
				level: "info",
				user,
				messageTh: `${actor(user)} คำนวณสต๊อกใหม่จากประวัติ ปรับ ${changed} รายการ`
			}),
			notice: {
				id: Date.now(),
				text: changed ? `ปรับสต๊อก ${changed} รายการ` : "สต๊อกตรงกับประวัติอยู่แล้ว"
			}
		});
		return { ok: true };
	},
	resetDemo: () => {
		const state = get();
		set({
			...seedData(),
			terminalName: state.terminalName,
			printMode: state.printMode,
			hydrated: true,
			notice: {
				id: Date.now(),
				text: "กลับไปข้อมูลตัวอย่างแล้ว"
			},
			printJob: null,
			receiptOrderId: null,
			receiptAutoPrint: false
		});
	},
	exportSnapshot: () => {
		const state = get();
		const data = {
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
			fails: {}
		};
		const user = state.users.find((item) => item.id === state.sessionUserId) ?? null;
		if (user) set({ logs: withLog(state, {
			actionCode: "backup",
			level: "info",
			user,
			messageTh: `${actor(user)} สำรองข้อมูลเป็นไฟล์`
		}) });
		return JSON.stringify({
			app: "onedaypos",
			version: 1,
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			data
		}, null, 2);
	}
}), {
	name: "onedaypos-v1",
	skipHydration: true,
	storage,
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
		fails: state.fails
	})
}));
function adminOf(state) {
	const user = state.users.find((item) => item.id === state.sessionUserId && item.isActive);
	if (!user || user.role !== "admin") return null;
	return user;
}
function payName(method) {
	if (method === "cash") return "เงินสด";
	if (method === "transfer") return "โอนเงิน";
	return "บัตรเครดิต";
}
function unwrapBackup(data) {
	if (!data || typeof data !== "object") return null;
	const record = data;
	const body = record.data && typeof record.data === "object" ? record.data : record;
	if (!Array.isArray(body.users) || !Array.isArray(body.products) || !Array.isArray(body.orders) || !Array.isArray(body.categories)) return null;
	return body;
}
function useSessionUser() {
	return usePosStore((state) => {
		if (!state.sessionUserId) return null;
		const user = state.users.find((item) => item.id === state.sessionUserId) ?? null;
		if (!user?.isActive) return null;
		return user;
	});
}
function LoginScreen() {
	const settings = usePosStore((state) => state.settings);
	const login = usePosStore((state) => state.login);
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	function submit(nextUser = username, nextPass = password) {
		const result = login(nextUser, nextPass);
		if (!result.ok) setError(result.message);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-cream px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-2xl border border-sand bg-card p-6 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 text-center",
					children: [settings.logoDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: settings.logoDataUrl,
						alt: "โลโก้ร้าน",
						className: "mx-auto mb-3 h-20 w-auto object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl text-brand",
						children: "OneDayPOS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: settings.companyName
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-3",
					onSubmit: (event) => {
						event.preventDefault();
						submit();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "ชื่อผู้ใช้",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								autoComplete: "username",
								value: username,
								onChange: (event) => setUsername(event.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "รหัสผ่าน",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								type: "password",
								autoComplete: "current-password",
								value: password,
								onChange: (event) => setPassword(event.target.value)
							})
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-brand",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: "เข้าสู่ระบบ"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-xl bg-sand/60 p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: "บัญชีตัวอย่างบนเครื่องนี้"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "sand",
							className: "w-full bg-card",
							onClick: () => submit("admin", "admin"),
							children: "แอดมิน · admin / admin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "sand",
							className: "w-full bg-card",
							onClick: () => submit("somchai", "1234"),
							children: "ผู้ขาย · somchai / 1234"
						})]
					})]
				})
			]
		})
	});
}
function usePosHydrated() {
	(0, import_react.useEffect)(() => {
		const finish = () => usePosStore.setState({ hydrated: true });
		if (usePosStore.persist.hasHydrated()) finish();
		const unsub = usePosStore.persist.onFinishHydration(finish);
		Promise.resolve(usePosStore.persist.rehydrate()).catch(() => finish());
		const onStorage = (event) => {
			if (event.key === "onedaypos-v1") usePosStore.persist.rehydrate();
		};
		window.addEventListener("storage", onStorage);
		return () => {
			unsub();
			window.removeEventListener("storage", onStorage);
		};
	}, []);
}
function Splash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-cream px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-3xl text-brand",
			children: "OneDayPOS"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "กำลังเปิดระบบขาย"
		})] })
	});
}
function RequireSession({ children }) {
	const hydrated = usePosStore((state) => state.hydrated);
	const user = useSessionUser();
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var styles_default = "/assets/styles-C3DkePpV.css";
var Route$4 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "OneDayPOS" },
			{
				name: "theme-color",
				content: "#790D16"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: RootComponent
});
function RootComponent() {
	usePosHydrated();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "th",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$3 = () => import("./routes-BAfNeeh9.mjs");
var Route$3 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin-Yzgy0Ywe.mjs");
var Route$2 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./reports-PolX7Kxd.mjs");
var Route$1 = createFileRoute("/reports")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./stock-B-LKU-hO.mjs");
var Route = createFileRoute("/stock")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	AdminRoute: Route$2.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$4
	}),
	ReportsRoute: Route$1.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => Route$4
	}),
	StockRoute: Route.update({
		id: "/stock",
		path: "/stock",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { TextArea as A, roleLabel as C, PageHeader as D, Modal as E, SelectInput as O, orderDay as S, Field as T, downloadText as _, movementSum as a, formatCeStamp as b, systemCash as c, PAY_LABEL as d, VOID_REASONS as f, downloadCsv as g, cashTotal as h, useSessionUser as i, TextInput as j, SwitchRow as k, ACTION_LABEL as l, bangkokISODate as m, RequireSession as n, previewMenuImport as o, baht as p, usePosStore as r, stockOnDate as s, router_exports as t, BILL_VALUES as u, formatBe as v, Button as w, inRange as x, formatBeStamp as y };
