import "./globals.css";

export const metadata = { title: "Polyvoice" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-dvh bg-bg text-neutral-100 antialiased">
        <div className="mx-auto w-full max-w-md px-4">{children}</div>
        </body>
        </html>
    );
}
