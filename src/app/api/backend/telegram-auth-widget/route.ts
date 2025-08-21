// src/app/api/backend/telegram-auth-widget/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const query = url.search; // всё после "?"
        console.log("🔑 WIDGET QUERY:", query);

        const base = process.env.BACKEND_BASE || "http://127.0.0.1:8000";

        // Проксируем на Django с query string
        const res = await fetch(`${base}/api/telegram/widget-auth/${query}`, {
            method: "GET",
            credentials: "include",
        });

        const text = await res.text();
        let data: any;
        try {
            data = JSON.parse(text);
        } catch {
            data = { ok: false, error: "non_json_response", raw: text };
        }

        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("❌ telegram-auth-widget proxy failed:", e);
        return NextResponse.json(
            { ok: false, error: "proxy_failed" },
            { status: 500 }
        );
    }
}
