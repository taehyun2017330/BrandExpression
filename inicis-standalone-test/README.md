# INICIS 빌링 테스트 - Standalone

완전히 독립적인 INICIS 빌링키 발급 및 정기결제 테스트 환경입니다.

## 🚀 시작하기

1. **서버 시작**
   ```bash
   cd inicis-standalone-test
   ./start.sh
   ```
   또는
   ```bash
   npm install
   npm start
   ```

2. **브라우저에서 열기**
   ```
   http://localhost:3000
   ```

## 📋 테스트 순서

### 1. 빌링키 발급 (카드 등록)
- 구매자 정보 입력
- "빌링키 발급하기" 클릭
- INICIS 팝업에서 테스트 카드 정보 입력:
  - 카드번호: `5570-0810-0489-0411`
  - 유효기간: 미래 날짜 (예: 12/25)
  - CVC: 아무 3자리
  - 비밀번호: 카드 앞 2자리

### 2. 빌링키 확인
- 발급된 빌링키가 자동으로 저장됨
- 브라우저 localStorage에 저장되어 새로고침해도 유지

### 3. 정기결제 테스트
- 결제 금액 입력
- "1차 결제 실행" 클릭
- "2차 결제 실행" 클릭
- 동일한 빌링키로 여러 번 결제 가능

## 📁 파일 구조

```
inicis-standalone-test/
├── index.html      # 메인 테스트 페이지
├── server.js       # Express 서버
├── package.json    # 프로젝트 설정
├── start.sh        # 시작 스크립트
└── README.md       # 이 파일
```

## 🔧 기능

- ✅ 빌링키 발급 (BILLAUTH)
- ✅ 빌링키 저장 (localStorage)
- ✅ 정기결제 API 호출
- ✅ 테스트 빌링키 수동 설정
- ✅ 결제 이력 표시

## 🛠️ 기술 스택

- Frontend: 순수 HTML/CSS/JavaScript
- Backend: Node.js + Express
- INICIS: WebStandard + Billing API v2

## ⚠️ 주의사항

- 이것은 테스트 환경입니다
- 실제 운영에서는 보안 설정 필요
- 테스트 MID 사용 중 (INIBillTst)