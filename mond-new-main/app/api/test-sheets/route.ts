import { NextResponse } from "next/server"
import { getGoogleSheetsClient } from "@/lib/google-sheets"

// Node.js 런타임 사용 명시
export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("Google Sheets 연결 테스트 시작")

    try {
      // 환경 변수 확인
      const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
      const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      const privateKey = process.env.GOOGLE_PRIVATE_KEY
      const sheetId = process.env.GOOGLE_SHEET_ID

      console.log("환경 변수 확인:")
      console.log(`- GOOGLE_SERVICE_ACCOUNT_JSON: ${serviceAccountJson ? "설정됨" : "설정되지 않음"}`)
      console.log(`- GOOGLE_SERVICE_ACCOUNT_EMAIL: ${serviceAccountEmail ? "설정됨" : "설정되지 않음"}`)
      console.log(`- GOOGLE_PRIVATE_KEY: ${privateKey ? "설정됨" : "설정되지 않음"}`)
      console.log(`- GOOGLE_SHEET_ID: ${sheetId ? "설정됨" : "설정되지 않음"}`)

      // Google Sheets API 클라이언트 생성
      const sheets = await getGoogleSheetsClient()

      // 스프레드시트 정보 가져오기
      const spreadsheetId = process.env.GOOGLE_SHEET_ID
      if (!spreadsheetId) {
        throw new Error("Google Sheet ID가 없습니다.")
      }

      const response = await sheets.spreadsheets.get({
        spreadsheetId,
      })

      return NextResponse.json({
        message: "Google Sheets 연결 성공",
        sheetTitle: response.data.properties?.title,
        timestamp: new Date().toISOString(),
      })
    } catch (sheetsError: any) {
      console.error("Google Sheets 연결 오류:", sheetsError)

      return NextResponse.json(
        {
          message: "API 엔드포인트는 작동하지만 Google Sheets 연결 실패",
          error: sheetsError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }, // 테스트 목적으로 200 상태 코드 반환
      )
    }
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
