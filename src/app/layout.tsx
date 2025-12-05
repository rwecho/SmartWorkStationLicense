import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SessionProvider } from "next-auth/react";
import MainLayout from "@/components/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SWS License",
  description: "License Manager of SWS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const className = inter.className + " min-h-screen bg-gray-100";
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={className}>
        <AntdRegistry>
          <SessionProvider>
            <MainLayout>{children}</MainLayout>
          </SessionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
