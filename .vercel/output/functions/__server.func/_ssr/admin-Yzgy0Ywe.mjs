import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as ChevronUp, f as ChevronDown } from "../_libs/lucide-react.mjs";
import { A as TextArea, C as roleLabel, D as PageHeader, E as Modal, O as SelectInput, S as orderDay, T as Field, _ as downloadText, a as movementSum, g as downloadCsv, i as useSessionUser, j as TextInput, k as SwitchRow, l as ACTION_LABEL, m as bangkokISODate, n as RequireSession, o as previewMenuImport, p as baht, r as usePosStore, w as Button, x as inRange, y as formatBeStamp } from "./router-CNKdKW2n.mjs";
import { t as Shell } from "./shell-c-avJ193.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Yzgy0Ywe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function readImageFile(file, max = 640) {
	if (file.type === "image/svg+xml") {
		if (file.size > 524288) throw new Error("ไฟล์ SVG ใหญ่เกินไป");
		const text = await file.text();
		if (/script|on\w+\s*=|javascript:|foreignObject/i.test(text)) throw new Error("ไฟล์ SVG ไม่ปลอดภัย");
		return `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
	}
	if (![
		"image/jpeg",
		"image/png",
		"image/webp"
	].includes(file.type)) throw new Error("รองรับ JPG, PNG, WebP หรือ SVG");
	if (file.size > 2097152) throw new Error("ไฟล์ใหญ่เกิน 2 MB");
	const url = URL.createObjectURL(file);
	try {
		const img = await new Promise((resolve, reject) => {
			const el = new Image();
			el.onload = () => resolve(el);
			el.onerror = () => reject(/* @__PURE__ */ new Error("อ่านรูปไม่สำเร็จ"));
			el.src = url;
		});
		const scale = Math.min(1, max / Math.max(img.width, img.height));
		const canvas = document.createElement("canvas");
		canvas.width = Math.max(1, Math.round(img.width * scale));
		canvas.height = Math.max(1, Math.round(img.height * scale));
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("อ่านรูปไม่สำเร็จ");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg", .72);
	} finally {
		URL.revokeObjectURL(url);
	}
}
function AdminView() {
	const user = useSessionUser();
	const [tab, setTab] = (0, import_react.useState)("products");
	if (!user || user.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl text-brand",
			children: "เฉพาะแอดมิน"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "บัญชีผู้ขายเข้าเมนูนี้ไม่ได้"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "ระบบแอดมิน",
			hint: "หมวดหมู่ เมนู ผู้ใช้ ตั้งค่า ประวัติ และข้อมูล"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex gap-2 overflow-x-auto",
			children: [
				["products", "เมนู"],
				["categories", "หมวดหมู่"],
				["users", "ผู้ใช้"],
				["settings", "ตั้งค่า"],
				["logs", "ประวัติ"],
				["data", "ข้อมูล"]
			].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(id),
				className: `min-h-11 shrink-0 rounded-lg px-4 text-sm ${tab === id ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`,
				children: label
			}, id))
		}),
		tab === "products" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsTab, {}) : null,
		tab === "categories" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesTab, {}) : null,
		tab === "users" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersTab, {}) : null,
		tab === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsTab, {}) : null,
		tab === "logs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogsTab, {}) : null,
		tab === "data" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTab, {}) : null
	] });
}
function ProductsTab() {
	const products = usePosStore((state) => state.products);
	const categories = usePosStore((state) => state.categories);
	const setProductActive = usePosStore((state) => state.setProductActive);
	const [query, setQuery] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const list = products.filter((product) => {
		const q = query.trim().toLowerCase();
		return !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "ค้นหาเมนู",
					className: "max-w-xs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setEditing("new"),
					children: "เพิ่มเมนู"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "sand",
					onClick: () => downloadCsv("onedaypos-products.csv", [[
						"รหัสเมนู",
						"หมวดหมู่",
						"ชื่อเมนู",
						"ราคา",
						"นับสต๊อก",
						"คงเหลือ",
						"สถานะ"
					], ...products.map((product) => [
						product.sku,
						categories.find((category) => category.id === product.categoryId)?.name ?? "",
						product.name,
						product.price,
						product.trackStock ? "Y" : "N",
						product.stockQty,
						product.isActive ? "เปิด" : "ปิด"
					])]),
					children: "Excel"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: list.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex items-center gap-3 rounded-xl border border-sand bg-card p-3",
				children: [
					product.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: "",
						className: "size-14 rounded-lg object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-14 place-items-center rounded-lg bg-sand text-xs",
						children: "ไม่มีรูป"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "truncate",
							children: [
								product.name,
								" · ",
								baht(product.price)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted",
							children: [
								product.sku,
								" · ",
								categories.find((category) => category.id === product.categoryId)?.name,
								" · ",
								product.trackStock ? `คงเหลือ ${product.stockQty}` : "ทำสด",
								" · ",
								product.isActive ? "เปิดขาย" : "ปิด"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "sand",
						onClick: () => setEditing(product),
						children: "แก้"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setProductActive(product.id, !product.isActive),
						children: product.isActive ? "ปิด" : "เปิด"
					})
				]
			}, product.id))
		}),
		editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
			product: editing === "new" ? null : editing,
			onClose: () => setEditing(null)
		}) : null
	] });
}
function ProductForm({ product, onClose }) {
	const categories = usePosStore((state) => state.categories);
	const saveProduct = usePosStore((state) => state.saveProduct);
	const notify = usePosStore((state) => state.notify);
	const [name, setName] = (0, import_react.useState)(product?.name ?? "");
	const [sku, setSku] = (0, import_react.useState)(product?.sku ?? "");
	const [categoryId, setCategoryId] = (0, import_react.useState)(product?.categoryId ?? categories[0]?.id ?? "");
	const [price, setPrice] = (0, import_react.useState)(String(product?.price ?? ""));
	const [trackStock, setTrackStock] = (0, import_react.useState)(product?.trackStock ?? true);
	const [stockQty, setStockQty] = (0, import_react.useState)(String(product?.stockQty ?? 0));
	const [isActive, setIsActive] = (0, import_react.useState)(product?.isActive ?? true);
	const [image, setImage] = (0, import_react.useState)(product?.image ?? null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: product ? "แก้ไขเมนู" : "เพิ่มเมนู",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3",
			onSubmit: (event) => {
				event.preventDefault();
				if (saveProduct({
					id: product?.id,
					name,
					sku,
					categoryId,
					price: Number(price),
					trackStock,
					stockQty: Number(stockQty),
					isActive,
					image
				}).ok) onClose();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ชื่อเมนู",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: name,
						onChange: (event) => setName(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "รหัสเมนู",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: sku,
						onChange: (event) => setSku(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "หมวดหมู่",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectInput, {
						value: categoryId,
						onChange: (event) => setCategoryId(event.target.value),
						children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: category.id,
							children: category.name
						}, category.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ราคา (บาท)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						inputMode: "decimal",
						value: price,
						onChange: (event) => setPrice(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchRow, {
					on: trackStock,
					label: "นับสต๊อก",
					onClick: () => setTrackStock((value) => !value)
				}),
				!product && trackStock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "สต๊อกเริ่มต้น",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						inputMode: "numeric",
						value: stockQty,
						onChange: (event) => setStockQty(event.target.value)
					})
				}) : null,
				product ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: ["ปรับจำนวนที่หน้าสต๊อก คงเหลือตอนนี้ ", product.stockQty]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchRow, {
					on: isActive,
					label: "เปิดขาย",
					onClick: () => setIsActive((value) => !value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "รูปเมนู",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/jpeg,image/png,image/webp,image/svg+xml",
						className: "block w-full text-sm",
						onChange: (event) => {
							const file = event.target.files?.[0];
							if (!file) return;
							readImageFile(file).then(setImage).catch((error) => notify(error.message));
						}
					})
				}),
				image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: "",
					className: "h-28 w-28 rounded-lg object-cover"
				}) : null,
				image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setImage(null),
					children: "ลบรูป"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "บันทึก"
				})
			]
		})
	});
}
function CategoriesTab() {
	const categories = usePosStore((state) => state.categories);
	const saveCategory = usePosStore((state) => state.saveCategory);
	const moveCategory = usePosStore((state) => state.moveCategory);
	const setCategoryActive = usePosStore((state) => state.setCategoryActive);
	const [name, setName] = (0, import_react.useState)("");
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-wrap gap-2",
			onSubmit: (event) => {
				event.preventDefault();
				if (saveCategory({ name }).ok) setName("");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: name,
					onChange: (event) => setName(event.target.value),
					placeholder: "ชื่อหมวดใหม่",
					className: "max-w-xs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "เพิ่มหมวด"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "sand",
					onClick: () => downloadCsv("onedaypos-categories.csv", [[
						"ชื่อ",
						"ลำดับ",
						"สถานะ"
					], ...sorted.map((category) => [
						category.name,
						category.sortOrder,
						category.isActive ? "เปิด" : "ปิด"
					])]),
					children: "Excel"
				})
			]
		}), sorted.map((category, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "flex flex-wrap items-center gap-2 rounded-xl border border-sand bg-card p-3",
			children: [
				editId === category.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: editName,
					onChange: (event) => setEditName(event.target.value),
					className: "max-w-xs"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-32 flex-1",
					children: [category.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-xs text-muted",
						children: category.isActive ? "เปิด" : "ปิด"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "ขึ้น",
					className: "grid size-11 place-items-center rounded-lg bg-sand",
					disabled: index === 0,
					onClick: () => moveCategory(category.id, -1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "ลง",
					className: "grid size-11 place-items-center rounded-lg bg-sand",
					disabled: index === sorted.length - 1,
					onClick: () => moveCategory(category.id, 1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
				}),
				editId === category.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						if (saveCategory({
							id: category.id,
							name: editName
						}).ok) setEditId(null);
					},
					children: "บันทึก"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "sand",
					onClick: () => {
						setEditId(category.id);
						setEditName(category.name);
					},
					children: "แก้ชื่อ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setCategoryActive(category.id, !category.isActive),
					children: category.isActive ? "ปิด" : "เปิด"
				})
			]
		}, category.id))]
	});
}
function UsersTab() {
	const users = usePosStore((state) => state.users);
	const [editing, setEditing] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setEditing("new"),
				children: "เพิ่มผู้ใช้"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "sand",
				onClick: () => downloadCsv("onedaypos-users.csv", [[
					"ชื่อผู้ใช้",
					"ชื่อ",
					"สิทธิ์",
					"สถานะ"
				], ...users.map((user) => [
					user.username,
					user.name,
					roleLabel(user.role),
					user.isActive ? "เปิด" : "ปิด"
				])]),
				children: "Excel"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: users.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex items-center justify-between gap-2 rounded-xl border border-sand bg-card p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					user.name,
					" · ",
					user.username
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted",
					children: [
						roleLabel(user.role),
						" · ",
						user.isActive ? "ใช้งาน" : "ปิดแล้ว"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "sand",
					onClick: () => setEditing(user),
					children: "แก้"
				})]
			}, user.id))
		}),
		editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserForm, {
			user: editing === "new" ? null : editing,
			onClose: () => setEditing(null)
		}) : null
	] });
}
function UserForm({ user, onClose }) {
	const saveUser = usePosStore((state) => state.saveUser);
	const [username, setUsername] = (0, import_react.useState)(user?.username ?? "");
	const [name, setName] = (0, import_react.useState)(user?.name ?? "");
	const [password, setPassword] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)(user?.role ?? "seller");
	const [isActive, setIsActive] = (0, import_react.useState)(user?.isActive ?? true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: user ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3",
			onSubmit: (event) => {
				event.preventDefault();
				if (saveUser({
					id: user?.id,
					username,
					name,
					password,
					role,
					isActive
				}).ok) onClose();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ชื่อผู้ใช้",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: username,
						onChange: (event) => setUsername(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ชื่อที่แสดง",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: name,
						onChange: (event) => setName(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: user ? "รหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)" : "รหัสผ่าน",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "password",
						value: password,
						onChange: (event) => setPassword(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "สิทธิ์",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
						value: role,
						onChange: (event) => setRole(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "seller",
							children: "ผู้ขาย"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "admin",
							children: "แอดมิน"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchRow, {
					on: isActive,
					label: "เปิดใช้งาน",
					onClick: () => setIsActive((value) => !value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "ไม่ลบบัญชีที่มีประวัติ ใช้ปิดใช้งานแทน"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "บันทึก"
				})
			]
		})
	});
}
function SettingsTab() {
	const settings = usePosStore((state) => state.settings);
	const updateSettings = usePosStore((state) => state.updateSettings);
	const notify = usePosStore((state) => state.notify);
	const [companyName, setCompanyName] = (0, import_react.useState)(settings.companyName);
	const [companyAddress, setCompanyAddress] = (0, import_react.useState)(settings.companyAddress);
	const [companyPhone, setCompanyPhone] = (0, import_react.useState)(settings.companyPhone);
	const [threshold, setThreshold] = (0, import_react.useState)(String(settings.lowStockThreshold));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid max-w-xl gap-3",
		onSubmit: (event) => {
			event.preventDefault();
			updateSettings({
				companyName: companyName.trim(),
				companyAddress: companyAddress.trim(),
				companyPhone: companyPhone.trim(),
				lowStockThreshold: Number(threshold)
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "ชื่อบริษัทบนใบเสร็จ",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: companyName,
					onChange: (event) => setCompanyName(event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "ที่อยู่",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
					rows: 3,
					value: companyAddress,
					onChange: (event) => setCompanyAddress(event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "โทรศัพท์",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: companyPhone,
					onChange: (event) => setCompanyPhone(event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "แจ้งใกล้หมดเมื่อต่ำกว่า (ชิ้น)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					inputMode: "numeric",
					value: threshold,
					onChange: (event) => setThreshold(event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchRow, {
				on: settings.showImages,
				label: "แสดงภาพเมนูทุกเครื่อง",
				onClick: () => updateSettings({ showImages: !settings.showImages })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchRow, {
				on: settings.sellerCanVoidOwn,
				label: "ผู้ขายยกเลิกบิลของตนเองได้ในวันเดียวกัน",
				onClick: () => updateSettings({ sellerCanVoidOwn: !settings.sellerCanVoidOwn })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchRow, {
				on: settings.allowTransfer,
				label: "รับชำระโอนเงิน",
				onClick: () => updateSettings({ allowTransfer: !settings.allowTransfer })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchRow, {
				on: settings.allowCredit,
				label: "รับชำระบัตรเครดิต",
				onClick: () => updateSettings({ allowCredit: !settings.allowCredit })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "โลโก้หน้าเข้าสู่ระบบ",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "image/jpeg,image/png,image/webp,image/svg+xml",
					className: "block w-full text-sm",
					onChange: (event) => {
						const file = event.target.files?.[0];
						if (!file) return;
						readImageFile(file, 480).then((logo) => updateSettings({ logoDataUrl: logo })).catch((error) => notify(error.message));
					}
				})
			}),
			settings.logoDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: settings.logoDataUrl,
				alt: "ตัวอย่างโลโก้",
				className: "h-20 w-auto rounded-lg bg-cream object-contain"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "mt-2",
				onClick: () => updateSettings({ logoDataUrl: null }),
				children: "ลบโลโก้"
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "ยังไม่มีโลโก้ หน้าเข้าสู่ระบบจะแสดงคำว่า OneDayPOS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "บันทึกข้อมูลร้าน"
			})
		]
	});
}
function LogsTab() {
	const logs = usePosStore((state) => state.logs);
	const users = usePosStore((state) => state.users);
	const today = bangkokISODate();
	const [from, setFrom] = (0, import_react.useState)(today);
	const [to, setTo] = (0, import_react.useState)(today);
	const [userId, setUserId] = (0, import_react.useState)("all");
	const [level, setLevel] = (0, import_react.useState)("all");
	const [action, setAction] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const actions = (0, import_react.useMemo)(() => [...new Set(logs.map((log) => log.actionCode))], [logs]);
	const rows = logs.filter((log) => {
		const day = orderDay(log.createdAt);
		if (!inRange(day, from, to)) return false;
		if (userId !== "all" && log.userId !== userId) return false;
		if (level !== "all" && log.level !== level) return false;
		if (action !== "all" && log.actionCode !== action) return false;
		if (query.trim() && !log.messageTh.toLowerCase().includes(query.trim().toLowerCase())) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 grid gap-2 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "จาก",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "date",
						value: from,
						onChange: (event) => setFrom(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ถึง",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "date",
						value: to,
						onChange: (event) => setTo(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ค้นหา",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: query,
						onChange: (event) => setQuery(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ผู้ใช้",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
						value: userId,
						onChange: (event) => setUserId(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "ทั้งหมด"
						}), users.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: user.id,
							children: user.name
						}, user.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ระดับ",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
						value: level,
						onChange: (event) => setLevel(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "ทั้งหมด"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "info",
								children: "ปกติ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "warning",
								children: "เตือน"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "error",
								children: "ผิดพลาด"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ประเภท",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectInput, {
						value: action,
						onChange: (event) => setAction(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "ทั้งหมด"
						}), actions.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: code,
							children: ACTION_LABEL[code] ?? code
						}, code))]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "sand",
			className: "mb-3",
			onClick: () => downloadCsv(`onedaypos-logs-${from}.csv`, [[
				"เวลา",
				"ระดับ",
				"ประเภท",
				"ผู้ใช้",
				"เครื่อง",
				"ข้อความ"
			], ...rows.map((log) => [
				formatBeStamp(log.createdAt),
				log.level,
				ACTION_LABEL[log.actionCode] ?? log.actionCode,
				log.userName ?? "",
				log.terminalName ?? "",
				log.messageTh
			])]),
			children: "Excel"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-2",
			children: [rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-card p-6 text-center text-muted",
				children: "ไม่มีรายการ"
			}) : null, rows.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-sand bg-card p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-md px-2 py-1 ${log.level === "info" ? "bg-sky" : log.level === "warning" ? "bg-sand" : "bg-brand text-brand-ink"}`,
							children: log.level === "info" ? "ปกติ" : log.level === "warning" ? "เตือน" : "ผิดพลาด"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ACTION_LABEL[log.actionCode] ?? log.actionCode }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: formatBeStamp(log.createdAt)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1",
					children: log.messageTh
				})]
			}, log.id))]
		})
	] });
}
function DataTab() {
	const products = usePosStore((state) => state.products);
	const movements = usePosStore((state) => state.movements);
	const exportSnapshot = usePosStore((state) => state.exportSnapshot);
	const restoreSnapshot = usePosStore((state) => state.restoreSnapshot);
	const recalcStock = usePosStore((state) => state.recalcStock);
	const resetDemo = usePosStore((state) => state.resetDemo);
	const applyImport = usePosStore((state) => state.applyImport);
	const notify = usePosStore((state) => state.notify);
	const [confirmRestore, setConfirmRestore] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(null);
	const [resetText, setResetText] = (0, import_react.useState)("");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const mismatches = products.filter((product) => product.trackStock).map((product) => ({
		product,
		sum: movementSum(movements, product.id)
	})).filter((row) => row.sum !== row.product.stockQty);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-sand bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-brand",
						children: "สำรองและกู้คืน"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "ไฟล์ JSON ใช้ย้ายข้อมูลระหว่างเครื่องขาย ก่อนกู้คืนระบบจะไม่ลบไฟล์เดิมจนกว่าจะยืนยัน"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								const json = exportSnapshot();
								downloadText(`onedaypos-backup-${bangkokISODate()}.json`, json, "application/json");
							},
							children: "ดาวน์โหลดสำรอง"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "ไฟล์สำรอง",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "application/json,.json",
							className: "mt-2 block w-full text-sm",
							onChange: (event) => {
								const file = event.target.files?.[0];
								if (!file) return;
								file.text().then((text) => {
									try {
										setPending(JSON.parse(text));
										setConfirmRestore("");
									} catch {
										notify("อ่านไฟล์ไม่สำเร็จ");
									}
								});
							}
						})
					}),
					pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "พิมพ์คำว่า กู้คืน เพื่อยืนยัน",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: confirmRestore,
								onChange: (event) => setConfirmRestore(event.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: confirmRestore.trim() !== "กู้คืน",
							onClick: () => {
								if (restoreSnapshot(pending).ok) {
									setPending(null);
									setConfirmRestore("");
								}
							},
							children: "กู้คืนข้อมูล"
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-sand bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-brand",
						children: "ตรวจสต๊อกกับประวัติ"
					}),
					mismatches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: "ยอดคงเหลือตรงกับผลรวมความเคลื่อนไหว"
					}) : null,
					mismatches.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-brand",
						children: [
							row.product.name,
							": หน้าจอ ",
							row.product.stockQty,
							" / ประวัติ ",
							row.sum
						]
					}, row.product.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "sand",
						onClick: () => recalcStock(),
						children: "คำนวณสต๊อกใหม่จากประวัติ"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-sand bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-brand",
						children: "นำเข้าเมนู"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "คอลัมน์: รหัสเมนู, หมวดหมู่, ชื่อเมนู, ราคา, นับสต๊อก (Y/N), สต๊อกเริ่มต้น, สถานะ (เปิด/ปิด)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "sand",
						className: "mt-2",
						onClick: () => downloadCsv("onedaypos-menu-sample.csv", [[
							"รหัสเมนู",
							"หมวดหมู่",
							"ชื่อเมนู",
							"ราคา",
							"นับสต๊อก",
							"สต๊อกเริ่มต้น",
							"สถานะ"
						], [
							"R99",
							"ข้าว",
							"ข้าวผัดกุ้ง",
							70,
							"Y",
							10,
							"เปิด"
						]]),
						children: "ดาวน์โหลดไฟล์ตัวอย่าง"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: ".csv,text/csv",
						className: "mt-3 block w-full text-sm",
						onChange: (event) => {
							const file = event.target.files?.[0];
							if (!file) return;
							file.text().then((text) => setPreview(previewMenuImport(text)));
						}
					}),
					preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm",
								children: [
									"ผ่าน ",
									preview.filter((row) => !row.error).length,
									" · ไม่ผ่าน ",
									preview.filter((row) => row.error).length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 grid max-h-64 gap-1 overflow-auto text-sm",
								children: preview.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: row.error ? "text-brand" : "",
									children: [
										"แถว ",
										row.line,
										": ",
										row.sku,
										" ",
										row.name,
										" ",
										row.error ? `— ${row.error}` : "ผ่าน"
									]
								}, `${row.line}-${row.sku}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-3",
								disabled: preview.some((row) => row.error) || preview.length === 0,
								onClick: () => {
									if (applyImport(preview).ok) setPreview(null);
								},
								children: "ยืนยันนำเข้า"
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-sand bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-brand",
						children: "กลับไปข้อมูลตัวอย่าง"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "ล้างบิลและสต๊อกที่ขายไป แล้วโหลดเมนูตัวอย่างใหม่ พิมพ์ ล้างข้อมูล"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						className: "mt-2 max-w-xs",
						value: resetText,
						onChange: (event) => setResetText(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-2",
						disabled: resetText.trim() !== "ล้างข้อมูล",
						onClick: () => {
							resetDemo();
							setResetText("");
						},
						children: "ล้างและเริ่มใหม่"
					})
				]
			})
		]
	});
}
function AdminPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireSession, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminView, {}) }) });
}
//#endregion
export { AdminPage as component };
