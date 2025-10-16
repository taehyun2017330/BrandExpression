import { google } from "googleapis"

// Google Sheets API 클라이언트 생성
export async function getGoogleSheetsClient() {
  console.log("getGoogleSheetsClient 함수 호출됨")

  try {
    // 환경 변수에서 서비스 계정 정보 가져오기
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    let credentials: any

    if (serviceAccountJson) {
      try {
        // JSON 문자열을 파싱
        credentials = JSON.parse(serviceAccountJson)
        console.log("서비스 계정 JSON 파싱 성공")
      } catch (parseError) {
        console.error("서비스 계정 JSON 파싱 오류:", parseError)
        throw new Error(
          `서비스 계정 JSON 파싱 실패: ${parseError instanceof Error ? parseError.message : "알 수 없는 오류"}`,
        )
      }
    } else {
      // 개별 환경 변수 사용
      const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

      if (!email || !privateKey) {
        console.error("Google 서비스 계정 정보 누락:", { email: !!email, privateKey: !!privateKey })
        throw new Error("Google 서비스 계정 정보가 없습니다.")
      }

      credentials = { client_email: email, private_key: privateKey }
      console.log("개별 환경 변수에서 서비스 계정 정보 로드 성공")
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

    return sheets
  } catch (error) {
    console.error("Google Sheets 클라이언트 생성 오류:", error)
    throw error
  }
}

// Google Sheets에 데이터 추가
export async function appendToSheet(data: any) {
  console.log("appendToSheet 함수 호출됨")

  try {
    console.log("Google Sheets 클라이언트 가져오기 시도...")
    const sheets = await getGoogleSheetsClient()
    console.log("Google Sheets 클라이언트 가져오기 성공")

    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      console.error("GOOGLE_SHEET_ID 환경 변수가 없습니다.")
      throw new Error("Google Sheet ID가 없습니다.")
    }

    console.log(`스프레드시트 ID: ${spreadsheetId}`)

    // 시트 정보 먼저 가져와서 확인
    try {
      console.log("스프레드시트 정보 가져오기 시도...")
      const sheetInfo = await sheets.spreadsheets.get({
        spreadsheetId,
      })
      console.log("스프레드시트 제목:", sheetInfo.data.properties?.title)
      console.log("시트 목록:", sheetInfo.data.sheets?.map((s) => s.properties?.title).join(", "))
    } catch (sheetInfoError) {
      console.error("스프레드시트 정보 가져오기 실패:", sheetInfoError)
      // 계속 진행 (정보 로깅 목적)
    }

    // 데이터를 행으로 변환 (안전하게 처리)
    const values = [
      [
        String(data.email || ""),
        String(data.phone || ""),
        String(data.purpose || ""),
        data.adConsent === true ? "Y" : "N",
        String(data.timestamp || new Date().toISOString()),
      ],
    ]

    console.log("추가할 데이터:", values)

    // 실제 시트 이름 확인 (기본값은 Sheet1)
    // 한글 설정인 경우 "시트1"일 수 있음
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

    console.log("Google Sheets 데이터 추가 응답:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Google Sheets 데이터 추가 오류:", error)

    // 더 자세한 오류 정보 로깅
    if (error.response) {
      console.error("API 응답 오류:", error.response.data)
      console.error("API 응답 상태:", error.response.status)
    }

    // 스택 트레이스 로깅
    console.error("오류 스택:", error.stack)

    throw error
  }
}
