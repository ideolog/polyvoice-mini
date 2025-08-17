"use client";
//app/auth/telegram/page.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TelegramAuthPage() {
    const router = useRouter();
    const [msg, setMsg] = useState("Validating…");

    useEffect(() => {
        const run = async () => {
            try {
                // 1) Try querystring from URL
                let search = window.location.search.replace(/^\?/, "");

                // 2) If empty → take from Telegram Mini App (same querystring format)
                const tg = (window as any).Telegram?.WebApp;
                if (!search && tg?.initData) {
                    search = tg.initData; // already k=v&k2=v2… DO NOT encode
                }

                if (!search) {
                    setMsg("No auth params found. Open via bot menu (Mini App).");
                    return;
                }

                // Debug log to see exactly what we send
                console.log("[Auth] sending search:", search);

                const res = await fetch("/api/backend/telegram-auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ search }), // <-- unchanged backend contract
                });

                const text = await res.text();
                console.log("[Auth] status:", res.status, "body:", text);

                if (!res.ok) {
                    setMsg(`Auth failed: ${res.status} ${text}`);
                    return;
                }

                // backend may return JSON; try to parse
                let data: any = {};
                try { data = JSON.parse(text); } catch {}

                if (!data?.ok) {
                    setMsg(`Auth failed: ${data?.error || "unknown"}`);
                    return;
                }

                if (data.avatar) data.user.avatar = data.avatar;
                localStorage.setItem("pv_user", JSON.stringify(data.user));
                if (data.api_key) localStorage.setItem("pv_api_key", data.api_key);

                setMsg("Auth OK. Redirecting…");
                router.replace("/panel");
            } catch (e: any) {
                setMsg(`Auth error: ${e?.message || "unknown"}`);
            }
        };
        run();
    }, [router]);


    return (
        <main className="p-6">
            <h1 className="text-xl font-semibold mb-2">Telegram Auth</h1>
            <p className="text-sm opacity-70">{msg}</p>
        </main>
    );
}