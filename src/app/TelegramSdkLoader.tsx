// app/TelegramSdkLoader.tsx
'use client';

// All comments in English.
import { useEffect, useState } from 'react';

export default function TelegramSdkLoader() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // If SDK already present, nothing to do.
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
            console.log('[TG SDK] Already present');
            setLoaded(true);
            return;
        }

        try {
            const scriptId = 'telegram-webapp-sdk';
            const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
            if (existing) {
                existing.addEventListener('load', () => setLoaded(true), { once: true });
                return;
            }

            const s = document.createElement('script');
            s.id = scriptId;
            s.src = 'https://telegram.org/js/telegram-web-app.js';
            s.async = true;
            s.onload = () => {
                console.log('[TG SDK] Loaded');
                setLoaded(true);
            };
            s.onerror = (e) => {
                console.error('[TG SDK] Failed to load', e);
            };
            document.body.appendChild(s);
        } catch (e) {
            console.error('[TG SDK] Exception while injecting script:', e);
        }
    }, []);

    useEffect(() => {
        // Extra diagnostics: catch global errors to see where it explodes.
        const onError = (msg: string | Event, src?: string, lineno?: number, colno?: number, err?: any) => {
            console.error('[GlobalError]', { msg, src, lineno, colno, err });
            return false; // don't suppress
        };
        const onRejection = (ev: PromiseRejectionEvent) => {
            console.error('[UnhandledRejection]', ev.reason);
        };
        window.addEventListener('error', onError as any);
        window.addEventListener('unhandledrejection', onRejection);
        return () => {
            window.removeEventListener('error', onError as any);
            window.removeEventListener('unhandledrejection', onRejection);
        };
    }, []);

    if (!loaded) return null;
    return null;
}
