import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import {MainLayout} from "@/components/layout/main-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Flow - Talent Acquisition Platform",
  description: "Connect with top talent and find your dream job",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}