"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PVUser = {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
};

declare global { interface Window { Telegram?: any } }

export default function Panel() {
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [user, setUser] = useState<PVUser | null>(null);
    const [me, setMe] = useState<any>(null);

    useEffect(() => {
        // Telegram WebApp init (optional when opened inside Telegram)
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            tg.MainButton.setText("Close").onClick(() => tg.close());
        }
        setReady(true);

        // Load user from localStorage (set after /auth/telegram)
        try {
            const raw = localStorage.getItem("pv_user");
            if (raw) setUser(JSON.parse(raw));
        } catch {}
        const fetchMe = async () => {
            try {
                const apiKey = localStorage.getItem("pv_api_key");
                if (!apiKey) return;
                const base = process.env.NEXT_PUBLIC_BACKEND_BASE || "http://localhost:8000";
                const res = await fetch("/api/backend/me", {
                    headers: { "X-API-Key": apiKey },
                });
                const data = await res.json();
                if (res.ok) {
                    setMe(data);
                } else {
                    console.warn("me error", data);
                }
            } catch (e) {
                console.warn("me fetch failed", e);
            }
        };
        fetchMe();


    }, []);

    const logout = () => {
        localStorage.removeItem("pv_user");
        router.replace("/");
    };

    return (
        <main className="p-4 space-y-4">
            <h1 className="text-xl font-semibold">Panel</h1>
            <div className="text-sm opacity-70">{ready ? "Telegram WebApp: ready" : "Open inside Telegram"}</div>

            {user ? (
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                    {user.photo_url ? (
                        <img
                            src={user.photo_url}
                            alt="avatar"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-neutral-200" />
                    )}
                    <div className="flex-1">
                        <div className="font-medium">
                            {user.first_name} {user.last_name}
                            {user.username ? <span className="opacity-60"> @{user.username}</span> : null}
                        </div>
                        <div className="text-xs opacity-60">Telegram ID: {user.id}</div>
                    </div>
                    {me && (
                        <div className="p-4 border rounded-lg bg-white">
                            <div className="font-medium">Django user</div>
                            <div className="text-sm opacity-70">
                                email: {me.email || "—"} · plan: {me.plan || "—"} · api_key: {me.api_key_present ? "set" : "missing"}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="px-3 py-2 text-sm rounded border border-neutral-300 hover:bg-neutral-100"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="p-4 border rounded-lg bg-white">
                    <div className="text-sm">You are not logged in.</div>
                    <a
                        href="/"
                        className="mt-2 inline-block px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Go to Login
                    </a>
                </div>
            )}
        </main>
    );
}