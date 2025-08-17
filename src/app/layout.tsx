// app/layout.tsx
import "./globals.css";
import TopNav from "@/components/TopNav";
import LinkInterceptor from "./LinkInterceptor";
import TelegramSdkLoader from "./TelegramSdkLoader";

// All comments in English.
export const metadata = { title: "Polyvoice" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        {/* Programmatic, safe loader for Telegram WebApp SDK */}
        <TelegramSdkLoader />
        <LinkInterceptor />
        <TopNav />
        <div>{children}</div>
        </body>
        </html>
    );
}
