import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { X } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "sand" | "ghost" | "sky";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-brand text-brand-ink disabled:opacity-40",
  sand: "bg-sand text-ink disabled:opacity-40",
  ghost: "bg-transparent text-ink hover:bg-sand",
  sky: "bg-sky text-ink",
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

const fieldClass = "h-11 w-full rounded-lg border border-sand bg-card px-3 text-ink";

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClass} ${className}`} {...props} />;
}

export function SelectInput({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldClass} ${className}`} {...props} />;
}

export function TextArea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`w-full rounded-lg border border-sand bg-card px-3 py-2 text-ink ${className}`} {...props} />;
}

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[92dvh] w-full overflow-auto rounded-t-2xl bg-card p-4 shadow-xl sm:rounded-2xl ${wide ? "sm:max-w-3xl" : "sm:max-w-md"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-lg text-brand">{title}</h2>
          <button type="button" aria-label="ปิด" onClick={onClose} className="grid size-11 shrink-0 place-items-center rounded-lg text-ink">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ title, hint, children }: { title: string; hint?: string; children?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl text-brand">{title}</h1>
        {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

export function SwitchRow({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-sand bg-card px-3 text-left"
    >
      <span className="text-sm">{label}</span>
      <span className={`grid h-7 min-w-12 place-items-center rounded-full px-2 text-xs ${on ? "bg-brand text-brand-ink" : "bg-sand text-ink"}`}>
        {on ? "เปิด" : "ปิด"}
      </span>
    </button>
  );
}
