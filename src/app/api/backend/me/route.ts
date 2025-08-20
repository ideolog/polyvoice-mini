// src/app/api/backend/me/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const base = process.env.BACKEND_BASE || "http://localhost:8000";
    const apiKey = request.headers.get("x-api-key") || "";
    const res = await fetch(`${base}/api/me/`, {
        headers: { "X-API-Key": apiKey },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}
