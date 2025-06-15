import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "테토-에겐 분석기 | 사진으로 알아보는 성격 유형",
  description: "AI가 당신의 사진을 분석하여 테토남, 테토녀, 에겐남, 에겐녀 중 어떤 유형에 가까운지 알려드립니다.",
  keywords: "성격분석, 테토, 에겐, AI분석, 성격유형",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
