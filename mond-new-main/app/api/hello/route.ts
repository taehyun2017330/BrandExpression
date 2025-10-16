import { NextResponse } from "next/server"

// Node.js 런타임 사용 명시
export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    message: "API 엔드포인트가 정상적으로 작동합니다.",
    method: "GET",
    timestamp: new Date().toISOString(),
  })
}
