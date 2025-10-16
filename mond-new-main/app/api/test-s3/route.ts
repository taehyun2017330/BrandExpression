import { NextResponse } from "next/server"

// Node.js 런타임 사용 명시
export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("API 테스트 시작")

    // 간단한 응답 반환
    return NextResponse.json({
      message: "API 엔드포인트가 정상적으로 작동합니다.",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("API 오류:", error)

    return NextResponse.json(
      {
        error: "API 오류 발생",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
