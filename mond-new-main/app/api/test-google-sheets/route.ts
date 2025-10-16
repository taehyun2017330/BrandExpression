import { NextResponse } from "next/server"
import { google } from "googleapis"

// Node.js 런타임 사용 명시
export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("Google Sheets 모듈 테스트 시작")

    // 환경 변수 확인
    console.log("환경 변수 확인:")
    console.log(
      `- GOOGLE_SERVICE_ACCOUNT_JSON: ${process.env.GOOGLE_SERVICE_ACCOUNT_JSON ? "설정됨" : "설정되지 않음"}`,
    )
    console.log(
      `- GOOGLE_SERVICE_ACCOUNT_EMAIL: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? "설정됨" : "설정되지 않음"}`,
    )
    console.log(`- GOOGLE_PRIVATE_KEY: ${process.env.GOOGLE_PRIVATE_KEY ? "설정됨" : "설정되지 않음"}`)
    console.log(`- GOOGLE_SHEET_ID: ${process.env.GOOGLE_SHEET_ID ? "설정됨" : "설정되지 않음"}`)

    // googleapis 모듈 로드 확인
    console.log("googleapis 모듈 로드됨:", !!google)

    // 서비스 계정 정보 가져오기 시도
    let credentials: any
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

    if (serviceAccountJson) {
      try {
        // JSON 문자열을 파싱
        credentials = JSON.parse(serviceAccountJson)
        console.log("서비스 계정 JSON 파싱 성공")
        console.log("서비스 계정 이메일:", credentials.client_email)
      } catch (parseError) {
        console.error("서비스 계정 JSON 파싱 오류:", parseError)
        return NextResponse.json(
          {
            error: "서비스 계정 JSON 파싱 실패",
            details: parseError instanceof Error ? parseError.message : "알 수 없는 오류",
          },
          { status: 500 },
        )
      }
    } else {
      // 개별 환경 변수 사용
      const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

      if (!email || !privateKey) {
        return NextResponse.json(
          {
            error: "Google 서비스 계정 정보가 없습니다.",
            email: !!email,
            privateKey: !!privateKey,
          },
          { status: 500 },
        )
      }

      credentials = { client_email: email, private_key: privateKey }
      console.log("개별 환경 변수에서 서비스 계정 정보 로드 성공")
    }

    // 스프레드시트 ID 확인
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    if (!spreadsheetId) {
      return NextResponse.json({ error: "Google Sheet ID가 없습니다." }, { status: 500 })
    }

    console.log("모든 필수 정보가 존재합니다. JWT 클라이언트 생성 시도...")

    // JWT 클라이언트 생성 시도
    try {
      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })

      // 인증 테스트
      console.log("JWT 클라이언트 생성됨, 인증 시도...")
      await auth.authorize()
      console.log("Google API 인증 성공")

      // Google Sheets API 클라이언트 생성
      const sheets = google.sheets({ version: "v4", auth })
      console.log("Google Sheets 클라이언트 생성 성공")

      // 스프레드시트 정보 가져오기 시도
      console.log("스프레드시트 정보 가져오기 시도...")
      const sheetInfo = await sheets.spreadsheets.get({
        spreadsheetId,
      })

      return NextResponse.json({
        success: true,
        message: "Google Sheets API 연결 성공",
        sheetTitle: sheetInfo.data.properties?.title,
        sheets: sheetInfo.data.sheets?.map((s) => s.properties?.title),
      })
    } catch (authError: any) {
      console.error("Google API 인증 오류:", authError)
      return NextResponse.json(
        {
          error: "Google API 인증 실패",
          details: authError.message,
          stack: authError.stack,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("API 오류:", error)
    return NextResponse.json(
      {
        error: "API 오류 발생",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
