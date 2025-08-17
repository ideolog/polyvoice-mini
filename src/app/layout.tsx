// app/layout.tsx
import "./globals.css";
import TopNav from "@/components/TopNav";
import LinkInterceptor from "./LinkInterceptor";
import TelegramSdkLoader from "./TelegramSdkLoader";
import Script from "next/script";  // ✅ добавили

// All comments in English.
export const metadata = { title: "Polyvoice" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        {/* Load Telegram WebApp SDK before anything else */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />

        {/* Programmatic, safe loader for Telegram WebApp SDK */}
        <TelegramSdkLoader />
        <LinkInterceptor />
        <TopNav />
        <div>{children}</div>
        </body>
        </html>
    );
}

