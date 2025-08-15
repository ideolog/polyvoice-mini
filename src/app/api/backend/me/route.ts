import { NextResponse } from "next/server";

export async function GET() {
    const base = process.env.BACKEND_BASE || "http://localhost:8000";
    const apiKey = typeof localStorage === "undefined" ? "" : ""; // localStorage недоступен на сервере
    // Проксируем без ключа — ключ будем пробрасывать с клиента через fetch опцией; см. ниже.
    const res = await fetch(`${base}/api/me/`, { headers: {} });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}