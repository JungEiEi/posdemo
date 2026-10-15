import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Settings, l as Menu, p as ChartColumn, r as ShoppingBag, s as Package, t as X, u as LogOut } from "../_libs/lucide-react.mjs";
import { C as roleLabel, E as Modal, O as SelectInput, S as orderDay, T as Field, b as formatCeStamp, c as systemCash, d as PAY_LABEL, h as cashTotal, i as useSessionUser, j as TextInput, p as baht, r as usePosStore, u as BILL_VALUES, v as formatBe, w as Button, x as inRange, y as formatBeStamp } from "./router-CNKdKW2n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-c-avJ193.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReceiptSlip({ order, settings }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "receipt-paper mx-auto bg-card px-3 py-4 text-xs leading-snug text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm",
						children: settings.companyName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1",
						children: settings.companyAddress
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1",
						children: ["โทร ", settings.companyPhone]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-2 border-dashed border-ink" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["เลขที่ / No. ", order.receiptShort] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["วันที่ / Date ", formatCeStamp(order.createdAt)] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				"เครื่อง ",
				order.terminalName,
				" · ",
				order.userName
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-2 border-dashed border-ink" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1.5rem_1fr_2rem_2.5rem] gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ลำดับ" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "รายการ" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "จำนวน"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right",
						children: "ราคา"
					}),
					order.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "contents",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: index + 1 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.productName }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-right",
								children: item.qty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-right",
								children: baht(item.lineTotal)
							})
						]
					}, `${item.productId}-${index}`))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-2 border-dashed border-ink" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right text-sm",
				children: ["รวม ", baht(order.total)]
			}),
			order.paymentMethod === "cash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: ["รับ ", baht(order.cashReceived ?? 0)]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: ["ทอน ", baht(order.changeAmount ?? 0)]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [
					PAY_LABEL[order.paymentMethod],
					" ",
					baht(order.total)
				]
			}),
			order.status === "void" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 text-center text-sm text-brand",
				children: ["** ยกเลิก **", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-ink",
					children: ["เหตุผล: ", order.voidReason]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-center",
				children: "ขอบคุณที่ใช้บริการ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 text-center text-muted",
				children: ["รายงานใช้เลขที่ ", order.receiptLong]
			})
		]
	});
}
function PrintSheet({ job }) {
	if (job.kind === "sales") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesSheet, { job });
	if (job.kind === "items") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemsSheet, {
		from: job.from,
		to: job.to
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoidsSheet, {
		from: job.from,
		to: job.to
	});
}
function SalesSheet({ job }) {
	const orders = usePosStore((state) => state.orders);
	const settings = usePosStore((state) => state.settings);
	const list = orders.filter((order) => order.status === "normal" && inRange(orderDay(order.createdAt), job.from, job.to)).filter((order) => job.pay === "all" || order.paymentMethod === job.pay).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
	const voids = orders.filter((order) => order.status === "void" && order.voidedAt && inRange(orderDay(order.voidedAt), job.from, job.to));
	const sums = {
		cash: 0,
		transfer: 0,
		credit: 0
	};
	for (const order of list) sums[order.paymentMethod] += order.total;
	const counted = cashTotal(job.counts, job.coin);
	const system = systemCash(orders, job.cashDate);
	const filled = counted > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "bg-card p-4 text-sm text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center text-lg text-brand",
				children: settings.companyName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-center",
				children: [
					"รายงานการขาย ประจำวันที่ ",
					formatBe(job.from),
					job.from !== job.to ? ` – ${formatBe(job.to)}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "mt-4 w-full border-collapse text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1",
							children: "ลำดับ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "วันที่ใบเสร็จ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "เลขที่ใบเสร็จ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "ชำระเงินสด"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "เงินโอน"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "เครดิตการ์ด"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [list.map((order, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-sand",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: index + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatBe(orderDay(order.createdAt)) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: order.receiptLong }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right",
							children: order.paymentMethod === "cash" ? baht(order.total) : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right",
							children: order.paymentMethod === "transfer" ? baht(order.total) : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right",
							children: order.paymentMethod === "credit" ? baht(order.total) : ""
						})
					]
				}, order.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2",
						children: "รวมทั้งสิ้น"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right",
						children: baht(sums.cash)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right",
						children: baht(sums.transfer)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right",
						children: baht(sums.credit)
					})
				] })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-muted",
				children: [
					"บิลที่ยกเลิกไม่รวมในยอด: ",
					voids.length,
					" ใบ รวม ",
					baht(voids.reduce((sum, order) => sum + order.total, 0)),
					" บาท"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-6 text-brand",
				children: ["สรุปการนำส่งเงินสด วันที่ ", formatBe(job.cashDate)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"ยอดเงินสดตามระบบ ",
				baht(system),
				" บาท"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "mt-2 w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "ลำดับ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-left",
						children: "แบงค์/เหรียญ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "จำนวน"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "text-right",
						children: "รวมเป็นเงิน"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [BILL_VALUES.map((value, index) => {
					const count = Math.floor(job.counts[String(value)] || 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: index + 1 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: baht(value) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right",
							children: filled ? count : "________"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right",
							children: filled ? baht(value * count) : "________"
						})
					] }, value);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: BILL_VALUES.length + 1 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "เหรียญ/อื่นๆ" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "text-right",
						children: filled ? baht(job.coin) : "________"
					})
				] })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3",
				children: [
					"รวมเงินสดที่นำส่ง ",
					filled ? baht(counted) : "________________",
					" บาท"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"ส่วนต่างเทียบระบบ ",
				filled ? baht(counted - system) : "________________",
				" บาท"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ลงชื่อผู้นำส่งเงิน ________________" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ลงชื่อผู้รับเงิน ________________" })]
			})
		]
	});
}
function ItemsSheet({ from, to }) {
	const groups = itemGroups(usePosStore((state) => state.orders), usePosStore((state) => state.products), usePosStore((state) => state.categories), from, to);
	const grand = groups.reduce((sum, group) => sum + group.rows.reduce((inner, row) => inner + row.amount, 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "bg-card p-4 text-sm text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center text-lg text-brand",
				children: "สรุปจำนวนสินค้าที่ขาย"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-center",
				children: [formatBe(from), from !== to ? ` – ${formatBe(to)}` : ""]
			}),
			groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-brand",
						children: group.name
					}),
					group.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-b border-sand py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							row.qty,
							" · ",
							baht(row.amount)
						] })]
					}, row.name)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-1 text-right",
						children: ["รวมหมวด ", baht(group.rows.reduce((sum, row) => sum + row.amount, 0))]
					})
				]
			}, group.name)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-right text-base",
				children: ["รวมทั้งสิ้น ", baht(grand)]
			})
		]
	});
}
function VoidsSheet({ from, to }) {
	const list = usePosStore((state) => state.orders).filter((order) => order.status === "void" && order.voidedAt && inRange(orderDay(order.voidedAt), from, to)).sort((a, b) => (a.voidedAt ?? "").localeCompare(b.voidedAt ?? ""));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "bg-card p-4 text-sm text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center text-lg text-brand",
				children: "ประวัติการยกเลิกบิล"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-center",
				children: [
					formatBe(from),
					" – ",
					formatBe(to),
					" · ",
					list.length,
					" ใบ · ",
					baht(list.reduce((sum, order) => sum + order.total, 0)),
					" บาท"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "mt-4 w-full text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-1",
							children: "เลขที่"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ยอด" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ชำระ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ยกเลิกเมื่อ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ผู้ยกเลิก" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "เหตุผล" })
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-sand",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1",
							children: order.receiptLong
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: baht(order.total) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: PAY_LABEL[order.paymentMethod] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: order.voidedAt ? formatBeStamp(order.voidedAt) : "" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: order.voidedByName }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: order.voidReason })
					]
				}, order.id)) })]
			})
		]
	});
}
function itemGroups(orders, products, categories, from, to) {
	const map = /* @__PURE__ */ new Map();
	for (const order of orders) {
		if (order.status !== "normal" || !inRange(orderDay(order.createdAt), from, to)) continue;
		for (const item of order.items) {
			const key = item.productId || item.productName;
			const prev = map.get(key) ?? {
				name: item.productName,
				qty: 0,
				amount: 0,
				categoryId: products.find((product) => product.id === item.productId)?.categoryId ?? ""
			};
			prev.qty += item.qty;
			prev.amount += item.lineTotal;
			map.set(key, prev);
		}
	}
	const grouped = /* @__PURE__ */ new Map();
	for (const row of map.values()) {
		const category = categories.find((item) => item.id === row.categoryId);
		const name = category?.name ?? "ไม่ระบุหมวด";
		const bucket = grouped.get(name) ?? {
			name,
			sort: category?.sortOrder ?? 99,
			rows: []
		};
		bucket.rows.push({
			name: row.name,
			qty: row.qty,
			amount: row.amount
		});
		grouped.set(name, bucket);
	}
	return [...grouped.values()].sort((a, b) => a.sort - b.sort).map((group) => ({
		...group,
		rows: group.rows.sort((a, b) => a.name.localeCompare(b.name, "th"))
	}));
}
var links = [
	{
		to: "/",
		label: "ขายหน้าร้าน",
		icon: ShoppingBag
	},
	{
		to: "/reports",
		label: "รายงานยอดขาย",
		icon: ChartColumn
	},
	{
		to: "/stock",
		label: "สต๊อก",
		icon: Package
	}
];
function Shell({ children }) {
	const user = useSessionUser();
	const path = useRouterState({ select: (state) => state.location.pathname });
	const logout = usePosStore((state) => state.logout);
	const terminalName = usePosStore((state) => state.terminalName);
	const printMode = usePosStore((state) => state.printMode);
	const setTerminal = usePosStore((state) => state.setTerminal);
	const notice = usePosStore((state) => state.notice);
	const printJob = usePosStore((state) => state.printJob);
	const printTicket = usePosStore((state) => state.printTicket);
	const cartCount = usePosStore((state) => state.cart.reduce((sum, line) => sum + line.qty, 0));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [terminalOpen, setTerminalOpen] = (0, import_react.useState)(false);
	const [leaveOpen, setLeaveOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(terminalName);
	const [mode, setMode] = (0, import_react.useState)(printMode);
	(0, import_react.useEffect)(() => {
		if (!notice) return;
		const timer = window.setTimeout(() => {
			if (usePosStore.getState().notice?.id === notice.id) usePosStore.setState({ notice: null });
		}, 3200);
		return () => window.clearTimeout(timer);
	}, [notice]);
	(0, import_react.useEffect)(() => {
		if (!printTicket) return;
		const timer = window.setTimeout(() => window.print(), 80);
		return () => window.clearTimeout(timer);
	}, [printTicket]);
	if (!user) return null;
	function requestLeave() {
		if (cartCount > 0) setLeaveOpen(true);
		else logout();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `min-h-dvh bg-cream text-ink ${printJob ? "print-active" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: printJob ? "no-print" : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-14 items-center gap-2 bg-brand px-2 text-brand-ink sm:px-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "เปิดเมนู",
							onClick: () => setOpen(true),
							className: "grid size-11 place-items-center rounded-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate",
								children: "OneDayPOS"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1 sm:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden max-w-36 truncate text-sm sm:inline",
									children: user.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-sky px-2 py-1 text-xs text-ink",
									children: roleLabel(user.role)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "ออกจากระบบ",
									onClick: requestLeave,
									className: "grid size-11 place-items-center rounded-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-5" })
								})
							]
						})
					]
				}),
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "ปิดเมนู",
					className: "fixed inset-0 z-40 bg-ink/40",
					onClick: () => setOpen(false)
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `sidebar-panel fixed top-0 left-0 z-50 flex h-dvh w-72 flex-col bg-card p-4 shadow-xl ${open ? "translate-x-0" : "-translate-x-full"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-brand",
								children: "OneDayPOS"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-muted",
								children: [
									user.name,
									" · ",
									roleLabel(user.role)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "ยุบเมนู",
								onClick: () => setOpen(false),
								className: "grid size-11 place-items-center rounded-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "grid gap-1",
							children: [links.map((item) => {
								const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									onClick: () => setOpen(false),
									className: `flex min-h-11 items-center gap-3 rounded-lg px-3 ${active ? "bg-sky text-ink" : "text-ink"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
								}, item.to);
							}), user.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin",
								onClick: () => setOpen(false),
								className: `flex min-h-11 items-center gap-3 rounded-lg px-3 ${path.startsWith("/admin") ? "bg-sky text-ink" : "text-ink"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" }), "ระบบแอดมิน"]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto grid gap-2 pt-6 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-cream px-3 py-2",
									children: [
										"เครื่องนี้: ",
										terminalName,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted",
											children: printMode === "auto" ? "พิมพ์อัตโนมัติหลังขาย" : "แสดงใบเสร็จให้บันทึก PDF"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "sand",
									onClick: () => {
										setName(terminalName);
										setMode(printMode);
										setTerminalOpen(true);
									},
									children: "ตั้งค่าเครื่องนี้"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "ข้อมูลขายเก็บบนเบราว์เซอร์ของเครื่องนี้ สำรองไฟล์ได้ในเมนูแอดมิน"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto min-w-0 max-w-7xl p-3 sm:p-4",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptDialog, {}),
				notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-md rounded-lg bg-brand px-4 py-3 text-sm text-brand-ink shadow-lg",
						children: notice.text
					})
				}) : null,
				terminalOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
					title: "ตั้งค่าเครื่องนี้",
					onClose: () => setTerminalOpen(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-3",
						onSubmit: (event) => {
							event.preventDefault();
							setTerminal(name, mode);
							setTerminalOpen(false);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "ชื่อเครื่อง",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: name,
									onChange: (event) => setName(event.target.value),
									placeholder: "POS-1"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "โหมดพิมพ์",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
									value: mode,
									onChange: (event) => setMode(event.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "auto",
										children: "พิมพ์อัตโนมัติหลังขาย"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pdf",
										children: "แสดงใบเสร็จ (บันทึก PDF)"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "ค่านี้เก็บเฉพาะเครื่องนี้ ไม่กระทบเครื่องขายเครื่องอื่น"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									children: "บันทึก"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "sand",
									onClick: () => {
										setTerminal(name, mode);
										const sample = {
											id: "test",
											clientUuid: "test",
											receiptYear: (/* @__PURE__ */ new Date()).getFullYear(),
											seqNo: 0,
											receiptShort: "TEST",
											receiptLong: "TEST",
											userId: user.id,
											userName: user.name,
											terminalName: name.trim() || "POS-1",
											paymentMethod: "cash",
											total: 1,
											cashReceived: 1,
											changeAmount: 0,
											status: "normal",
											voidedBy: null,
											voidedByName: null,
											voidedAt: null,
											voidReason: null,
											createdAt: (/* @__PURE__ */ new Date()).toISOString(),
											items: [{
												productId: "test",
												productName: "ทดสอบการพิมพ์",
												unitPrice: 1,
												qty: 1,
												lineTotal: 1,
												trackStock: false
											}]
										};
										usePosStore.getState().requestPrint({
											kind: "receipt",
											order: sample
										});
									},
									children: "ทดสอบพิมพ์"
								})]
							})
						]
					})
				}) : null,
				leaveOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
					title: "ออกจากระบบ",
					onClose: () => setLeaveOpen(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "มีรายการค้างในตะกร้า จะละทิ้งแล้วออกจากระบบหรือไม่"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								setLeaveOpen(false);
								logout();
							},
							children: "ออกจากระบบ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "sand",
							onClick: () => setLeaveOpen(false),
							children: "อยู่ต่อ"
						})]
					})]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "print-mount",
			"aria-hidden": "true",
			children: [printJob?.kind === "receipt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptSlip, {
				order: printJob.order,
				settings: usePosStore.getState().settings
			}) : null, printJob && printJob.kind !== "receipt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintSheet, { job: printJob }) : null]
		})]
	});
}
function ReceiptDialog() {
	const orderId = usePosStore((state) => state.receiptOrderId);
	const auto = usePosStore((state) => state.receiptAutoPrint);
	const order = usePosStore((state) => state.orders.find((item) => item.id === orderId) ?? null);
	const settings = usePosStore((state) => state.settings);
	const closeReceipt = usePosStore((state) => state.closeReceipt);
	const requestPrint = usePosStore((state) => state.requestPrint);
	(0, import_react.useEffect)(() => {
		if (!order || !auto) return;
		requestPrint({
			kind: "receipt",
			order
		});
		usePosStore.setState({ receiptAutoPrint: false });
	}, [
		auto,
		order,
		requestPrint
	]);
	if (!order) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: `ใบเสร็จ ${order.receiptShort}`,
		onClose: closeReceipt,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-sand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptSlip, {
					order,
					settings
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => requestPrint({
						kind: "receipt",
						order
					}),
					children: "พิมพ์ / PDF"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "sand",
					onClick: closeReceipt,
					children: "ลูกค้าถัดไป"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "เลือกกระดาษ 80 มม. ถ้าเครื่องพิมพ์ไม่พร้อม ให้บันทึกเป็น PDF"
			})
		]
	});
}
//#endregion
export { itemGroups as n, Shell as t };
