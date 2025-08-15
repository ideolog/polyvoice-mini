import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { search } = await req.json();
    const base = process.env.BACKEND_BASE || "http://localhost:8000"; // Django
    const res = await fetch(`${base}/api/telegram/auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}