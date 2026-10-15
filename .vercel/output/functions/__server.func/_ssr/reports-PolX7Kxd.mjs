import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as PageHeader, O as SelectInput, S as orderDay, T as Field, b as formatCeStamp, c as systemCash, d as PAY_LABEL, g as downloadCsv, h as cashTotal, j as TextInput, m as bangkokISODate, n as RequireSession, p as baht, r as usePosStore, u as BILL_VALUES, v as formatBe, w as Button, x as inRange, y as formatBeStamp } from "./router-CNKdKW2n.mjs";
import { n as itemGroups, t as Shell } from "./shell-c-avJ193.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-PolX7Kxd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsView() {
	const orders = usePosStore((state) => state.orders);
	const products = usePosStore((state) => state.products);
	const categories = usePosStore((state) => state.categories);
	const users = usePosStore((state) => state.users);
	const openReceipt = usePosStore((state) => state.openReceipt);
	const requestPrint = usePosStore((state) => state.requestPrint);
	const saveCashCount = usePosStore((state) => state.saveCashCount);
	const cashCounts = usePosStore((state) => state.cashCounts);
	const today = bangkokISODate();
	const [tab, setTab] = (0, import_react.useState)("bills");
	const [from, setFrom] = (0, import_react.useState)(today);
	const [to, setTo] = (0, import_react.useState)(today);
	const [pay, setPay] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("normal");
	const [query, setQuery] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [cashDate, setCashDate] = (0, import_react.useState)(today);
	const [counts, setCounts] = (0, import_react.useState)({});
	const [coin, setCoin] = (0, import_react.useState)(0);
	const bills = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return orders.filter((order) => inRange(orderDay(order.createdAt), from, to)).filter((order) => status === "all" || order.status === status).filter((order) => pay === "all" || order.paymentMethod === pay).filter((order) => {
			if (!q) return true;
			return order.receiptShort.toLowerCase().includes(q) || order.receiptLong.toLowerCase().includes(q) || order.userName.toLowerCase().includes(q);
		}).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
	}, [
		orders,
		from,
		to,
		status,
		pay,
		query
	]);
	const normalBills = bills.filter((order) => order.status === "normal");
	const sums = {
		cash: 0,
		transfer: 0,
		credit: 0
	};
	for (const order of normalBills) sums[order.paymentMethod] += order.total;
	const voids = (0, import_react.useMemo)(() => orders.filter((order) => order.status === "void" && order.voidedAt && inRange(orderDay(order.voidedAt), from, to)).sort((a, b) => (a.voidedAt ?? "").localeCompare(b.voidedAt ?? "")), [
		orders,
		from,
		to
	]);
	const groups = (0, import_react.useMemo)(() => itemGroups(orders, products, categories, from, to), [
		orders,
		products,
		categories,
		from,
		to
	]);
	const system = systemCash(orders, cashDate);
	const counted = cashTotal(counts, coin);
	const saved = cashCounts.filter((row) => row.countDate === cashDate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageHeader, {
			title: "รายงานยอดขาย",
			hint: "บิลที่ยกเลิกไม่ถูกนับในยอดขาย",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "sand",
				onClick: () => exportCurrent(tab, bills, voids, groups, from, to),
				children: "ดาวน์โหลด Excel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					if (tab === "items") requestPrint({
						kind: "items",
						from,
						to
					});
					else if (tab === "voids") requestPrint({
						kind: "voids",
						from,
						to
					});
					else requestPrint({
						kind: "sales",
						from,
						to,
						pay,
						cashDate,
						counts,
						coin
					});
				},
				children: "พิมพ์ / PDF"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex gap-2 overflow-x-auto",
			children: [
				["bills", "รายการบิล"],
				["items", "สรุปสินค้า"],
				["voids", "บิลที่ยกเลิก"],
				["cash", "นำส่งเงินสด"]
			].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(id),
				className: `min-h-11 shrink-0 rounded-lg px-4 text-sm ${tab === id ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`,
				children: label
			}, id))
		}),
		tab !== "cash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 grid gap-2 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "จากวันที่",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "date",
						value: from,
						onChange: (event) => setFrom(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ถึงวันที่",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "date",
						value: to,
						onChange: (event) => setTo(event.target.value)
					})
				}),
				tab === "bills" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ประเภทชำระ",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
						value: pay,
						onChange: (event) => setPay(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "ทั้งหมด"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cash",
								children: "เงินสด"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "transfer",
								children: "โอนเงิน"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "credit",
								children: "บัตรเครดิต"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "สถานะ",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
						value: status,
						onChange: (event) => setStatus(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "normal",
								children: "ปกติ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "void",
								children: "ยกเลิก"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "ทั้งหมด"
							})
						]
					})
				})] }) : null
			]
		}) : null,
		tab === "bills" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "ค้นหาเลขที่หรือผู้ขาย",
				className: "mb-3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumCard, {
						label: "เงินสด",
						value: sums.cash
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumCard, {
						label: "โอนเงิน",
						value: sums.transfer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumCard, {
						label: "บัตรเครดิต",
						value: sums.credit
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumCard, {
						label: "รวมปกติ",
						value: sums.cash + sums.transfer + sums.credit
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [bills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-card p-6 text-center text-muted",
					children: "ยังไม่มีบิลในช่วงนี้"
				}) : null, bills.map((order, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-sand bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-start justify-between gap-3 text-left",
						onClick: () => setOpenId(openId === order.id ? null : order.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							index + 1,
							". ",
							order.receiptLong
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted",
							children: [
								formatBeStamp(order.createdAt),
								" · ",
								PAY_LABEL[order.paymentMethod],
								" · ",
								order.userName,
								order.status === "void" ? " · ยกเลิก" : ""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-brand",
							children: baht(order.total)
						})]
					}), openId === order.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 border-t border-sand pt-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted",
								children: ["ใบเสร็จ ", order.receiptShort]
							}),
							order.items.map((item, itemIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									item.productName,
									" x",
									item.qty
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: baht(item.lineTotal) })]
							}, `${item.productName}-${itemIndex}`)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "sand",
								className: "mt-2",
								onClick: () => openReceipt(order.id, false),
								children: "พิมพ์ใบเสร็จซ้ำ"
							})
						]
					}) : null]
				}, order.id))]
			})
		] }) : null,
		tab === "items" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-card p-6 text-center text-muted",
				children: "ยังไม่มียอดขายในช่วงนี้"
			}) : null, groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-sand bg-card p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-brand",
						children: group.name
					}),
					group.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-b border-sand py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							row.qty,
							" ชิ้น · ",
							baht(row.amount)
						] })]
					}, row.name)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 text-right text-sm",
						children: ["รวมหมวด ", baht(group.rows.reduce((sum, row) => sum + row.amount, 0))]
					})
				]
			}, group.name))]
		}) : null,
		tab === "voids" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						voids.length,
						" ใบ · ",
						baht(voids.reduce((sum, order) => sum + order.total, 0)),
						" บาท"
					]
				}),
				voids.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-card p-6 text-center text-muted",
					children: "ไม่มีบิลที่ยกเลิกในช่วงนี้"
				}) : null,
				voids.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-sand bg-card p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.receiptLong }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-brand",
								children: baht(order.total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted",
							children: [
								PAY_LABEL[order.paymentMethod],
								" · ออกโดย ",
								order.userName,
								" · เครื่อง ",
								order.terminalName
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"ยกเลิก ",
							order.voidedAt ? formatBeStamp(order.voidedAt) : "",
							" โดย ",
							order.voidedByName
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["เหตุผล: ", order.voidReason] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-muted",
							children: order.items.map((item) => `${item.productName} x${item.qty}`).join(", ")
						})
					]
				}, order.id))
			]
		}) : null,
		tab === "cash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 lg:grid-cols-[1.2fr_0.8fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-sand bg-card p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "วันที่นำส่ง",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							type: "date",
							value: cashDate,
							onChange: (event) => setCashDate(event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: [
							"ยอดเงินสดตามระบบ ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-brand",
								children: baht(system)
							}),
							" บาท"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2",
						children: [BILL_VALUES.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid grid-cols-[6rem_1fr_6rem] items-center gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: baht(value) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									inputMode: "numeric",
									value: counts[String(value)] ?? "",
									onChange: (event) => setCounts((prev) => ({
										...prev,
										[String(value)]: Math.max(0, Math.floor(Number(event.target.value) || 0))
									})),
									placeholder: "จำนวนใบ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-right",
									children: baht(value * (counts[String(value)] || 0))
								})
							]
						}, value)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid grid-cols-[6rem_1fr] items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "เหรียญ/อื่นๆ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								inputMode: "decimal",
								value: coin || "",
								onChange: (event) => setCoin(Math.max(0, Number(event.target.value) || 0)),
								placeholder: "บาท"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-end justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "รวมเงินสดที่นำส่ง" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl text-brand",
							children: baht(counted)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"ส่วนต่าง ",
							baht(counted - system),
							" บาท"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						onClick: () => saveCashCount({
							date: cashDate,
							counts,
							coin,
							total: counted,
							system
						}),
						children: "บันทึกนำส่ง"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-sand bg-card p-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-brand",
						children: "ประวัติวันนี้"
					}),
					saved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted",
						children: "ยังไม่บันทึก"
					}) : null,
					saved.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 border-b border-sand py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							row.userName,
							" · นับได้ ",
							baht(row.totalCounted)
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted",
							children: [
								"ระบบ ",
								baht(row.systemCash),
								" · ส่วนต่าง ",
								baht(row.difference),
								" · ",
								formatCeStamp(row.createdAt)
							]
						})]
					}, row.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: "ผู้รับเงินเซ็นบนกระดาษตอนพิมพ์รายงาน"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted",
						children: ["ผู้ขายในระบบ: ", users.filter((user) => user.role === "seller" && user.isActive).map((user) => user.name).join(", ") || "-"]
					})
				]
			})]
		}) : null
	] });
}
function SumCard({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-brand",
			children: baht(value)
		})]
	});
}
function exportCurrent(tab, bills, voids, groups, from, to) {
	if (tab === "items") {
		const rows = [[
			"หมวดหมู่",
			"สินค้า",
			"จำนวน",
			"ยอดเงิน"
		]];
		for (const group of groups) {
			for (const row of group.rows) rows.push([
				group.name,
				row.name,
				row.qty,
				row.amount
			]);
			rows.push([
				group.name,
				"รวมหมวด",
				"",
				group.rows.reduce((sum, row) => sum + row.amount, 0)
			]);
		}
		downloadCsv(`onedaypos-items-${from}-${to}.csv`, rows);
		return;
	}
	if (tab === "voids") {
		downloadCsv(`onedaypos-voids-${from}-${to}.csv`, [[
			"เลขที่",
			"ยอด",
			"ชำระ",
			"ออกบิล",
			"ยกเลิกเมื่อ",
			"ผู้ยกเลิก",
			"เหตุผล",
			"ผู้ขาย",
			"เครื่อง"
		], ...voids.map((order) => [
			order.receiptLong,
			order.total,
			PAY_LABEL[order.paymentMethod],
			formatBeStamp(order.createdAt),
			order.voidedAt ? formatBeStamp(order.voidedAt) : "",
			order.voidedByName ?? "",
			order.voidReason ?? "",
			order.userName,
			order.terminalName
		])]);
		return;
	}
	downloadCsv(`onedaypos-sales-${from}-${to}.csv`, [[
		"ลำดับ",
		"วันที่",
		"เลขที่",
		"เงินสด",
		"โอน",
		"บัตร",
		"สถานะ",
		"ผู้ขาย"
	], ...bills.map((order, index) => [
		index + 1,
		formatBe(orderDay(order.createdAt)),
		order.receiptLong,
		order.status === "normal" && order.paymentMethod === "cash" ? order.total : "",
		order.status === "normal" && order.paymentMethod === "transfer" ? order.total : "",
		order.status === "normal" && order.paymentMethod === "credit" ? order.total : "",
		order.status === "void" ? "ยกเลิก" : "ปกติ",
		order.userName
	])]);
}
function ReportsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireSession, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsView, {}) }) });
}
//#endregion
export { ReportsPage as component };
