"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BOT_USERNAME = process.env.NEXT_PUBLIC_TG_BOT_USERNAME;
const AUTH_URL_ENV = process.env.NEXT_PUBLIC_TG_AUTH_URL;

export default function Home() {
    const router = useRouter();
    const [mode, setMode] = useState<"loading" | "miniapp" | "browser">("loading");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const tg = (window as any).Telegram?.WebApp;
            if (tg && tg.initData) {
                setMode("miniapp");
                // вместо редиректа – сразу POST на наш API
                fetch("/api/telegram/auth/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        search: encodeURIComponent(tg.initData),
                        source: "miniapp",
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.ok) {
                            // например, сохраняем api_key в localStorage
                            localStorage.setItem("api_key", data.api_key);
                            router.replace("/dashboard"); // редиректим на панель
                        } else {
                            console.error("MiniApp login failed:", data);
                        }
                    })
                    .catch((err) => console.error("MiniApp auth error:", err));
            } else {
                setMode("browser");
            }

        }
    }, [router]);

    if (!BOT_USERNAME) {
        return (
            <main className="p-6">
                <h1 className="text-xl font-semibold mb-3">PolyVoice Mini</h1>
                <p className="text-sm text-red-600">
                    Set <code>NEXT_PUBLIC_TG_BOT_USERNAME</code> in <code>.env.local</code>.
                </p>
            </main>
        );
    }

    if (mode === "loading") {
        return <main className="p-6"><p>Loading…</p></main>;
    }

    if (mode === "miniapp") {
        // ✅ Мини-апп → никакого виджета
        return (
            <main className="p-6">
                <h1 className="text-xl font-semibold mb-3">PolyVoice Mini 0.0.8</h1>
                <p className="text-sm opacity-70">Redirecting inside Telegram…</p>
            </main>
        );
    }

    // ✅ Только браузер → показываем виджет
    const authUrl =
        AUTH_URL_ENV ||
        (typeof window !== "undefined"
            ? `${window.location.origin}/api/telegram/auth/`
            : "/api/telegram/auth/");

    return (
        <main className="p-6">
            <h1 className="text-xl font-semibold mb-3">PolyVoice Mini 0.0.8</h1>
            <Script
                src="https://telegram.org/js/telegram-widget.js?21"
                strategy="afterInteractive"
                data-telegram-login={BOT_USERNAME}
                data-size="large"
                data-auth-url={authUrl}
                data-request-access="write"
            />
            <p className="text-sm opacity-70 mt-3">
                If the button doesn’t render, open this app via your Telegram bot menu.
            </p>
        </main>
    );
}
