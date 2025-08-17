import "./globals.css";

export const metadata = { title: "Polyvoice" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="bg-black text-red-600">
        <div className="p-10 bg-yellow-400 text-black">
            {children}
        </div>
        </body>
        </html>
    );
}
