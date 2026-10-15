import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Field, Modal, PageHeader, SelectInput, SwitchRow, TextArea, TextInput } from "@/components/pos/ui";
import { ACTION_LABEL, baht, bangkokISODate, downloadCsv, downloadText, formatBeStamp, inRange, orderDay, roleLabel } from "@/lib/pos/format";
import { readImageFile } from "@/lib/pos/image";
import { movementSum, previewMenuImport } from "@/lib/pos/logic";
import { usePosStore, useSessionUser } from "@/lib/pos/store";
import type { ImportPreviewRow, Product, Role, User } from "@/lib/pos/types";

type Tab = "products" | "categories" | "users" | "settings" | "logs" | "data";

export function AdminView() {
  const user = useSessionUser();
  const [tab, setTab] = useState<Tab>("products");
  if (!user || user.role !== "admin") {
    return (
      <div className="rounded-xl bg-card p-6">
        <h1 className="text-xl text-brand">เฉพาะแอดมิน</h1>
        <p className="mt-2 text-sm text-muted">บัญชีผู้ขายเข้าเมนูนี้ไม่ได้</p>
      </div>
    );
  }
  return (
    <div>
      <PageHeader title="ระบบแอดมิน" hint="หมวดหมู่ เมนู ผู้ใช้ ตั้งค่า ประวัติ และข้อมูล" />
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {(
          [
            ["products", "เมนู"],
            ["categories", "หมวดหมู่"],
            ["users", "ผู้ใช้"],
            ["settings", "ตั้งค่า"],
            ["logs", "ประวัติ"],
            ["data", "ข้อมูล"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`min-h-11 shrink-0 rounded-lg px-4 text-sm ${tab === id ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "products" ? <ProductsTab /> : null}
      {tab === "categories" ? <CategoriesTab /> : null}
      {tab === "users" ? <UsersTab /> : null}
      {tab === "settings" ? <SettingsTab /> : null}
      {tab === "logs" ? <LogsTab /> : null}
      {tab === "data" ? <DataTab /> : null}
    </div>
  );
}

function ProductsTab() {
  const products = usePosStore((state) => state.products);
  const categories = usePosStore((state) => state.categories);
  const setProductActive = usePosStore((state) => state.setProductActive);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const list = products.filter((product) => {
    const q = query.trim().toLowerCase();
    return !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q);
  });
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาเมนู" className="max-w-xs" />
        <Button onClick={() => setEditing("new")}>เพิ่มเมนู</Button>
        <Button
          variant="sand"
          onClick={() =>
            downloadCsv("onedaypos-products.csv", [
              ["รหัสเมนู", "หมวดหมู่", "ชื่อเมนู", "ราคา", "นับสต๊อก", "คงเหลือ", "สถานะ"],
              ...products.map((product) => [
                product.sku,
                categories.find((category) => category.id === product.categoryId)?.name ?? "",
                product.name,
                product.price,
                product.trackStock ? "Y" : "N",
                product.stockQty,
                product.isActive ? "เปิด" : "ปิด",
              ]),
            ])
          }
        >
          Excel
        </Button>
      </div>
      <div className="grid gap-2">
        {list.map((product) => (
          <article key={product.id} className="flex items-center gap-3 rounded-xl border border-sand bg-card p-3">
            {product.image ? <img src={product.image} alt="" className="size-14 rounded-lg object-cover" /> : <div className="grid size-14 place-items-center rounded-lg bg-sand text-xs">ไม่มีรูป</div>}
            <div className="min-w-0 flex-1">
              <div className="truncate">
                {product.name} · {baht(product.price)}
              </div>
              <div className="text-xs text-muted">
                {product.sku} · {categories.find((category) => category.id === product.categoryId)?.name} · {product.trackStock ? `คงเหลือ ${product.stockQty}` : "ทำสด"} · {product.isActive ? "เปิดขาย" : "ปิด"}
              </div>
            </div>
            <Button variant="sand" onClick={() => setEditing(product)}>
              แก้
            </Button>
            <Button variant="ghost" onClick={() => setProductActive(product.id, !product.isActive)}>
              {product.isActive ? "ปิด" : "เปิด"}
            </Button>
          </article>
        ))}
      </div>
      {editing ? <ProductForm product={editing === "new" ? null : editing} onClose={() => setEditing(null)} /> : null}
    </div>
  );
}

function ProductForm({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const categories = usePosStore((state) => state.categories);
  const saveProduct = usePosStore((state) => state.saveProduct);
  const notify = usePosStore((state) => state.notify);
  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [trackStock, setTrackStock] = useState(product?.trackStock ?? true);
  const [stockQty, setStockQty] = useState(String(product?.stockQty ?? 0));
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [image, setImage] = useState<string | null>(product?.image ?? null);
  return (
    <Modal title={product ? "แก้ไขเมนู" : "เพิ่มเมนู"} onClose={onClose}>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const result = saveProduct({
            id: product?.id,
            name,
            sku,
            categoryId,
            price: Number(price),
            trackStock,
            stockQty: Number(stockQty),
            isActive,
            image,
          });
          if (result.ok) onClose();
        }}
      >
        <Field label="ชื่อเมนู">
          <TextInput value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="รหัสเมนู">
          <TextInput value={sku} onChange={(event) => setSku(event.target.value)} />
        </Field>
        <Field label="หมวดหมู่">
          <SelectInput value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="ราคา (บาท)">
          <TextInput inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} />
        </Field>
        <SwitchRow on={trackStock} label="นับสต๊อก" onClick={() => setTrackStock((value) => !value)} />
        {!product && trackStock ? (
          <Field label="สต๊อกเริ่มต้น">
            <TextInput inputMode="numeric" value={stockQty} onChange={(event) => setStockQty(event.target.value)} />
          </Field>
        ) : null}
        {product ? <p className="text-sm text-muted">ปรับจำนวนที่หน้าสต๊อก คงเหลือตอนนี้ {product.stockQty}</p> : null}
        <SwitchRow on={isActive} label="เปิดขาย" onClick={() => setIsActive((value) => !value)} />
        <Field label="รูปเมนู">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="block w-full text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void readImageFile(file)
                .then(setImage)
                .catch((error: Error) => notify(error.message));
            }}
          />
        </Field>
        {image ? <img src={image} alt="" className="h-28 w-28 rounded-lg object-cover" /> : null}
        {image ? (
          <Button variant="ghost" onClick={() => setImage(null)}>
            ลบรูป
          </Button>
        ) : null}
        <Button type="submit">บันทึก</Button>
      </form>
    </Modal>
  );
}

function CategoriesTab() {
  const categories = usePosStore((state) => state.categories);
  const saveCategory = usePosStore((state) => state.saveCategory);
  const moveCategory = usePosStore((state) => state.moveCategory);
  const setCategoryActive = usePosStore((state) => state.setCategoryActive);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <div className="grid gap-3">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (saveCategory({ name }).ok) setName("");
        }}
      >
        <TextInput value={name} onChange={(event) => setName(event.target.value)} placeholder="ชื่อหมวดใหม่" className="max-w-xs" />
        <Button type="submit">เพิ่มหมวด</Button>
        <Button
          variant="sand"
          onClick={() =>
            downloadCsv("onedaypos-categories.csv", [
              ["ชื่อ", "ลำดับ", "สถานะ"],
              ...sorted.map((category) => [category.name, category.sortOrder, category.isActive ? "เปิด" : "ปิด"]),
            ])
          }
        >
          Excel
        </Button>
      </form>
      {sorted.map((category, index) => (
        <article key={category.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-sand bg-card p-3">
          {editId === category.id ? (
            <TextInput value={editName} onChange={(event) => setEditName(event.target.value)} className="max-w-xs" />
          ) : (
            <div className="min-w-32 flex-1">
              {category.name}
              <span className="ml-2 text-xs text-muted">{category.isActive ? "เปิด" : "ปิด"}</span>
            </div>
          )}
          <button type="button" aria-label="ขึ้น" className="grid size-11 place-items-center rounded-lg bg-sand" disabled={index === 0} onClick={() => moveCategory(category.id, -1)}>
            <ChevronUp className="size-4" />
          </button>
          <button type="button" aria-label="ลง" className="grid size-11 place-items-center rounded-lg bg-sand" disabled={index === sorted.length - 1} onClick={() => moveCategory(category.id, 1)}>
            <ChevronDown className="size-4" />
          </button>
          {editId === category.id ? (
            <Button
              onClick={() => {
                if (saveCategory({ id: category.id, name: editName }).ok) setEditId(null);
              }}
            >
              บันทึก
            </Button>
          ) : (
            <Button
              variant="sand"
              onClick={() => {
                setEditId(category.id);
                setEditName(category.name);
              }}
            >
              แก้ชื่อ
            </Button>
          )}
          <Button variant="ghost" onClick={() => setCategoryActive(category.id, !category.isActive)}>
            {category.isActive ? "ปิด" : "เปิด"}
          </Button>
        </article>
      ))}
    </div>
  );
}

function UsersTab() {
  const users = usePosStore((state) => state.users);
  const [editing, setEditing] = useState<User | "new" | null>(null);
  return (
    <div>
      <div className="mb-3 flex gap-2">
        <Button onClick={() => setEditing("new")}>เพิ่มผู้ใช้</Button>
        <Button
          variant="sand"
          onClick={() =>
            downloadCsv("onedaypos-users.csv", [
              ["ชื่อผู้ใช้", "ชื่อ", "สิทธิ์", "สถานะ"],
              ...users.map((user) => [user.username, user.name, roleLabel(user.role), user.isActive ? "เปิด" : "ปิด"]),
            ])
          }
        >
          Excel
        </Button>
      </div>
      <div className="grid gap-2">
        {users.map((user) => (
          <article key={user.id} className="flex items-center justify-between gap-2 rounded-xl border border-sand bg-card p-3">
            <div>
              <div>
                {user.name} · {user.username}
              </div>
              <div className="text-xs text-muted">
                {roleLabel(user.role)} · {user.isActive ? "ใช้งาน" : "ปิดแล้ว"}
              </div>
            </div>
            <Button variant="sand" onClick={() => setEditing(user)}>
              แก้
            </Button>
          </article>
        ))}
      </div>
      {editing ? <UserForm user={editing === "new" ? null : editing} onClose={() => setEditing(null)} /> : null}
    </div>
  );
}

function UserForm({ user, onClose }: { user: User | null; onClose: () => void }) {
  const saveUser = usePosStore((state) => state.saveUser);
  const [username, setUsername] = useState(user?.username ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(user?.role ?? "seller");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  return (
    <Modal title={user ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"} onClose={onClose}>
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const result = saveUser({ id: user?.id, username, name, password, role, isActive });
          if (result.ok) onClose();
        }}
      >
        <Field label="ชื่อผู้ใช้">
          <TextInput value={username} onChange={(event) => setUsername(event.target.value)} />
        </Field>
        <Field label="ชื่อที่แสดง">
          <TextInput value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label={user ? "รหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)" : "รหัสผ่าน"}>
          <TextInput type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>
        <Field label="สิทธิ์">
          <SelectInput value={role} onChange={(event) => setRole(event.target.value as Role)}>
            <option value="seller">ผู้ขาย</option>
            <option value="admin">แอดมิน</option>
          </SelectInput>
        </Field>
        <SwitchRow on={isActive} label="เปิดใช้งาน" onClick={() => setIsActive((value) => !value)} />
        <p className="text-sm text-muted">ไม่ลบบัญชีที่มีประวัติ ใช้ปิดใช้งานแทน</p>
        <Button type="submit">บันทึก</Button>
      </form>
    </Modal>
  );
}

function SettingsTab() {
  const settings = usePosStore((state) => state.settings);
  const updateSettings = usePosStore((state) => state.updateSettings);
  const notify = usePosStore((state) => state.notify);
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [companyAddress, setCompanyAddress] = useState(settings.companyAddress);
  const [companyPhone, setCompanyPhone] = useState(settings.companyPhone);
  const [threshold, setThreshold] = useState(String(settings.lowStockThreshold));
  return (
    <form
      className="grid max-w-xl gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        updateSettings({
          companyName: companyName.trim(),
          companyAddress: companyAddress.trim(),
          companyPhone: companyPhone.trim(),
          lowStockThreshold: Number(threshold),
        });
      }}
    >
      <Field label="ชื่อบริษัทบนใบเสร็จ">
        <TextInput value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
      </Field>
      <Field label="ที่อยู่">
        <TextArea rows={3} value={companyAddress} onChange={(event) => setCompanyAddress(event.target.value)} />
      </Field>
      <Field label="โทรศัพท์">
        <TextInput value={companyPhone} onChange={(event) => setCompanyPhone(event.target.value)} />
      </Field>
      <Field label="แจ้งใกล้หมดเมื่อต่ำกว่า (ชิ้น)">
        <TextInput inputMode="numeric" value={threshold} onChange={(event) => setThreshold(event.target.value)} />
      </Field>
      <SwitchRow on={settings.showImages} label="แสดงภาพเมนูทุกเครื่อง" onClick={() => updateSettings({ showImages: !settings.showImages })} />
      <SwitchRow on={settings.sellerCanVoidOwn} label="ผู้ขายยกเลิกบิลของตนเองได้ในวันเดียวกัน" onClick={() => updateSettings({ sellerCanVoidOwn: !settings.sellerCanVoidOwn })} />
      <SwitchRow on={settings.allowTransfer} label="รับชำระโอนเงิน" onClick={() => updateSettings({ allowTransfer: !settings.allowTransfer })} />
      <SwitchRow on={settings.allowCredit} label="รับชำระบัตรเครดิต" onClick={() => updateSettings({ allowCredit: !settings.allowCredit })} />
      <Field label="โลโก้หน้าเข้าสู่ระบบ">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="block w-full text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            void readImageFile(file, 480)
              .then((logo) => updateSettings({ logoDataUrl: logo }))
              .catch((error: Error) => notify(error.message));
          }}
        />
      </Field>
      {settings.logoDataUrl ? (
        <div>
          <img src={settings.logoDataUrl} alt="ตัวอย่างโลโก้" className="h-20 w-auto rounded-lg bg-cream object-contain" />
          <Button variant="ghost" className="mt-2" onClick={() => updateSettings({ logoDataUrl: null })}>
            ลบโลโก้
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted">ยังไม่มีโลโก้ หน้าเข้าสู่ระบบจะแสดงคำว่า OneDayPOS</p>
      )}
      <Button type="submit">บันทึกข้อมูลร้าน</Button>
    </form>
  );
}

function LogsTab() {
  const logs = usePosStore((state) => state.logs);
  const users = usePosStore((state) => state.users);
  const today = bangkokISODate();
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [userId, setUserId] = useState("all");
  const [level, setLevel] = useState("all");
  const [action, setAction] = useState("all");
  const [query, setQuery] = useState("");
  const actions = useMemo(() => [...new Set(logs.map((log) => log.actionCode))], [logs]);
  const rows = logs.filter((log) => {
    const day = orderDay(log.createdAt);
    if (!inRange(day, from, to)) return false;
    if (userId !== "all" && log.userId !== userId) return false;
    if (level !== "all" && log.level !== level) return false;
    if (action !== "all" && log.actionCode !== action) return false;
    if (query.trim() && !log.messageTh.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });
  return (
    <div>
      <div className="mb-3 grid gap-2 sm:grid-cols-3">
        <Field label="จาก">
          <TextInput type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </Field>
        <Field label="ถึง">
          <TextInput type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </Field>
        <Field label="ค้นหา">
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)} />
        </Field>
        <Field label="ผู้ใช้">
          <SelectInput value={userId} onChange={(event) => setUserId(event.target.value)}>
            <option value="all">ทั้งหมด</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="ระดับ">
          <SelectInput value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="all">ทั้งหมด</option>
            <option value="info">ปกติ</option>
            <option value="warning">เตือน</option>
            <option value="error">ผิดพลาด</option>
          </SelectInput>
        </Field>
        <Field label="ประเภท">
          <SelectInput value={action} onChange={(event) => setAction(event.target.value)}>
            <option value="all">ทั้งหมด</option>
            {actions.map((code) => (
              <option key={code} value={code}>
                {ACTION_LABEL[code] ?? code}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>
      <Button
        variant="sand"
        className="mb-3"
        onClick={() =>
          downloadCsv(`onedaypos-logs-${from}.csv`, [
            ["เวลา", "ระดับ", "ประเภท", "ผู้ใช้", "เครื่อง", "ข้อความ"],
            ...rows.map((log) => [formatBeStamp(log.createdAt), log.level, ACTION_LABEL[log.actionCode] ?? log.actionCode, log.userName ?? "", log.terminalName ?? "", log.messageTh]),
          ])
        }
      >
        Excel
      </Button>
      <div className="grid gap-2">
        {rows.length === 0 ? <p className="rounded-xl bg-card p-6 text-center text-muted">ไม่มีรายการ</p> : null}
        {rows.map((log) => (
          <article key={log.id} className="rounded-xl border border-sand bg-card p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded-md px-2 py-1 ${log.level === "info" ? "bg-sky" : log.level === "warning" ? "bg-sand" : "bg-brand text-brand-ink"}`}>
                {log.level === "info" ? "ปกติ" : log.level === "warning" ? "เตือน" : "ผิดพลาด"}
              </span>
              <span>{ACTION_LABEL[log.actionCode] ?? log.actionCode}</span>
              <span className="text-muted">{formatBeStamp(log.createdAt)}</span>
            </div>
            <p className="mt-1">{log.messageTh}</p>
          </article>
        ))}
      </div>
    </div>
  );
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
  const [confirmRestore, setConfirmRestore] = useState("");
  const [pending, setPending] = useState<unknown>(null);
  const [resetText, setResetText] = useState("");
  const [preview, setPreview] = useState<ImportPreviewRow[] | null>(null);
  const mismatches = products
    .filter((product) => product.trackStock)
    .map((product) => ({ product, sum: movementSum(movements, product.id) }))
    .filter((row) => row.sum !== row.product.stockQty);

  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-sand bg-card p-4">
        <h2 className="text-brand">สำรองและกู้คืน</h2>
        <p className="mt-1 text-sm text-muted">ไฟล์ JSON ใช้ย้ายข้อมูลระหว่างเครื่องขาย ก่อนกู้คืนระบบจะไม่ลบไฟล์เดิมจนกว่าจะยืนยัน</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              const json = exportSnapshot();
              downloadText(`onedaypos-backup-${bangkokISODate()}.json`, json, "application/json");
            }}
          >
            ดาวน์โหลดสำรอง
          </Button>
        </div>
        <Field label="ไฟล์สำรอง">
          <input
            type="file"
            accept="application/json,.json"
            className="mt-2 block w-full text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void file.text().then((text) => {
                try {
                  setPending(JSON.parse(text));
                  setConfirmRestore("");
                } catch {
                  notify("อ่านไฟล์ไม่สำเร็จ");
                }
              });
            }}
          />
        </Field>
        {pending ? (
          <div className="mt-3 grid gap-2">
            <Field label='พิมพ์คำว่า กู้คืน เพื่อยืนยัน'>
              <TextInput value={confirmRestore} onChange={(event) => setConfirmRestore(event.target.value)} />
            </Field>
            <Button
              disabled={confirmRestore.trim() !== "กู้คืน"}
              onClick={() => {
                if (restoreSnapshot(pending).ok) {
                  setPending(null);
                  setConfirmRestore("");
                }
              }}
            >
              กู้คืนข้อมูล
            </Button>
          </div>
        ) : null}
      </section>
      <section className="rounded-xl border border-sand bg-card p-4">
        <h2 className="text-brand">ตรวจสต๊อกกับประวัติ</h2>
        {mismatches.length === 0 ? <p className="mt-2 text-sm">ยอดคงเหลือตรงกับผลรวมความเคลื่อนไหว</p> : null}
        {mismatches.map((row) => (
          <p key={row.product.id} className="mt-1 text-sm text-brand">
            {row.product.name}: หน้าจอ {row.product.stockQty} / ประวัติ {row.sum}
          </p>
        ))}
        <Button className="mt-3" variant="sand" onClick={() => recalcStock()}>
          คำนวณสต๊อกใหม่จากประวัติ
        </Button>
      </section>
      <section className="rounded-xl border border-sand bg-card p-4">
        <h2 className="text-brand">นำเข้าเมนู</h2>
        <p className="mt-1 text-sm text-muted">คอลัมน์: รหัสเมนู, หมวดหมู่, ชื่อเมนู, ราคา, นับสต๊อก (Y/N), สต๊อกเริ่มต้น, สถานะ (เปิด/ปิด)</p>
        <Button
          variant="sand"
          className="mt-2"
          onClick={() =>
            downloadCsv("onedaypos-menu-sample.csv", [
              ["รหัสเมนู", "หมวดหมู่", "ชื่อเมนู", "ราคา", "นับสต๊อก", "สต๊อกเริ่มต้น", "สถานะ"],
              ["R99", "ข้าว", "ข้าวผัดกุ้ง", 70, "Y", 10, "เปิด"],
            ])
          }
        >
          ดาวน์โหลดไฟล์ตัวอย่าง
        </Button>
        <input
          type="file"
          accept=".csv,text/csv"
          className="mt-3 block w-full text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            void file.text().then((text) => setPreview(previewMenuImport(text)));
          }}
        />
        {preview ? (
          <div className="mt-3">
            <p className="text-sm">
              ผ่าน {preview.filter((row) => !row.error).length} · ไม่ผ่าน {preview.filter((row) => row.error).length}
            </p>
            <div className="mt-2 grid max-h-64 gap-1 overflow-auto text-sm">
              {preview.map((row) => (
                <div key={`${row.line}-${row.sku}`} className={row.error ? "text-brand" : ""}>
                  แถว {row.line}: {row.sku} {row.name} {row.error ? `— ${row.error}` : "ผ่าน"}
                </div>
              ))}
            </div>
            <Button
              className="mt-3"
              disabled={preview.some((row) => row.error) || preview.length === 0}
              onClick={() => {
                if (applyImport(preview).ok) setPreview(null);
              }}
            >
              ยืนยันนำเข้า
            </Button>
          </div>
        ) : null}
      </section>
      <section className="rounded-xl border border-sand bg-card p-4">
        <h2 className="text-brand">กลับไปข้อมูลตัวอย่าง</h2>
        <p className="mt-1 text-sm text-muted">ล้างบิลและสต๊อกที่ขายไป แล้วโหลดเมนูตัวอย่างใหม่ พิมพ์ ล้างข้อมูล</p>
        <TextInput className="mt-2 max-w-xs" value={resetText} onChange={(event) => setResetText(event.target.value)} />
        <Button
          className="mt-2"
          disabled={resetText.trim() !== "ล้างข้อมูล"}
          onClick={() => {
            resetDemo();
            setResetText("");
          }}
        >
          ล้างและเริ่มใหม่
        </Button>
      </section>
    </div>
  );
}
