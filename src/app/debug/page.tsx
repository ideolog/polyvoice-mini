"use client";

import { useMemo } from "react";
import {
    initDataRaw as _initDataRaw,
    initDataState as _initDataState,
    useSignal,
} from "@telegram-apps/sdk-react";

export default function DebugPage() {
    const initDataRaw = useSignal(_initDataRaw);
    const initDataState = useSignal(_initDataState);

    const dump = useMemo(() => {
        return {
            raw: initDataRaw || null,
            parsed: initDataState || null,
        };
    }, [initDataRaw, initDataState]);

    return (
        <main className="p-4">
            <h1 className="text-xl font-bold mb-3">Telegram InitData Debug</h1>
            <h2 className="text-lg font-semibold mt-4">Raw initData</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
        {dump.raw ? dump.raw : "no initData"}
      </pre>

            <h2 className="text-lg font-semibold mt-4">Parsed initDataState</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
        {JSON.stringify(dump.parsed, null, 2)}
      </pre>
        </main>
    );
}
