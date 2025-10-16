import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "API 테스트 성공", timestamp: new Date().toISOString() })
}

export async function POST() {
  return NextResponse.json({ message: "POST 요청 성공", timestamp: new Date().toISOString() })
}
