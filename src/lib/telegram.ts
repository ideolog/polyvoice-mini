// lib/telegram.ts
// All comments in English.
export function isTelegramEnv(): boolean {
    return typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp;
}

export function openInsideTelegram(url: string) {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) {
        // Fallback: just navigate normally inside SPA/WebView.
        window.location.href = url;
        return;
    }

    // Prefer official Telegram API if present in the environment.
    // openLink opens inside Telegram's in-app browser by default.
    // Note: On some iOS builds, Telegram may still force external browser (platform quirk).
    tg.openLink(url);
}

export function openTelegramDeepLink(url: string) {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openTelegramLink) {
        tg.openTelegramLink(url);
    } else {
        // Fallback to normal navigation; Telegram client handles t.me/tg://
        window.location.href = url;
    }
}

export function isTelegramLink(href: string): boolean {
    return /^https?:\/\/t\.me\/|^tg:\/\//i.test(href);
}
