"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BOT_USERNAME = process.env.NEXT_PUBLIC_TG_BOT_USERNAME;
const AUTH_URL_ENV = process.env.NEXT_PUBLIC_TG_AUTH_URL;

export default function Home() {
    const router = useRouter();
    const [isMiniApp, setIsMiniApp] = useState(false);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
            setIsMiniApp(true);
            router.replace("/auth/telegram?source=miniapp");
        } else {
            setIsMiniApp(false);
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

    if (isMiniApp) {
        return (
            <main className="p-6">
                <h1 className="text-xl font-semibold mb-3">PolyVoice Mini</h1>
                <p className="text-sm opacity-70">Redirecting inside Telegram…</p>
            </main>
        );
    }

    // Default: browser with widget
    const authUrl =
        AUTH_URL_ENV ||
        (typeof window !== "undefined"
            ? `${window.location.origin}/auth/telegram`
            : "/auth/telegram");

    return (
        <main className="p-6">
            <h1 className="text-xl font-semibold mb-3">PolyVoice Mini 0.0.4</h1>
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
