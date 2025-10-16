import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

// Node.js 런타임 사용 명시
export const runtime = "nodejs"

// 간소화된 직접 구현 방식
export async function POST(request: NextRequest) {
  console.log("API 호출 시작")

  try {
    // 클라이언트에서 보낸 JSON 받기
    const formDataObj = await request.json()
    console.log("받은 폼 데이터:", formDataObj)

    // 유효성 검사
    if (!formDataObj.email || !formDataObj.phone || !formDataObj.purpose) {
      console.error("필수 필드 누락:", {
        email: !!formDataObj.email,
        phone: !!formDataObj.phone,
        purpose: !!formDataObj.purpose,
      })
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 })
    }

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

    try {
      // 서비스 계정 정보 가져오기
      let credentials: any
      const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

      if (serviceAccountJson) {
        try {
          // JSON 문자열을 파싱
          credentials = JSON.parse(serviceAccountJson)
          console.log("서비스 계정 JSON 파싱 성공")
        } catch (parseError) {
          console.error("서비스 계정 JSON 파싱 오류:", parseError)
          return NextResponse.json(
            { error: "서비스 계정 JSON 파싱 실패", details: String(parseError) },
            { status: 500 },
          )
        }
      } else {
        // 개별 환경 변수 사용
        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

        if (!email || !privateKey) {
          console.error("Google 서비스 계정 정보 누락:", { email: !!email, privateKey: !!privateKey })
          return NextResponse.json(
            { error: "Google 서비스 계정 정보가 없습니다.", details: { email: !!email, privateKey: !!privateKey } },
            { status: 500 },
          )
        }

        credentials = { client_email: email, private_key: privateKey }
        console.log("개별 환경 변수에서 서비스 계정 정보 로드 성공")
      }

      // 스프레드시트 ID 확인
      const spreadsheetId = process.env.GOOGLE_SHEET_ID
      if (!spreadsheetId) {
        console.error("GOOGLE_SHEET_ID 환경 변수가 없습니다.")
        return NextResponse.json({ error: "Google Sheet ID가 없습니다." }, { status: 500 })
      }

      console.log("JWT 클라이언트 생성 시도...")

      // JWT 클라이언트 생성
      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })

      // 인증 테스트
      console.log("인증 시도...")
      await auth.authorize()
      console.log("Google API 인증 성공")

      // Google Sheets API 클라이언트 생성
      const sheets = google.sheets({ version: "v4", auth })
      console.log("Google Sheets 클라이언트 생성 성공")

      // 데이터를 행으로 변환
      const values = [
        [
          String(formDataObj.email || ""),
          String(formDataObj.phone || ""),
          String(formDataObj.purpose || ""),
          formDataObj.adConsent === true ? "Y" : "N",
          String(formDataObj.timestamp || new Date().toISOString()),
        ],
      ]

      console.log("추가할 데이터:", values)

      // 실제 시트 이름 확인 (기본값은 Sheet1)
      const sheetName = "Sheet1" // 필요에 따라 "시트1" 등으로 변경
      const range = `${sheetName}!A:E`

      console.log(`사용할 범위: ${range}`)

      // Google Sheets API 호출
      console.log("Google Sheets API 호출 시도...")
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      })

      console.log("Google Sheets 데이터 추가 성공:", response.data)

      // 성공 응답
      return NextResponse.json({
        success: true,
        message: "데이터가 성공적으로 Google Sheets에 저장되었습니다.",
      })
    } catch (sheetsError: any) {
      console.error("Google Sheets 데이터 추가 오류:", sheetsError)

      // 오류 세부 정보 로깅
      if (sheetsError.response) {
        console.error("Google API 응답 오류:", sheetsError.response.data)
        console.error("Google API 응답 상태:", sheetsError.response.status)
      }

      console.error("오류 스택:", sheetsError.stack)

      // 폴백: 데이터를 로그에만 기록하고 성공 응답 반환
      console.log("폴백 처리: 데이터를 로그에만 기록합니다.")
      console.log("폼 데이터:", formDataObj)

      return NextResponse.json({
        success: true,
        message: "데이터가 성공적으로 수신되었습니다.",
        note: "Google Sheets 저장은 실패했지만 데이터는 처리되었습니다.",
        error: String(sheetsError),
      })
    }
  } catch (error: any) {
    console.error("API 오류:", error)
    console.error("오류 스택:", error.stack)

    // 일반 오류 응답
    return NextResponse.json(
      {
        error: "요청 처리 실패",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
