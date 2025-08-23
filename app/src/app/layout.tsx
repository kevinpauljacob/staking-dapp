import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/providers/WalletProvider";
import { Toaster } from "sonner";
import WalletConnection from "@/components/WalletConnectionButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solana Staking DApp",
  description: "Educational Solana staking platform with interactive learning",
  keywords: ["solana", "staking", "blockchain", "defi", "education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SolanaProvider>
          <nav className="flex items-center justify-between h-16 px-4 bg-card border-b">
            <h1 className="text-xl font-bold">Solana Staking DApp</h1>
            <WalletConnection />
          </nav>
          {children}
          <Toaster position="top-right" />
        </SolanaProvider>
      </body>
    </html>
  );
}
