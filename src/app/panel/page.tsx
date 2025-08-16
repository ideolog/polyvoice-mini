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

declare global {
    interface Window {
        Telegram?: any;
    }
}

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
                const base =
                    process.env.NEXT_PUBLIC_BACKEND_BASE || "http://localhost:8000";
                const res = await fetch(`${base}/api/me/`, {
                    headers: { "X-API-Key": apiKey },
                });
                const data = await res.json();
                if (res.ok) setMe(data);
                else console.warn("me error", data);
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
        <main className="min-h-screen bg-black text-neutral-100">
            <div className="mx-auto max-w-md px-4 py-6">
                {/* Header */}
                <header className="mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Panel</h1>
                    <div className="mt-2 inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-xs text-neutral-300 ring-1 ring-white/5">
            <span
                className={`mr-2 inline-block h-2 w-2 rounded-full ${
                    ready ? "bg-emerald-500" : "bg-yellow-500"
                }`}
            />
                        {ready ? "Telegram WebApp: ready" : "Open inside Telegram"}
                    </div>
                </header>

                {/* Body */}
                {user ? (
                    <section className="space-y-4">
                        {/* User card */}
                        <div className="rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/10 backdrop-blur">
                            <div className="flex items-center gap-4">
                                {user.photo_url ? (
                                    <img
                                        src={user.photo_url}
                                        alt="avatar"
                                        className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-neutral-800 ring-1 ring-white/10" />
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm/5 text-neutral-200">
                    <span className="font-medium">
                      {user.first_name} {user.last_name}
                    </span>
                                        {user.username ? (
                                            <span className="ml-1 text-neutral-400">
                        @{user.username}
                      </span>
                                        ) : null}
                                    </div>
                                    <div className="mt-1 text-xs text-neutral-400">
                                        Telegram ID:{" "}
                                        <span className="font-mono text-neutral-300">{user.id}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={logout}
                                    className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 transition hover:border-white/20 hover:bg-neutral-800"
                                >
                                    Logout
                                </button>
                            </div>

                            {/* Django user mini-card */}
                            {me && (
                                <div className="mt-4 rounded-xl bg-neutral-950/40 p-3 ring-1 ring-white/5">
                                    <div className="text-xs font-medium text-neutral-300">
                                        Django user
                                    </div>
                                    <div className="mt-1 text-xs text-neutral-400">
                    <span className="mr-2">
                      email:{" "}
                        <span className="text-neutral-200">
                        {me.email || "—"}
                      </span>
                    </span>
                                        <span className="mx-2">·</span>
                                        <span className="mr-2">
                      plan:{" "}
                                            <span className="text-neutral-200">
                        {me.plan || "—"}
                      </span>
                    </span>
                                        <span className="mx-2">·</span>
                                        <span>
                      api_key:{" "}
                                            <span
                                                className={
                                                    me.api_key_present
                                                        ? "text-emerald-400"
                                                        : "text-rose-400"
                                                }
                                            >
                        {me.api_key_present ? "set" : "missing"}
                      </span>
                    </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                ) : (
                    <div className="rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/10 backdrop-blur">
                        <div className="text-sm text-neutral-300">You are not logged in.</div>
                        <a
                            href="/"
                            className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                        >
                            Go to Login
                        </a>
                    </div>
                )}
            </div>
        </main>
    );
}
