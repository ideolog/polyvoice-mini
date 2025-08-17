"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TelegramAuthPage() {
    const router = useRouter();
    const [msg, setMsg] = useState("Validating…");

    useEffect(() => {
        const run = async () => {
            try {
                const url = new URL(window.location.href);
                const source = url.searchParams.get("source");
                let search: string | null = null;

                if (source === "miniapp") {
                    const tg = (window as any).Telegram?.WebApp;
                    search = tg?.initData || null;
                } else {
                    // Берём всё что после ? включая &
                    search = window.location.href.split("?")[1] || null;
                }

                if (!search) {
                    setMsg("No auth params found.");
                    return;
                }

                const res = await fetch("/api/backend/telegram-auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ search, source }),
                });

                const data = await res.json();
                if (!res.ok || !data?.ok) {
                    setMsg(`Auth failed: ${data?.error || res.statusText}`);
                    return;
                }

                localStorage.setItem("pv_user", JSON.stringify(data.user));
                if (data.api_key) {
                    localStorage.setItem("pv_api_key", data.api_key);
                }

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
