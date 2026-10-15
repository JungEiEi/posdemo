import { baht, formatCeStamp, PAY_LABEL } from "@/lib/pos/format";
import type { Order, Settings } from "@/lib/pos/types";

export function ReceiptSlip({ order, settings }: { order: Order; settings: Settings }) {
  return (
    <article className="receipt-paper mx-auto bg-card px-3 py-4 text-xs leading-snug text-ink">
      <div className="text-center">
        <div className="text-sm">{settings.companyName}</div>
        <div className="mt-1">{settings.companyAddress}</div>
        <div className="mt-1">โทร {settings.companyPhone}</div>
      </div>
      <hr className="my-2 border-dashed border-ink" />
      <div>เลขที่ / No. {order.receiptShort}</div>
      <div>วันที่ / Date {formatCeStamp(order.createdAt)}</div>
      <div>
        เครื่อง {order.terminalName} · {order.userName}
      </div>
      <hr className="my-2 border-dashed border-ink" />
      <div className="grid grid-cols-[1.5rem_1fr_2rem_2.5rem] gap-1">
        <span>ลำดับ</span>
        <span>รายการ</span>
        <span className="text-right">จำนวน</span>
        <span className="text-right">ราคา</span>
        {order.items.map((item, index) => (
          <span key={`${item.productId}-${index}`} className="contents">
            <span>{index + 1}</span>
            <span>{item.productName}</span>
            <span className="text-right">{item.qty}</span>
            <span className="text-right">{baht(item.lineTotal)}</span>
          </span>
        ))}
      </div>
      <hr className="my-2 border-dashed border-ink" />
      <div className="text-right text-sm">รวม {baht(order.total)}</div>
      {order.paymentMethod === "cash" ? (
        <>
          <div className="text-right">รับ {baht(order.cashReceived ?? 0)}</div>
          <div className="text-right">ทอน {baht(order.changeAmount ?? 0)}</div>
        </>
      ) : (
        <div className="text-right">
          {PAY_LABEL[order.paymentMethod]} {baht(order.total)}
        </div>
      )}
      {order.status === "void" ? (
        <div className="mt-2 text-center text-sm text-brand">
          ** ยกเลิก **
          <div className="text-xs text-ink">เหตุผล: {order.voidReason}</div>
        </div>
      ) : null}
      <div className="mt-3 text-center">ขอบคุณที่ใช้บริการ</div>
      <div className="mt-1 text-center text-muted">รายงานใช้เลขที่ {order.receiptLong}</div>
    </article>
  );
}
