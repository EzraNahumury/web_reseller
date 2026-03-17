import type { Metadata } from "next";
import GlobalParticlesBackground from "@/components/GlobalParticlesBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Reseller Ayres",
  description: "Dashboard admin reseller berbasis Google Sheets API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="relative min-h-screen antialiased">
        <GlobalParticlesBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}