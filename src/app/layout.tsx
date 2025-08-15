"use client";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-neutral-50 text-neutral-900">
        {children}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
        </body>
        </html>
    );
}