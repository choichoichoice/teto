import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import KakaoInit from "@/components/KakaoInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "테토-에겐 분석기 | 사진으로 알아보는 테토-에겐 유형",
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
          {/* 사용자 제안 방식: 앱 전체에서 딱 한 번만 초기화 */}
          <KakaoInit />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        
        {/* 카카오 SDK 로드 */}
        <Script 
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        
        {/* 카카오 AdFit 스크립트 - 페이지 하단에 위치 */}
        <Script 
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
