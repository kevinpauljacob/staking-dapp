import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/providers/WalletProvider";
import { Toaster } from "sonner";

import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} font-poppins antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SolanaProvider>
            <Navbar />
            {children}
            <Toaster position="top-right" />
          </SolanaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
