import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeFi Guardian",
  description: "AI-powered DeFi protocol monitor for HashKeyChain",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
