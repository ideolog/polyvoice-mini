// app/LinkInterceptor.tsx
'use client';

// All comments in English.
import { useEffect } from 'react';

function isTelegramEnv(): boolean {
    return typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp;
}

function openInsideTelegram(url: string) {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) {
        console.warn('[TG-Link] Telegram.WebApp not detected. Fallback to window.location.href');
        window.location.href = url;
        return;
    }
    try {
        console.log('[TG-Link] Calling tg.openLink:', url);
        tg.openLink(url);
    } catch (e) {
        console.error('[TG-Link] tg.openLink error, fallback to location.href', e);
        window.location.href = url;
    }
}

function openTelegramDeepLink(url: string) {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openTelegramLink) {
        console.log('[TG-Link] Calling tg.openTelegramLink:', url);
        tg.openTelegramLink(url);
    } else {
        console.warn('[TG-Link] tg.openTelegramLink not available. Fallback to href');
        window.location.href = url;
    }
}

function isTelegramLink(href: string): boolean {
    return /^https?:\/\/t\.me\/|^tg:\/\//i.test(href);
}

function normalizeUrl(href: string): string {
    // Convert relative links to absolute — some Telegram clients behave better with absolute URLs.
    try {
        return new URL(href, window.location.origin).toString();
    } catch {
        return href;
    }
}

export default function LinkInterceptor() {
    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;

        // Debug banner in console about environment
        console.log('[TG-Link] Mounted. isTelegramEnv =', isTelegramEnv());
        if (tg) {
            console.log('[TG-Link] Telegram.WebApp version:', tg.version);
            console.log('[TG-Link] initDataUnsafe:', tg.initDataUnsafe);
            try {
                tg.expand?.();
            } catch {}
        }

        const handler = (e: MouseEvent) => {
            // Only intercept left-click without modifiers.
            if (e.defaultPrevented || (e as any).button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            // Find nearest anchor (works across nested elements).
            const target = e.target as HTMLElement | null;
            const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
            if (!anchor) return;

            // Skip anchors explicitly marked to bypass interception.
            if (anchor.dataset.tgBypass === '1') {
                console.log('[TG-Link] Bypass for anchor:', anchor.href);
                return;
            }

            const hrefAttr = anchor.getAttribute('href');
            if (!hrefAttr) return;
            if (hrefAttr.startsWith('#')) return;

            // Prevent Next.js / browser default nav before we decide how to open.
            e.preventDefault();

            // If link asked to open new tab/window — ignore and still force in-app.
            if (anchor.target === '_blank') {
                console.log('[TG-Link] target=_blank detected — forcing in-app.');
            }

            const href = normalizeUrl(hrefAttr);
            console.log('[TG-Link] Intercepted link:', { href, raw: hrefAttr });

            if (isTelegramLink(href)) {
                openTelegramDeepLink(href);
            } else {
                openInsideTelegram(href);
            }
        };

        // Some libraries stopPropagation on click; capture=true helps.
        document.addEventListener('click', handler, { capture: true });

        // Bonus: on mobile some taps fire touchend without click in certain wrappers.
        const touchHandler = (e: TouchEvent) => {
            // We won't fully duplicate logic here; click should generally fire after touchend.
            // Keep for edge cases; no preventDefault here to avoid breaking scroll.
        };
        document.addEventListener('touchend', touchHandler, { capture: true });

        return () => {
            document.removeEventListener('click', handler, { capture: true } as any);
            document.removeEventListener('touchend', touchHandler, { capture: true } as any);
        };
    }, []);

    return null;
}
