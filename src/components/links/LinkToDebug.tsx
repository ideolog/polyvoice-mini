"use client";
import { useRouter } from "next/navigation";

export default function LinkToDebug() {
    const router = useRouter();

    return (
        <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => router.push("/debug")}
        >
            Go to Debug 000
        </button>
    );
}
