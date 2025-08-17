// lib/useTelegram.ts
// All comments in English.
import { useEffect, useMemo, useRef, useState } from "react";

export type TgState =
    | { ready: false; miniApp: false; tg: undefined }
    | { ready: true; miniApp: boolean; tg: any };

const MAX_TRIES = 50;   // up to ~5s
const INTERVAL_MS = 100;

function detectMiniApp(tg: any): boolean {
    if (!tg) return false;
    // The only reliable signal is non-empty initData with a user payload.
    // Outside Telegram it's always an empty string.
    const s: string = tg.initData || "";
    // Some clients expose user under initDataUnsafe.user.
    const hasUser = !!tg.initDataUnsafe?.user?.id;
    return (s.length > 0) && hasUser;
}

export function useTelegram(): TgState {
    const [tgRef, setTgRef] = useState<any>();
    const [ready, setReady] = useState(false);
    const tries = useRef(0);

    useEffect(() => {
        let timer: any;

        const tick = () => {
            const tg = (window as any)?.Telegram?.WebApp;
            if (tg) {
                // Call ready/expand once available.
                try { tg.ready?.(); tg.expand?.(); } catch {}
                setTgRef(tg);
                setReady(true);
                return; // stop polling; we will compute miniApp below via memo
            }
            if (tries.current++ < MAX_TRIES) {
                timer = setTimeout(tick, INTERVAL_MS);
            } else {
                setReady(true); // give up, but mark as "ready=false tg undefined"
            }
        };

        // First tick async to ensure we're after hydration.
        timer = setTimeout(tick, 0);
        return () => clearTimeout(timer);
    }, []);

    const miniApp = useMemo(() => detectMiniApp(tgRef), [tgRef]);

    return (ready
            ? { ready: true, miniApp, tg: tgRef }
            : { ready: false, miniApp: false, tg: undefined }
    );
}
