"use client";
import Script from "next/script";
import { useMemo } from "react";

const BOT_USERNAME = process.env.NEXT_PUBLIC_TG_BOT_USERNAME;
const AUTH_URL_ENV = process.env.NEXT_PUBLIC_TG_AUTH_URL; // e.g. https://<ngrok>.ngrok-free.app/auth/telegram

export default function Home() {
    const authUrl = useMemo(() => {
        if (AUTH_URL_ENV) return AUTH_URL_ENV;
        if (typeof window !== "undefined") return `${window.location.origin}/auth/telegram`;
        return "/auth/telegram";
    }, []);

    return (
        <main className="p-6">
            <h1 className="text-xl font-semibold mb-3">PolyVoice Mini</h1>
            {!BOT_USERNAME ? (
                <p className="text-sm text-red-600">
                    Set <code>NEXT_PUBLIC_TG_BOT_USERNAME</code> in <code>.env.local</code>.
                </p>
            ) : (
                <>
                    {/* Telegram Login Widget */}
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
                </>
            )}
        </main>
    );
}