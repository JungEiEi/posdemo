export async function readImageFile(file: File, max = 640) {
  if (file.type === "image/svg+xml") {
    if (file.size > 512 * 1024) throw new Error("ไฟล์ SVG ใหญ่เกินไป");
    const text = await file.text();
    if (/script|on\w+\s*=|javascript:|foreignObject/i.test(text)) throw new Error("ไฟล์ SVG ไม่ปลอดภัย");
    return `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("รองรับ JPG, PNG, WebP หรือ SVG");
  }
  if (file.size > 2 * 1024 * 1024) throw new Error("ไฟล์ใหญ่เกิน 2 MB");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("อ่านรูปไม่สำเร็จ"));
      el.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("อ่านรูปไม่สำเร็จ");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    URL.revokeObjectURL(url);
  }
}
