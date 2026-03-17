import type { Metadata } from "next";
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
