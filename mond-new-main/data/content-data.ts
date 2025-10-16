export type ContentItem = {
  id: string
  category: string
  title: string
  description: string
  icon: string
  date: string
}

export const categories = [
  { id: "all", name: "전체" },
  { id: "beauty", name: "뷰티/미용" },
  { id: "food", name: "맛집/홈쿡" },
  { id: "daily", name: "일상/트렌드" },
  { id: "fashion", name: "패션" },
  { id: "self", name: "자기개발" },
  { id: "knowledge", name: "지식 콘텐츠" },
  { id: "health", name: "건강/헬스" },
]

export const contentItems: ContentItem[] = [
  // 뷰티/미용 카테고리 콘텐츠
  {
    id: "beauty-1",
    category: "beauty",
    title: "인플루언서 추천템",
    description:
      "케이스가 예쁘고 뒤주머니에 넣어도 무르짐 없어서 휴대하기 간편해요. 발색이 정말 자연스러워요. 꾸안꾸 톤을 입을 때 가볍게 발라주면 훨씬 관리한 이미지가 연출돼요.",
    icon: "💅",
    date: "5/1",
  },
  {
    id: "beauty-2",
    category: "beauty",
    title: "올리브영 세일 알림",
    description:
      "5월 4일 단 하루! 올영세일 끝나기도 전에 온라인몰 품절 되버린 밀크 토업 올인원😂 티안 나고 자연스러운 메이크업 베이스를 찾으시는 여자분들까지 남녀 모두에게...",
    icon: "👜",
    date: "5/4",
  },
  {
    id: "beauty-3",
    category: "beauty",
    title: "극강의 보습력 강조",
    description:
      "인플루언서들이 밝힌 ○○○ #립밤 과하지 않은 광택감, 겔러같이 들어간 극강의 보습력 립밤을 원하신다면 ○○립밤을 만나보세요.",
    icon: "💧",
    date: "5/11",
  },
  {
    id: "beauty-4",
    category: "beauty",
    title: "댓글 이벤트",
    description:
      "올 겨울 나의 입술은 어떤 입술일까요? #생기있는입술 #촉촉한입술 내가 지금 갖고 있는 입술에 대한 고민이나, 올 겨울 유지하고 싶은 입술을 써주세요!",
    icon: "✨",
    date: "5/15",
  },
  {
    id: "beauty-5",
    category: "beauty",
    title: "왓츠인마이백",
    description:
      "올겨울 관리하는 남자들의 가방 안에 뭐가 있을까요? 비주얼적으로도 손색없는 맨즈케어 1등 ○○○의 립밤을 만나보세요.",
    icon: "💼",
    date: "5/19",
  },
  {
    id: "beauty-6",
    category: "beauty",
    title: "팔로우 이벤트",
    description:
      "이 립밤을 보고 떠오르는 음식이 있나요? 댓글로 정답을 맞추신 1분에게 히알루론살 컬러젤이 들어간 #○○립밤 을 선물로 드릴게요!",
    icon: "💄",
    date: "5/22",
  },
  {
    id: "beauty-7",
    category: "beauty",
    title: "지금 딱 맞는 크림",
    description:
      "트렌치 코트가 어울리는 계절이 왔어요. 깔끔한 패션의 완성은 말끔한 피부이죠. 톤업으로 고르지 못한 피부 톤을 개선해보세요.",
    icon: "🧴",
    date: "5/25",
  },
  {
    id: "beauty-8",
    category: "beauty",
    title: "오래 지속되는 보습",
    description: "스타일링의 완성은 기본에 충실한 것. ✓저녁까지도 당기지 않는 2배 더 긴 보습을 원한다면 #○○크림",
    icon: "🧪",
    date: "5/28",
  },
  {
    id: "beauty-9",
    category: "beauty",
    title: "체험단 이벤트",
    description:
      "#EVENT 🎁현상수배🎁 을 가을 겨울, 입술 관리 잘하고 싶은 남성분들을 찾습니다! 입술은 다른 부위에 비해 피부가 얇고 수분 증발을 막는 피지선이 없..",
    icon: "🔑",
    date: "5/31",
  },

  // 맛집/홈쿡 카테고리 콘텐츠
  {
    id: "food-1",
    category: "food",
    title: "서울 뷰 맛집 BEST",
    description:
      '[봄바람과 함께 떠나는 뷰 맛집 투어] ✓ 위치: 서울 OO구 OO (지하철 OO역 도보 5분) ✓ 메뉴 추천: 트러플 파스타, 시그니처 에이드 ✓ 제 평: "날씨는 봄, 뷰는 여름..',
    icon: "⭐",
    date: "5/1",
  },
  {
    id: "food-2",
    category: "food",
    title: "SNS 인증샷 각도 꿀팁",
    description:
      "[SNS 맛집 사진, 이렇게 찍으면 찐이다!] 1) 자연광 활용하기: 창가에서 찍으면 최소 반은 성공 2) 45도 각도로 음식의 층층이 레이어 강조 3) 음식색과 배경색 대비..",
    icon: "📸",
    date: "5/4",
  },
  {
    id: "food-3",
    category: "food",
    title: "어버이날 기념 맛집 추천",
    description:
      "[어버이날 부모님 모시고 어디가지?] ✓ 여기 추천: 깔끔한 한정식 코스에 부담 없는 가격 ✓ 위치: 서울 OO동 ✓ 제평: \"부모님 '여기 너무 좋다'란 말 자동 재생되는 곳\".",
    icon: "👨‍👩‍👧",
    date: "5/11",
  },
  {
    id: "food-4",
    category: "food",
    title: "추억의 맛집 이벤트",
    description:
      "[5월 가정의 달 EVENT] 가족과 함께했던 추억의 맛집을 댓글로 남겨주세요! 추첨 통해 3분께 '서울 맛집 지도 & 시식권(스타벅스 기프티콘)'을 드립니다. ✓ 참여방법..",
    icon: "🥗",
    date: "5/15",
  },
  {
    id: "food-5",
    category: "food",
    title: "OO동 숨은 국물 맛집",
    description:
      '[비 오는 날에 국물 한 사발로 힐링] ✓ 메뉴 추천: 얼큰 칼국수, 버섯 전골 ✓ 위치: 서울 OO동 골목 안 ✓ 제 평: "비소리 + 뜨끈한 국물 = 스트레스 OUT! ...',
    icon: "🥣",
    date: "5/19",
  },
  {
    id: "food-6",
    category: "food",
    title: "시그니처 메뉴 추천",
    description:
      "[시그니처 메뉴, 정말 맛있을까?] 가게마다 '시그니처'타이틀 붙은 메뉴 있죠? ✓ 실제로 가게 대표 레시피거나 ✓ 맛이 팔리는 메뉴(혹은 이윤이 높은 메뉴)일 수도..",
    icon: "🍔",
    date: "5/22",
  },
  {
    id: "food-7",
    category: "food",
    title: "단골 맛집 리스트 공유",
    description:
      "그동안 믿고 따라와 주신 여러분께 감사드려요! 제가 직접 선정한 '인생 단골 맛집 리스트(전자책 PDF)'를 받으실 분을 모집합니다. ✓ 참여방법...",
    icon: "📋",
    date: "5/25",
  },
  {
    id: "food-8",
    category: "food",
    title: "서울 초여름 별미",
    description:
      '[더위가 오기 전에 미리 즐기는 냉면, 콩국수!] ✓ 서울 OO동 노포 냉면집: 40년 전통, 육수 깔끔 ✓ 콩국수 전문점: 진한 콩 국물, 깨 토핑 듬뿍 ✓ 제평: "딱 베일빼줄...',
    icon: "🧊",
    date: "5/28",
  },
  {
    id: "food-9",
    category: "food",
    title: "로우 푸드 트렌드",
    description:
      "[2025년 '로우 푸드'가 온다!] ✓ 저칼로리 + 건강 + 맛까지 잡은 레시피 ✓ 설탕 대신 천연 감미료 사용 ✓ 샐러드도 단순 플레이팅이 아닌 '볼샐러드' 전성시대 요즘 이 로우..",
    icon: "🥦",
    date: "5/31",
  },

  // 일상/트렌드 카테고리 콘텐츠
  {
    id: "daily-1",
    category: "daily",
    title: "MZ 봄맞이 마케팅",
    description:
      "[5월 첫째 주, 봄 감성 저격하는 MZ 마케팅 트렌드] 1) 봄맞이 캠페인: 플라워 굿즈나 '꽃' 이미지 적극 활용 2) 착한 브랜드, 가치소비: 에코백 또는 리유저블 컵...",
    icon: "🎀",
    date: "5/1",
  },
  {
    id: "daily-2",
    category: "daily",
    title: "5월 공휴일 마케팅",
    description:
      "[5월 공휴일, 이렇게 마케팅 해보면 어떨까요?] - 어린이날: 어린이 고객 대상 체험 이벤트 or 굿즈 - 어버이날: '감사편지' 해시태그 참여형 이벤트 - 스승의날, 성년의날...",
    icon: "⛱️",
    date: "5/4",
  },
  {
    id: "daily-3",
    category: "daily",
    title: "Z세대 플랫폼 TOP5",
    description:
      "[Z세대, 지금 어느 플랫폼에 있을까?] 1) 틱톡: 짧은 영상으로 바이럴 빠르게! 2) 인스타그램: 릴스, 스토리 활용 필수 3) 유튜브: 숏츠부터 긴 영상까지 다양한 형식 공존...",
    icon: "🤸",
    date: "5/11",
  },
  {
    id: "daily-4",
    category: "daily",
    title: "MZ 소비키워드 3가지",
    description:
      "[MZ의 소비 키워드 3가지, 제대로 알고 마케팅하자!] 1) 편의미: 제미 요소로 바이럴 폭발 2) 그린슈머: 친환경/지속가능성 강조 3) 포미족: 나를 위해 아끼지 않는 지갑 열다",
    icon: "🔥",
    date: "5/15",
  },
  {
    id: "daily-5",
    category: "daily",
    title: "'숏폼 마케팅' 트렌드",
    description:
      "[5월 중순, '숏폼'이 마케팅 판을 흔든다?] - 짧고 강렬한 영상으로 브랜딩 임팩트! - 제품 리뷰·챌린지 등으로 바이럴↑ - 핵심 지표: 조회수 + 재생 시간 + 공유 수 매주 트렌드...",
    icon: "🌎",
    date: "5/19",
  },
  {
    id: "daily-6",
    category: "daily",
    title: "나만의 마케팅팁 이벤트",
    description:
      '나만의 마케팅 트렌드를 댓글로 공유해주세요! 추첨 통해 세 분께 "스타벅스 기프티콘" 증정! ✓ 참여방법: 1) @weekly_trendy 팔로우 & 좋아요 2) 댓글에 요즘...',
    icon: "💡",
    date: "5/22",
  },
  {
    id: "daily-7",
    category: "daily",
    title: "위클리 굿즈 이벤트",
    description:
      "[3,000명 돌파 기념 EVENT] 위클리트렌디를 사랑해주시는 모든 분들께 감사드려요! 추첨을 통해 '위클리트렌디 굿즈 세트(노트+스티커)'를 드립니다. ✓ 참여방법 1)계정 팔로우 & 게시물 좋아요...",
    icon: "🎯",
    date: "5/25",
  },
  {
    id: "daily-8",
    category: "daily",
    title: "6월 트렌드 미리보기",
    description:
      "특별한 당신만의 이야기를 [벌써 6월을 준비해야 하는 시점?!] - 환경의 날(6/5) 중심 친환경 캠페인 - 장마철 할인·프로모션 아이디어 - 상반기 결산 새얼굴 고객 리텐션 극대화 미리 6월 트렌드 포인트...",
    icon: "⚡",
    date: "5/28",
  },
  {
    id: "daily-9",
    category: "daily",
    title: "밈(Meme) 마케팅.zip",
    description:
      "[Meme 마케팅, 못기면 바이럴이 확 퍼진다?] ✓ SNS에서 번지는 '밈'을 브랜드에 접목 ✓ 해외사례: Wendy's, Burger King 등 재치 있는 소통 ✓ 주의: 너무 유행 지난 밈 or 저작권 문제가 될 수 있음 MZ를 사로잡는 첫 단추? 재치 있는 '밈'!",
    icon: "🐢",
    date: "5/31",
  },

  // 패션 카테고리 콘텐츠
  {
    id: "fashion-1",
    category: "fashion",
    title: "S/S 패션 트렌드 총정리",
    description:
      "1) 뉴트럴 톤 셋업: 깔끔하지만 세련된 분위기가 관건 2) 크롭 재킷+하이웨스트: 다리 길어 보이는 꿀 조합! 3) 과감한 컬러 액세서리: 단조로운 룩에 포인트 주기 좋습니다.",
    icon: "🌸",
    date: "5/1",
  },
  {
    id: "fashion-2",
    category: "fashion",
    title: "쇼핑몰&브랜드 소식",
    description:
      "✓ A 쇼핑몰, S/S 전 품목 최대 50% 세일 ✓ B 브랜드 X 유명 일러스트레이터 콜라보 ✓ 5월 말 패션위크 일정 공개 한눈에 보는 주간 패션 트렌드, 재밌게 보셨나요?",
    icon: "🎬",
    date: "5/4",
  },
  {
    id: "fashion-3",
    category: "fashion",
    title: "Z세대 플랫폼 TOP5",
    description:
      "[Z세대, 지금 어느 플랫폼에 있을까?] 1) 틱톡: 짧은 영상으로 바이럴 빠르게! 2) 인스타그램: 릴스, 스토리 활용 필수 3) 유튜브: 숏츠부터 긴 영상까지 다양한 형식 공존...",
    icon: "🤝",
    date: "5/11",
  },
  {
    id: "fashion-4",
    category: "fashion",
    title: "S/S아이템 #댓글이벤트",
    description:
      '"내가 좋아하는 S/S 아이템" 댓글 달고 굿즈 받자! ✓ 참여방법: 1) @dailyfashion_news 팔로우 & 게시물 좋아요 2) 댓글로 "요즘 꽂힌 S/S 패션 아이템" 소개 3) 친구 1명 태그 ✓ 기간: 5/8 ~ 5/12',
    icon: "🎁",
    date: "5/15",
  },
  {
    id: "fashion-5",
    category: "fashion",
    title: "5월 초여름 패션",
    description:
      "[벌써 초여름, 패션 미리 준비해볼까요?] 1) 린넨 셔츠: 통기성+멋, 두 마리 토끼 2) 버뮤다 팬츠: MZ의 데일리룩 필수 3) 가벼운 니트/셔츠: 낮엔 시원, 저녁엔 포근",
    icon: "☀️",
    date: "5/19",
  },
  {
    id: "fashion-6",
    category: "fashion",
    title: "패션 TMI 퀴즈 #event",
    description:
      '"패션 TMI 퀴즈" 정답 맞히고 할인쿠폰 받으세요! ✓ 참여방법: 1) 릴스 시청 후, 정답 떠오르면 댓글로 작성 2) 친구 1명 태그 3) @dailyfashion_news 팔로우 & 좋아요 ✓ 기간: 5/15 ~ 5/18',
    icon: "❓",
    date: "5/22",
  },
  {
    id: "fashion-7",
    category: "fashion",
    title: "핫한 캡 브랜드 TOP3",
    description:
      "[5월 한 달, 가장 핫했던 패션 브랜드 TOP3] 3위: OO브랜드 - 깔끔 모델 발탁으로 SNS 난리 2위: XX브랜드 - 독특한 리미티드 에디션으로 열광 1위: △△브랜드 - 아이돌과 협업해 국내외 관심폭발",
    icon: "🔥",
    date: "5/25",
  },
  {
    id: "fashion-8",
    category: "fashion",
    title: "친환경 패션 아이템",
    description:
      "[친환경 패션 전성시대, 요즘 뜨는 소재는?] 1) 업사이클 데님: 오래된 청바지를 새롭게 재탄생 2) 비건 레더: 파인애플, 사과 껍질 등 친환경 가죽 3) 재생 폴리에스터: PET병에서 옷을 만든다?",
    icon: "🌱",
    date: "5/28",
  },
  {
    id: "fashion-9",
    category: "fashion",
    title: "6월 주목 행사&브랜드",
    description:
      "벌써 6월 미리보기, 놓치면 아쉬운 패션 스케줄] ✓ 브랜드 X 전시회: 6월 10일부터 2주간 진행 ✓ 여름 패션위크: 6월 말 개최 예정 ✓ 신상품 라인업: 아이돌 모델 발탁 소문",
    icon: "⏭️",
    date: "5/31",
  },

  // 자기개발 카테고리 새 콘텐츠
  {
    id: "self-1",
    category: "self",
    title: "타이틀이 가진 힘",
    description: "마케팅에서 제목은 절대 과소평가할 수 없는 힘이 있어요! ❤️",
    icon: "💻",
    date: "5/1",
  },
  {
    id: "self-2",
    category: "self",
    title: "필수 마케팅 채널",
    description: "아직 시작해도 늦지 않았어요. 함께 성장해볼까요? 🙌 #마케팅채널..",
    icon: "📊",
    date: "5/4",
  },
  {
    id: "self-3",
    category: "self",
    title: "프리랜서의 하루",
    description: "제 하루를 엿보며 나만의 루틴을 만들어 보세요! #프리랜서일상 #디지털노마드..",
    icon: "💼",
    date: "5/11",
  },
  {
    id: "self-4",
    category: "self",
    title: "팔리는 콘텐츠",
    description: "좋은 콘텐츠는 팔리고, 나쁜 콘텐츠는 사라진다. 🤔 지금 당신의 콘텐츠는..",
    icon: "🧐",
    date: "5/15",
  },
  {
    id: "self-5",
    category: "self",
    title: "마케팅 TIP 이벤트",
    description: "제가 준비한 무료 선물 받으실 분? 실무에서 바로 쓰이는 마케팅 전자책 증정 이벤트📚..",
    icon: "🎁",
    date: "5/19",
  },
  {
    id: "self-6",
    category: "self",
    title: "매출을 올리는 힘",
    description: "마케팅랩타임데이는 마케팅의 황금기! ❤️ 이 3가지만 실천해도 매출은 쑥쑥 올라가요..",
    icon: "💡",
    date: "5/22",
  },
  {
    id: "self-7",
    category: "self",
    title: "콘텐츠 트렌드의 핵심",
    description: "콘텐츠의 트렌드는 매년 바뀌지만, 핵심은 같습니다. 🎯 고객과 공감하고, 가치 전달해요",
    icon: "🎯",
    date: "5/25",
  },
  {
    id: "self-8",
    category: "self",
    title: "스토리텔링의 힘",
    description: "특별한 당신만의 이야기를 만들어 보세요! #스토리텔링마케팅 #콘텐츠팁..",
    icon: "✨",
    date: "5/28",
  },
  {
    id: "self-9",
    category: "self",
    title: "밀스 2025 트렌드",
    description: "3가지 밀스 에서 활용 방법으로 브랜드 인지도를 빠르게 높여보세요. 당신의 비즈니스...",
    icon: "🔥",
    date: "5/31",
  },

  // 지식 콘텐츠 카테고리 새 콘텐츠
  {
    id: "knowledge-1",
    category: "knowledge",
    title: "글로벌 비즈니스 핫토픽",
    description:
      "1) 빅테크 기업 분기 실적 발표: 예상보다 높은 성장세 2) 새로운 스타트업 IPO 소식: 투자자 관심 급증 3) 국내외 협업 & 파트너십 증가: 글로벌 진출 러시",
    icon: "🌐",
    date: "5/1",
  },
  {
    id: "knowledge-2",
    category: "knowledge",
    title: "AI 시대, 사무직 스킬",
    description:
      "[🤖 AI 시대, 사무직에 꼭 필요한 스킬 3가지] 1) 데이터 리터러시: 숫자와 친해져야 정확한 의사결정이 가능 2) AI 툴 활용 능력: 업무 효율 UP, 반복 업무 최소화 3) 협업 커뮤니케이션: 디지털 환경 속 팀워크 중요성↑",
    icon: "🤖",
    date: "5/4",
  },
  {
    id: "knowledge-3",
    category: "knowledge",
    title: "국내외 스타트업 투자 소식",
    description:
      "[💰 이번 주, 주목받은 스타트업 투자 소식] - 국내: 핀테크 기업 A, 시리즈B 300억 유치 - 해외: 헬스케어 스타트업 B, 대규모 글로벌 펀딩 성사 - 공통 트렌드: 'AI'와 'ESG' 키워드가 핵심 매주 업데이트되는 스",
    icon: "💰",
    date: "5/11",
  },
  {
    id: "knowledge-4",
    category: "knowledge",
    title: "사이드 프로젝트 운영법",
    description:
      "1) 명확한 목표 설정: 단순 호기심이 아닌 구체적 아웃풋 2) 리소스 관리: 시간·인력·예산 미리 계획 3) 일정관리 & 협업툴 활용: 프로젝트 진행 효율 극대화",
    icon: "⚙️",
    date: "5/15",
  },
  {
    id: "knowledge-5",
    category: "knowledge",
    title: "나만의 업무 노하우 공유",
    description:
      '계정 팔로우 & 게시물 좋아요 2) 댓글에 "나만의 효율적 업무 팁" 1개 작성 3) 친구 1명 태그 ✓ 기간: 5/15 ~ 5/19 ✓ 당첨 발표: 5/20 (DM 개별연락) ✓ 선물: 테크/비즈 관련 도서 or 커피 기프티콘',
    icon: "🎁",
    date: "5/19",
  },
  {
    id: "knowledge-6",
    category: "knowledge",
    title: "주목해야 할 기업 뉴스",
    description:
      "5월 중순, 눈여겨봐야 할 기업 뉴스 3가지 1) 대기업 C, 신사업 진출 선언 2) IT기업 D, 신규 SaaS 서비스 출시 3) 스타트업 E, 글로벌 기업과 M&A 추진",
    icon: "📊",
    date: "5/22",
  },
  {
    id: "knowledge-7",
    category: "knowledge",
    title: "팀빌딩을 위한 핵심 요소",
    description:
      "👏 성공적인 팀빌딩을 위한 핵심 요소 1) 문화적 핏(Cultural Fit): 회사의 가치와 맞는 인재 2) 역할 분배: 개인 역량에 맞게 배치 3) 열린 커뮤니케이션: 불편함 없이 소통하고 시너지 극대화",
    icon: "🤝",
    date: "5/25",
  },
  {
    id: "knowledge-8",
    category: "knowledge",
    title: "5월 유망 SaaS 트렌드",
    description:
      "🔍 5월 말, 유망 SaaS 트렌드 & 주목 스타트업 - 원격근무 솔루션 시장 성장 가속 - CRM 자동화 & AI 접목 사례 증가 - 스타트업 F, 글로벌 펀딩 유치로 화제",
    icon: "📚",
    date: "5/28",
  },
  {
    id: "knowledge-9",
    category: "knowledge",
    title: "6월 비즈니스 키워드",
    description:
      "📅 6월을 준비하는 비즈니스 키워드 미리보기✓ 주요 테크 컨퍼런스 일정 확인✓ 하반기 대비 신제품 출시 트렌드✓ 글로벌 시장의 투자 기회 & 리스크",
    icon: "📅",
    date: "5/31",
  },

  // 건강/헬스 카테고리 새 콘텐츠
  {
    id: "health-1",
    category: "health",
    title: "아보카도 달걀 샌드위치",
    description:
      "5분 완성, 아보카도 달걀 샌드위치 ✅ 재료: 식빵 2장, 아보카도 1/2개, 삶은 달걀 1개, 소금·후추 약간 1) 아보카도 으깨서 식빵에 바르기 2) 달걀 으깨고 간 살짝 3) 샌드위치로 완성하면 포만감 대박!",
    icon: "🥑",
    date: "5/1",
  },
  {
    id: "health-2",
    category: "health",
    title: "홈카페 음료 레시피",
    description:
      "[MZ가 주목하는 홈카페 음료 레시피] ✅ 딸바(딸기+바나나) 두유 스무디 - 두유 200ml - 냉동 딸기 한 줌 - 바나나 1/2개 - 원하는 분량의 얼음 1) 모든 재료를 블렌더에 넣고 30초 정도 갈아요. 2) 컵에 담고, 민트 잎으로 마무리!",
    icon: "🍓",
    date: "5/4",
  },
  {
    id: "health-3",
    category: "health",
    title: "닭가슴살 요거트 샐러드",
    description:
      "닭가슴살 요거트 샐러드, 단백질 파워업! 🍗 준비 재료: - 샐러드 채소, 닭가슴살, 방울토마토 - 요거트 드레싱(플레인 요거트 + 레몬즙 + 허니 머스타드 1스푼) 1) 닭가슴살 삶거나 에어프라이어로 익혀 준",
    icon: "🍗",
    date: "5/11",
  },
  {
    id: "health-4",
    category: "health",
    title: "버섯 두부덮밥",
    description:
      "[버섯 두부덮밥, 고기 없이 단백질 충전!] 🍄 준비 재료: - 버섯 (양송이, 표고 등) 적당량 - 두부 1/2모, 간장 1큰술, 다진 마늘 1/2큰술 - 밥 1공기 파/깨 약간 👨‍🍳 만들기: 1) 버섯 먼저 볶다가 두부 으깨 넣기",
    icon: "🍄",
    date: "5/15",
  },
  {
    id: "health-5",
    category: "health",
    title: "나만의 초간단 레시피 공유",
    description:
      '[EVENT] "나만의 초간단 건강 레시피" 공유해주세요! ✅ 참여방법: 1) @food 계정 팔로우 & 이 게시물 좋아요 2) 댓글로 "내 건강 레시피" 아이디어 작성 3) 친구 1명 태그 ✅ 기간: 5/15 ~ 5/19 ✅ 당첨 발표: 5/20 (DM 개별연락) ✅ 선물: 테크/비즈 관련 도서 or 커피 기프티콘',
    icon: "🎁",
    date: "5/19",
  },
  {
    id: "health-6",
    category: "health",
    title: "애호박 달걀볶음",
    description:
      "[단전은 이제 그만, 저염 간장으로 건강하게!] 🔍 재료: - 애호박 1/2개, 달걀 2개, 저염 간장 1큰술, 올리브유 레시피: 1) 애호박 썰어 가볍게 볶기 2) 달걀 풀어 넣고 스크램블처럼 섞기",
    icon: "🔍",
    date: "5/22",
  },
  {
    id: "health-7",
    category: "health",
    title: "오트밀 고구마죽",
    description:
      "[오트밀 고구마죽, 달콤 포근한 한 끼] ☕ 재료: - 고구마 1개, 오트밀 3큰술, 우유/두유 200ml, 시나몬가루·꿀·호두 약간 1) 고구마 삶아서 으깨 뒤, 오트밀+우유와 함께 냄비에",
    icon: "🍠",
    date: "5/25",
  },
  {
    id: "health-8",
    category: "health",
    title: "단호박 샐러드",
    description:
      "[레시피북 맛보기]📒 단호박 샐러드, 재료 3개면 끝! 🍠 재료: - 단호박 1/4통, 플레인 요거트 2큰술, 건크랜베리/견과류 약간 🧑‍🍳 만들기: 1) 단호박 전자레인지로 익힌 후 껍질 제거 2) 볼에 단호박+요거트+견크랜베리 섞기 3) 약간의 소금·후추 추가해도 좋아요",
    icon: "📚",
    date: "5/28",
  },
  {
    id: "health-9",
    category: "health",
    title: "일주일 식단 추천",
    description:
      "[일주일 건강 식단, 이렇게 어때요?] - 월: 버섯 두부덮밥 - 화: 아보카도 달걀 샌드위치 - 수: 애호박 달걀볶음 - 목: 닭가슴살 요거트 샐러드 - 금: 단호박 샐러드 - 토: 오트밀 고구마죽 - 일: 자유식 (단, 저염·저당 유의!)",
    icon: "📅",
    date: "5/31",
  },

  // 기존 콘텐츠 유지
  {
    id: "1",
    category: "daily",
    title: "타이틀이 가진 힘",
    description: "마케팅에서 제목은 절대 과소평가할 수 없는 힘이 있어요! ❤️",
    icon: "💻",
    date: "5/1",
  },
  {
    id: "2",
    category: "daily",
    title: "필수 마케팅 채널",
    description: "이제 시작해도 늦지 않았어요. 함께 성장해볼까요? 🙌 #마케팅채널",
    icon: "📊",
    date: "5/1",
  },
  {
    id: "4",
    category: "knowledge",
    title: "팔리는 콘텐츠",
    description: "좋은 콘텐츠는 팔리고, 나쁜 콘텐츠는 사라진다. 😉 치열한 당신의 콘텐츠는...",
    icon: "😀",
    date: "5/1",
  },
  {
    id: "5",
    category: "daily",
    title: "마케팅 TIP 이벤트",
    description: "제가 준비한 무료 선물 받으실 분? 실무에서 바로 쓰이는 마케팅 전자책 증정 이벤...",
    icon: "🎁",
    date: "5/1",
  },
  {
    id: "7",
    category: "knowledge",
    title: "콘텐츠 트렌드의 핵심",
    description: "콘텐츠의 트렌드는 매년 바뀌지만, 핵심은 같습니다. 🎯 고객과 공감하고, 가치 전달...",
    icon: "🎯",
    date: "5/1",
  },
  {
    id: "8",
    category: "fashion",
    title: "스토리텔링의 힘",
    description: "특별한 당신만의 이야기를 만들어 보세요! #스토리텔링마케팅 #콘텐츠팁",
    icon: "✨",
    date: "5/1",
  },
  {
    id: "9",
    category: "health",
    title: "밀스 2025 트렌드",
    description: "3가지 밀스 에서 활용 방법으로 브랜드 인지도를 배르게 높여보세요. 당신의 비즈...",
    icon: "🔥",
    date: "5/1",
  },
  {
    id: "11",
    category: "knowledge",
    title: "콘텐츠 기획 노하우",
    description: "10년차 마케터가 알려주는 콘텐츠 기획의 모든 것 #콘텐츠기획 #마케팅팁",
    icon: "📝",
    date: "5/1",
  },
  {
    id: "12",
    category: "self",
    title: "성장하는 마케터의 습관",
    description: "매일 1% 성장하는 마케터들의 5가지 공통점 #마케터성장 #습관형성",
    icon: "📈",
    date: "5/1",
  },
]
