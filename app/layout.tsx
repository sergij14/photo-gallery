import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { NextAuthProvider } from "@/components/auth/next-auth-provider";
import "./globals.css";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Photo gallery App",
  description: "Photo gallery App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased p-8",
          fontSans.variable
        )}
      >
        <NextAuthProvider>
          <div className="max-w-[800px] mx-auto">{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
