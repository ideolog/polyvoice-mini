// src/app/api/backend/telegram-auth/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const base = process.env.BACKEND_BASE || "http://localhost:8000";

        const res = await fetch(`${base}/api/telegram/auth/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        // ✅ нормализуем ответ
        if (res.ok && data.api_key && data.user) {
            return NextResponse.json(
                {
                    ok: true,
                    api_key: data.api_key,
                    user: data.user,
                    avatar: data.user?.avatar || null,
                },
                { status: 200 },
            );
        }

        return NextResponse.json(
            { ok: false, error: data.error || "auth_failed" },
            { status: res.status },
        );
    } catch (e) {
        console.error("❌ telegram-auth proxy failed:", e);
        return NextResponse.json(
            { ok: false, error: "proxy_failed" },
            { status: 500 },
        );
    }
}
