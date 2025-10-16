import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "아몬드 - 텍스트 기반 AI 콘텐츠 제작 서비스",
  description: "주제별 트렌드에 딱 맞는 터지는 콘텐츠 기획을 쉽고 간편하게 시작해보세요!",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
  },
  openGraph: {
    title: "아몬드 - 텍스트 기반 AI 콘텐츠 제작 서비스",
    description: "주제별 트렌드에 딱 맞는 터지는 콘텐츠 기획을 쉽고 간편하게 시작해보세요!",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "아몬드 - 텍스트 기반 AI 콘텐츠 제작 서비스",
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body>{children}</body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"


import './globals.css'