import type { Metadata } from "next";
import localFont from "next/font/local";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { validateBootEnv } from "@/lib/env";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

validateBootEnv();

export const metadata: Metadata = {
  title: "testa.run",
  description: "AI-powered QA and security testing workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${publicSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
