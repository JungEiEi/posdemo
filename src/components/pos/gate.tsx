import { useEffect, type ReactNode } from "react";
import { LoginScreen } from "@/components/pos/login-screen";
import { seedData } from "@/lib/pos/seed";
import { usePosStore, useSessionUser } from "@/lib/pos/store";

export function usePosHydrated() {
  useEffect(() => {
    let alive = true;
    const finish = () => {
      if (alive) usePosStore.setState({ hydrated: true });
    };
    if (usePosStore.persist.hasHydrated()) finish();
    const unsub = usePosStore.persist.onFinishHydration(finish);
    void Promise.resolve(usePosStore.persist.rehydrate())
      .catch(() => {
        usePosStore.setState({ ...seedData(), hydrated: true, notice: { id: Date.now(), text: "เปิดร้านใหม่จากข้อมูลตัวอย่าง" } });
      })
      .finally(finish);
    const timer = window.setTimeout(finish, 1200);
    const onStorage = (event: StorageEvent) => {
      if (event.key === "onedaypos-v1") void usePosStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      alive = false;
      unsub();
      window.clearTimeout(timer);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
}

export function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream px-6 text-center">
      <div>
        <div className="text-3xl text-brand">OneDayPOS</div>
        <p className="mt-2 text-sm text-muted">กำลังเปิดระบบขาย</p>
      </div>
    </div>
  );
}

export function RequireSession({ children }: { children: ReactNode }) {
  const hydrated = usePosStore((state) => state.hydrated);
  const user = useSessionUser();
  if (!hydrated) return <Splash />;
  if (!user) return <LoginScreen />;
  return <>{children}</>;
}
