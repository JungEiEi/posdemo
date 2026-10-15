import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Printer, c as Minus, o as Plus, r as ShoppingBag } from "../_libs/lucide-react.mjs";
import { E as Modal, T as Field, d as PAY_LABEL, f as VOID_REASONS, i as useSessionUser, j as TextInput, m as bangkokISODate, n as RequireSession, p as baht, r as usePosStore, w as Button } from "./router-CNKdKW2n.mjs";
import { t as Shell } from "./shell-c-avJ193.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BAfNeeh9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var QUICK = [
	20,
	50,
	100,
	500,
	1e3
];
function PosView() {
	const user = useSessionUser();
	const categories = usePosStore((state) => state.categories);
	const products = usePosStore((state) => state.products);
	const cart = usePosStore((state) => state.cart);
	const settings = usePosStore((state) => state.settings);
	const orders = usePosStore((state) => state.orders);
	const addToCart = usePosStore((state) => state.addToCart);
	const changeQty = usePosStore((state) => state.changeQty);
	const clearCart = usePosStore((state) => state.clearCart);
	const checkout = usePosStore((state) => state.checkout);
	const voidOrder = usePosStore((state) => state.voidOrder);
	const openReceipt = usePosStore((state) => state.openReceipt);
	const [categoryId, setCategoryId] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const [method, setMethod] = (0, import_react.useState)("cash");
	const [cash, setCash] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [billsOpen, setBillsOpen] = (0, import_react.useState)(false);
	const [billDate, setBillDate] = (0, import_react.useState)(bangkokISODate());
	const [voidId, setVoidId] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)(VOID_REASONS[0]);
	const [custom, setCustom] = (0, import_react.useState)("");
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const activeCategories = (0, import_react.useMemo)(() => categories.filter((item) => item.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [categories]);
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return products.filter((product) => product.isActive && activeCategories.some((category) => category.id === product.categoryId)).filter((product) => categoryId === "all" || product.categoryId === categoryId).filter((product) => !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q)).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "th"));
	}, [
		products,
		activeCategories,
		categoryId,
		query
	]);
	const lines = cart.map((line) => {
		const product = products.find((item) => item.id === line.productId);
		if (!product) return null;
		return {
			line,
			product,
			amount: product.price * line.qty
		};
	}).filter((item) => item !== null);
	const total = lines.reduce((sum, item) => sum + item.amount, 0);
	const count = lines.reduce((sum, item) => sum + item.line.qty, 0);
	const received = Number(cash);
	const change = method === "cash" ? Math.max(0, (Number.isFinite(received) ? received : 0) - total) : 0;
	const cashOk = method !== "cash" || Number.isFinite(received) && received >= total;
	const today = bangkokISODate();
	const bills = orders.filter((order) => {
		if (new Intl.DateTimeFormat("en-CA", {
			timeZone: "Asia/Bangkok",
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		}).format(new Date(order.createdAt)) !== (user?.role === "admin" ? billDate : today)) return false;
		if (user?.role !== "admin" && order.userId !== user?.id) return false;
		return true;
	});
	function pay() {
		if (busy || !cashOk) return;
		setBusy(true);
		const result = checkout({
			paymentMethod: method,
			cashReceived: method === "cash" ? received : null
		});
		setBusy(false);
		if (result.ok) {
			setPayOpen(false);
			setCartOpen(false);
			setCash("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-3 lg:flex-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "min-w-0 flex-1 pb-24 lg:pb-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl text-brand",
							children: "ขายหน้าร้าน"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "sand",
							onClick: () => setBillsOpen(true),
							children: "บิลวันนี้"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex gap-2 overflow-x-auto pb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCategoryId("all"),
							className: `min-h-11 shrink-0 rounded-lg px-4 text-sm ${categoryId === "all" ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`,
							children: "รวมเมนูทั้งหมด"
						}), activeCategories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCategoryId(category.id),
							className: `min-h-11 shrink-0 rounded-lg px-4 text-sm ${categoryId === category.id ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`,
							children: category.name
						}, category.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "ค้นหาชื่อหรือรหัสเมนู",
						className: "mb-3"
					}),
					visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-card p-6 text-center text-muted",
						children: "ไม่พบเมนูในหมวดนี้"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4",
						children: visible.map((product) => {
							const soldOut = product.trackStock && product.stockQty <= 0;
							const low = product.trackStock && product.stockQty > 0 && product.stockQty < settings.lowStockThreshold;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: soldOut,
								onClick: () => addToCart(product.id),
								className: `overflow-hidden rounded-xl border border-sand bg-card text-left ${soldOut ? "opacity-50" : ""}`,
								children: [settings.showImages ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative aspect-square bg-sand",
									children: [
										product.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: product.image,
											alt: product.name,
											className: "h-full w-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-full place-items-center text-sm text-brand",
											children: "ไม่มีรูป"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute right-2 bottom-2 rounded-md bg-brand px-2 py-1 text-sm text-brand-ink",
											children: baht(product.price)
										}),
										soldOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute top-2 left-2 rounded-md bg-brand px-2 py-1 text-xs text-brand-ink",
											children: "หมด"
										}) : null
									]
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm leading-snug",
											children: product.name
										}),
										!settings.showImages ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-brand",
											children: baht(product.price)
										}) : null,
										soldOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-brand",
											children: "หมด"
										}) : null,
										low ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-brand",
											children: ["เหลือ ", product.stockQty]
										}) : null,
										!product.trackStock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted",
											children: "ทำสด"
										}) : null
									]
								})]
							}, product.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "sticky top-16 hidden w-80 shrink-0 self-start lg:block xl:w-96",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartPanel, {
					lines,
					total,
					onDec: (id) => changeQty(id, -1),
					onInc: (id) => changeQty(id, 1),
					onClear: clearCart,
					onPay: () => {
						setMethod("cash");
						setCash("");
						setPayOpen(true);
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setCartOpen(true),
				className: "fixed right-3 bottom-4 z-30 flex min-h-12 items-center gap-2 rounded-xl bg-brand px-4 text-brand-ink shadow-lg lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }),
						"ตะกร้า ",
						count
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: baht(total) })]
			}),
			cartOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "ปิดตะกร้า",
					className: "absolute inset-0 bg-ink/40",
					onClick: () => setCartOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-auto rounded-t-2xl bg-card p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartPanel, {
						lines,
						total,
						onDec: (id) => changeQty(id, -1),
						onInc: (id) => changeQty(id, 1),
						onClear: clearCart,
						onPay: () => {
							setMethod("cash");
							setCash("");
							setPayOpen(true);
						}
					})
				})]
			}) : null,
			payOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				title: "ชำระเงิน",
				onClose: () => setPayOpen(false),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 text-sm text-muted",
						children: ["ต้องชำระ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg text-brand",
							children: baht(total)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayChoice, {
								label: "เงินสด",
								active: method === "cash",
								onClick: () => setMethod("cash")
							}),
							settings.allowTransfer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayChoice, {
								label: "โอนเงิน",
								active: method === "transfer",
								onClick: () => setMethod("transfer")
							}) : null,
							settings.allowCredit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayChoice, {
								label: "บัตรเครดิต",
								active: method === "credit",
								onClick: () => setMethod("credit")
							}) : null
						]
					}),
					method === "cash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "เงินที่ได้รับ",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									inputMode: "decimal",
									value: cash,
									onChange: (event) => setCash(event.target.value),
									placeholder: "0"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [QUICK.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-lg bg-sand px-3 text-sm text-ink",
									onClick: () => setCash(String((Number(cash) || 0) + value)),
									children: baht(value)
								}, value)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 rounded-lg bg-sky px-3 text-sm text-ink",
									onClick: () => setCash(String(total)),
									children: "พอดี"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: ["ทอน ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg text-brand",
									children: baht(change)
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [
							"บันทึกประเภท ",
							PAY_LABEL[method],
							" และยอดเท่านั้น ไม่เก็บเลขบัตร"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4 w-full",
						disabled: !cashOk || busy || total <= 0,
						onClick: pay,
						children: busy ? "กำลังบันทึก..." : "ยืนยันการขาย"
					})
				]
			}) : null,
			billsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				title: "บิลวันนี้",
				onClose: () => setBillsOpen(false),
				wide: true,
				children: [user?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "วันที่",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "date",
						value: billDate,
						onChange: (event) => setBillDate(event.target.value)
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "ผู้ขายเห็นเฉพาะบิลของตนเองในวันนี้"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-2",
					children: [bills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "ยังไม่มีบิล"
					}) : null, bills.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-sand p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								order.receiptShort,
								" · ",
								baht(order.total),
								" บาท"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-muted",
								children: [
									PAY_LABEL[order.paymentMethod],
									" · ",
									order.userName,
									" · ",
									order.terminalName,
									order.status === "void" ? " · ยกเลิกแล้ว" : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "พิมพ์ซ้ำ",
								className: "grid size-11 place-items-center rounded-lg bg-sand",
								onClick: () => openReceipt(order.id, false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" })
							})]
						}), order.status === "normal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "mt-1 px-0 text-brand",
							onClick: () => setVoidId(order.id),
							children: "ยกเลิกบิล"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-brand",
							children: ["เหตุผล: ", order.voidReason]
						})]
					}, order.id))]
				})]
			}) : null,
			voidId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				title: "ยกเลิกบิล",
				onClose: () => setVoidId(null),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-sm text-muted",
						children: "บิลที่ยกเลิกจะไม่นับยอดขาย และคืนสต๊อก ย้อนกลับไม่ได้"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: VOID_REASONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setReason(item),
							className: `min-h-11 rounded-lg px-3 text-sm ${reason === item ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`,
							children: item
						}, item))
					}),
					reason === "อื่นๆ" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						className: "mt-2",
						value: custom,
						onChange: (event) => setCustom(event.target.value),
						placeholder: "ระบุเหตุผล"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						onClick: () => {
							if (voidOrder(voidId, reason === "อื่นๆ" ? custom : reason).ok) {
								setVoidId(null);
								setCustom("");
							}
						},
						children: "ยืนยันยกเลิกบิล"
					})
				]
			}) : null
		]
	});
}
function PayChoice({ label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `min-h-11 rounded-lg px-2 text-sm ${active ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`,
		children: label
	});
}
function CartPanel({ lines, total, onDec, onInc, onClear, onPay }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cart-pane flex flex-col rounded-xl border border-sand bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg text-brand",
				children: "ตะกร้า"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 min-h-24 flex-1 overflow-auto",
				children: [lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-8 text-center text-sm text-muted",
					children: "แตะเมนูเพื่อเพิ่มรายการ"
				}) : null, lines.map(({ line, product, amount }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-sand py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm",
								children: product.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted",
								children: [
									"x",
									line.qty,
									" · ",
									baht(amount)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "ลดจำนวน",
							className: "grid size-11 place-items-center rounded-lg bg-sand",
							onClick: () => onDec(line.productId),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "เพิ่มจำนวน",
							className: "grid size-11 place-items-center rounded-lg bg-sand",
							onClick: () => onInc(line.productId),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
						})
					]
				}, line.productId))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-end justify-between border-t border-sand pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "รวมทั้งหมด" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xl text-brand",
					children: baht(total)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-3 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "sand",
					onClick: onClear,
					disabled: lines.length === 0,
					children: "ล้าง"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "col-span-2",
					disabled: lines.length === 0,
					onClick: onPay,
					children: "ชำระเงิน"
				})]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireSession, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosView, {}) }) });
}
//#endregion
export { Home as component };
