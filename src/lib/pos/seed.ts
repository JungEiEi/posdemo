import { addDays, bangkokISODate, bangkokYear, uid } from "./format";
import type { Category, Product, Settings, Snapshot, StockMovement, User } from "./types";

const settings: Settings = {
  companyName: "บริษัท วันเดย์ คาเฟ่ แอนด์ เบเกอรี่ จำกัด",
  companyAddress: "88/9 ถนนสุขุมวิท ซอย 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110",
  companyPhone: "02-123-4567",
  showImages: true,
  lowStockThreshold: 10,
  logoDataUrl: null,
  sellerCanVoidOwn: true,
  allowTransfer: true,
  allowCredit: true,
};

const users: User[] = [
  { id: "u-admin", username: "admin", name: "ผู้ดูแลระบบ", password: "admin", role: "admin", isActive: true },
  { id: "u-somchai", username: "somchai", name: "สมชาย", password: "1234", role: "seller", isActive: true },
  { id: "u-somying", username: "somying", name: "สมหญิง", password: "1234", role: "seller", isActive: true },
];

const categories: Category[] = [
  { id: "c-rice", name: "ข้าว", sortOrder: 1, isActive: true },
  { id: "c-bakery", name: "เบเกอรี่", sortOrder: 2, isActive: true },
  { id: "c-drink", name: "เครื่องดื่ม", sortOrder: 3, isActive: true },
];

const products: Product[] = [
  { id: "p-khao-pad", categoryId: "c-rice", sku: "R01", name: "ข้าวผัดไก่", price: 55, trackStock: true, stockQty: 24, image: "/menu/khao-pad.jpg", isActive: true, sortOrder: 1 },
  { id: "p-krapao", categoryId: "c-rice", sku: "R02", name: "ข้าวกะเพราหมูสับ", price: 60, trackStock: true, stockQty: 18, image: "/menu/krapao.jpg", isActive: true, sortOrder: 2 },
  { id: "p-khao-man", categoryId: "c-rice", sku: "R03", name: "ข้าวมันไก่", price: 50, trackStock: true, stockQty: 20, image: "/menu/khao-man.jpg", isActive: true, sortOrder: 3 },
  { id: "p-omelette", categoryId: "c-rice", sku: "R04", name: "ข้าวไข่เจียว", price: 45, trackStock: true, stockQty: 16, image: "/menu/omelette.jpg", isActive: true, sortOrder: 4 },
  { id: "p-croissant", categoryId: "c-bakery", sku: "B01", name: "ครัวซองต์เนย", price: 65, trackStock: true, stockQty: 12, image: "/menu/croissant.jpg", isActive: true, sortOrder: 1 },
  { id: "p-sangkhaya", categoryId: "c-bakery", sku: "B02", name: "ขนมปังสังขยา", price: 35, trackStock: true, stockQty: 8, image: "/menu/sangkhaya.jpg", isActive: true, sortOrder: 2 },
  { id: "p-cake", categoryId: "c-bakery", sku: "B03", name: "เค้กช็อกโกแลต", price: 85, trackStock: true, stockQty: 6, image: "/menu/cake.jpg", isActive: true, sortOrder: 3 },
  { id: "p-cookie", categoryId: "c-bakery", sku: "B04", name: "คุกกี้ช็อกชิพ", price: 30, trackStock: true, stockQty: 2, image: "/menu/cookie.jpg", isActive: true, sortOrder: 4 },
  { id: "p-tea", categoryId: "c-drink", sku: "D01", name: "ชาไทยเย็น", price: 40, trackStock: true, stockQty: 30, image: "/menu/thai-tea.jpg", isActive: true, sortOrder: 1 },
  { id: "p-latte", categoryId: "c-drink", sku: "D02", name: "กาแฟลาเต้", price: 55, trackStock: false, stockQty: 0, image: "/menu/latte.jpg", isActive: true, sortOrder: 2 },
  { id: "p-orange", categoryId: "c-drink", sku: "D03", name: "น้ำส้มสด", price: 45, trackStock: true, stockQty: 14, image: "/menu/orange.jpg", isActive: true, sortOrder: 3 },
  { id: "p-cocoa", categoryId: "c-drink", sku: "D04", name: "โกโก้เย็น", price: 40, trackStock: true, stockQty: 9, image: "/menu/cocoa.jpg", isActive: true, sortOrder: 4 },
];

export function seedData(): Snapshot {
  const today = bangkokISODate();
  const yesterday = addDays(today, -1);
  const now = new Date().toISOString();
  const movements: StockMovement[] = products
    .filter((product) => product.trackStock)
    .map((product) => ({
      id: `mv-seed-${product.id}`,
      productId: product.id,
      type: "receive" as const,
      qty: product.stockQty,
      stockAfter: product.stockQty,
      orderId: null,
      userId: "u-admin",
      userName: "ผู้ดูแลระบบ",
      note: "สต๊อกเริ่มต้น",
      movementDate: yesterday,
      createdAt: now,
    }));

  return {
    users,
    categories,
    products,
    orders: [],
    movements,
    logs: [
      {
        id: uid("log"),
        actionCode: "install",
        messageTh: "เตรียมข้อมูลตัวอย่างของร้านวันเดย์ คาเฟ่ แอนด์ เบเกอรี่",
        level: "info",
        userId: "u-admin",
        userName: "ผู้ดูแลระบบ",
        terminalName: "POS-1",
        createdAt: now,
      },
    ],
    settings: { ...settings },
    cashCounts: [],
    receiptYear: bangkokYear(),
    receiptSeq: 0,
    sessionUserId: null,
    terminalName: "POS-1",
    printMode: "auto",
    cart: [],
    clientUuid: "cart-seed",
    fails: {},
  };
}
