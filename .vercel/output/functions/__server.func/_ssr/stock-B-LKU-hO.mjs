import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as PageHeader, E as Modal, T as Field, g as downloadCsv, i as useSessionUser, j as TextInput, m as bangkokISODate, n as RequireSession, p as baht, r as usePosStore, s as stockOnDate, w as Button } from "./router-CNKdKW2n.mjs";
import { t as Shell } from "./shell-c-avJ193.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock-B-LKU-hO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StockView() {
	const user = useSessionUser();
	const categories = usePosStore((state) => state.categories);
	const products = usePosStore((state) => state.products);
	const movements = usePosStore((state) => state.movements);
	const settings = usePosStore((state) => state.settings);
	const receiveStock = usePosStore((state) => state.receiveStock);
	const adjustStock = usePosStore((state) => state.adjustStock);
	const today = bangkokISODate();
	const [date, setDate] = (0, import_react.useState)(today);
	const [categoryId, setCategoryId] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [targetId, setTargetId] = (0, import_react.useState)(null);
	const [qty, setQty] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("receive");
	const activeCategories = categories.filter((item) => item.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return products.filter((product) => product.trackStock).filter((product) => categoryId === "all" || product.categoryId === categoryId).filter((product) => !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q)).map((product) => ({
			product,
			day: stockOnDate(movements, product.id, date)
		})).sort((a, b) => a.product.name.localeCompare(b.product.name, "th"));
	}, [
		products,
		movements,
		categoryId,
		query,
		date
	]);
	const low = products.filter((product) => product.trackStock && product.isActive && product.stockQty < settings.lowStockThreshold).sort((a, b) => a.stockQty - b.stockQty);
	const target = products.find((product) => product.id === targetId) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "สต๊อก",
			hint: `ใกล้หมดเมื่อคงเหลือต่ำกว่า ${settings.lowStockThreshold} ชิ้น`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "sand",
				onClick: () => downloadCsv(`onedaypos-stock-${date}.csv`, [[
					"รหัส",
					"เมนู",
					"ยกมา",
					"รับเข้า",
					"ขาย",
					"คืน",
					"ปรับ",
					"คงเหลือ"
				], ...rows.map(({ product, day }) => [
					product.sku,
					product.name,
					day.opening,
					day.received,
					day.sold,
					day.returned,
					day.adjusted,
					day.closing
				])]),
				children: "ดาวน์โหลด Excel"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 grid gap-3 lg:grid-cols-[1fr_16rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 grid gap-2 sm:grid-cols-[12rem_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: user?.role === "admin" ? "ดูวันที่" : "วันนี้",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								type: "date",
								value: user?.role === "admin" ? date : today,
								max: today,
								disabled: user?.role !== "admin",
								onChange: (event) => setDate(event.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "ค้นหาเมนู",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "ชื่อหรือรหัส"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex gap-2 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
							active: categoryId === "all",
							onClick: () => setCategoryId("all"),
							label: "ทั้งหมด"
						}), activeCategories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
							active: categoryId === category.id,
							onClick: () => setCategoryId(category.id),
							label: category.name
						}, category.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: rows.map(({ product, day }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl border border-sand bg-card p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: product.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: product.sku
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `text-right ${day.closing < settings.lowStockThreshold ? "text-brand" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg",
											children: day.closing
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs",
											children: "คงเหลือ"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 grid grid-cols-3 gap-2 text-xs text-muted sm:grid-cols-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["ยกมา ", day.opening] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["รับเข้า ", day.received] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["ขาย ", day.sold] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["คืน ", day.returned] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["ปรับ ", day.adjusted] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "sand",
										onClick: () => {
											setTargetId(product.id);
											setMode("receive");
											setQty("");
											setNote("");
										},
										children: "รับเข้า"
									}), user?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => {
											setTargetId(product.id);
											setMode("adjust");
											setQty(String(product.stockQty));
											setNote("");
										},
										children: "ปรับยอด"
									}) : null]
								})
							]
						}, product.id))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "rounded-xl border border-sand bg-card p-3 lg:sticky lg:top-16 lg:self-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-brand",
						children: "ใกล้หมด"
					}),
					low.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "ไม่มีรายการต่ำกว่าเกณฑ์"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid gap-2",
						children: low.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: product.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-brand",
								children: product.stockQty === 0 ? "หมด" : product.stockQty
							})]
						}, product.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							"ราคาตัวอย่างเมนูทำสด กาแฟลาเต้ ",
							baht(products.find((item) => item.sku === "D02")?.price ?? 0),
							" ไม่ถูกนับในสต๊อก"
						]
					})
				]
			})]
		}),
		target ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
			title: mode === "receive" ? `รับเข้า ${target.name}` : `ปรับยอด ${target.name}`,
			onClose: () => setTargetId(null),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-sm text-muted",
					children: [
						"คงเหลือปัจจุบัน ",
						target.stockQty,
						" ชิ้น · วันที่ ",
						user?.role === "admin" ? date : today
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: mode === "receive" ? "จำนวนรับเข้า" : "ยอดคงเหลือใหม่",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						inputMode: "numeric",
						value: qty,
						onChange: (event) => setQty(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "หมายเหตุ",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						className: "mt-2",
						value: note,
						onChange: (event) => setNote(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3 w-full",
					onClick: () => {
						const amount = Number(qty);
						const when = user?.role === "admin" ? date : today;
						if ((mode === "receive" ? receiveStock(target.id, amount, when, note) : adjustStock(target.id, amount, when, note)).ok) setTargetId(null);
					},
					children: "บันทึก"
				})
			]
		}) : null
	] });
}
function FilterChip({ active, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `min-h-11 shrink-0 rounded-lg px-4 text-sm ${active ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`,
		children: label
	});
}
function StockPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireSession, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockView, {}) }) });
}
//#endregion
export { StockPage as component };
