import { useState } from "react";
import { Button, Field, TextInput } from "@/components/pos/ui";
import { usePosStore } from "@/lib/pos/store";

export function LoginScreen() {
  const settings = usePosStore((state) => state.settings);
  const companyName = settings?.companyName || "บริษัท วันเดย์ คาเฟ่ แอนด์ เบเกอรี่ จำกัด";
  const login = usePosStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(nextUser = username, nextPass = password) {
    const result = login(nextUser, nextPass);
    if (!result.ok) setError(result.message);
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-cream px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl border border-sand bg-card p-6 shadow-sm">
        <div className="mb-5 text-center">
          {settings?.logoDataUrl ? (
            <img src={settings.logoDataUrl} alt="โลโก้ร้าน" className="mx-auto mb-3 h-20 w-auto object-contain" />
          ) : (
            <div className="text-3xl text-brand">OneDayPOS</div>
          )}
          <p className="mt-2 text-sm text-muted">{companyName}</p>
        </div>
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <Field label="ชื่อผู้ใช้">
            <TextInput autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          </Field>
          <Field label="รหัสผ่าน">
            <TextInput
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          {error ? <p className="text-sm text-brand">{error}</p> : null}
          <Button type="submit" className="w-full">
            เข้าสู่ระบบ
          </Button>
        </form>
        <div className="mt-5 rounded-xl bg-sand/60 p-3 text-sm">
          <p className="text-muted">บัญชีตัวอย่างบนเครื่องนี้</p>
          <div className="mt-2 grid gap-2">
            <Button variant="sand" className="w-full bg-card" onClick={() => submit("admin", "admin")}>
              แอดมิน · admin / admin
            </Button>
            <Button variant="sand" className="w-full bg-card" onClick={() => submit("somchai", "1234")}>
              ผู้ขาย · somchai / 1234
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
