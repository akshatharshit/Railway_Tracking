import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0ea5a4",
};

export const metadata: Metadata = {
  title: "RailIntel — Smart Railway Intelligence Platform",
  description: "Real-time railway information, predictive analytics, intelligent route optimization, and advanced passenger assistance.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
