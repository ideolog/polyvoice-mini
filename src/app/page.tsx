"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DebugInitData from "@/components/DebugData";

import {
    initDataRaw as _initDataRaw,
    initDataState as _initDataState,
} from "@telegram-apps/sdk-react";

const BOT_USERNAME = process.env.NEXT_PUBLIC_TG_BOT_USERNAME;
const AUTH_URL_ENV = process.env.NEXT_PUBLIC_TG_AUTH_URL;

export default function Page() {
    const router = useRouter();
    const [mode, setMode] = useState<"loading" | "miniapp" | "browser">("loading");

    const [raw, setRaw] = useState<string | null>(null);
    const [unsafe, setUnsafe] = useState<any>(null);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
            tg.ready();
            setMode("miniapp");
        } else {
            setMode("browser");
        }

        setRaw(_initDataRaw?.value || tg?.initData || null);
        setUnsafe(_initDataState?.value || tg?.initDataUnsafe || null);
    }, []);

    useEffect(() => {
        console.log("🔥 effect triggered:", { mode, raw, unsafe });

        if (mode === "miniapp" && raw) {
            console.log("🚀 sending fetch...");
            fetch("/api/backend/telegram-auth/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    raw,
                    unsafe,
                    source: "miniapp",
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.ok) {
                        // ✅ сохраняем и ключ, и пользователя
                        localStorage.setItem("pv_api_key", data.api_key);
                        localStorage.setItem("pv_user", JSON.stringify(data.user));

                        router.replace("/panel");
                    } else {
                        console.error("MiniApp login failed:", data);
                    }
                })
                .catch((err) => console.error("MiniApp auth error:", err));
        }
    }, [mode, raw, unsafe, router]);

    if (!BOT_USERNAME) {
        return (
            <main className="p-6">
                <h1 className="text-xl font-semibold mb-3">PolyVoice Mini</h1>
                <DebugInitData />
                <p className="text-sm text-red-600">
                    Set <code>NEXT_PUBLIC_TG_BOT_USERNAME</code> in <code>.env.local</code>.
                </p>
            </main>
        );
    }

    if (mode === "loading") {
        return (
            <main className="p-6">
                <p>Loading…</p>
            </main>
        );
    }

    if (mode === "miniapp") {
        return (
            <main className="p-6">
                <h1 className="text-xl font-semibold mb-3">PolyVoice Mini 0.0.9</h1>
                <DebugInitData />
                <p className="text-sm opacity-70">Redirecting inside Telegram…</p>
            </main>
        );
    }

    const authUrl =
        AUTH_URL_ENV ||
        (typeof window !== "undefined"
            ? `${window.location.origin}/api/telegram/auth/`
            : "/api/telegram/auth/");

    return (
        <main className="p-6">
            <h1 className="text-xl font-semibold mb-3">PolyVoice Mini 0.0.9</h1>
            <DebugInitData />
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
