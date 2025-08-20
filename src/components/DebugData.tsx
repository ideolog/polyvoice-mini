"use client";
import { useEffect, useState } from "react";

export default function DebugInitData() {
    const [raw, setRaw] = useState<string | null>(null);
    const [unsafe, setUnsafe] = useState<any>(null);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        setRaw(tg?.initData ?? null);
        setUnsafe(tg?.initDataUnsafe ?? null);
    }, []);

    return (
        <main className="p-6">
            <h1>Debug InitData</h1>
            <h2>Raw:</h2>
            <pre>{raw}</pre>
            <h2>Unsafe:</h2>
            <pre>{JSON.stringify(unsafe, null, 2)}</pre>
        </main>
    );
}
