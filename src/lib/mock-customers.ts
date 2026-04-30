/**
 * 역할: 테이블 공용 가짜 고객 데이터 풀 (50명)
 * 주요 기능: 이름·성별·생년·연락처·지역 다양화. 모든 고객 테이블이 동일 풀을 참조해 일관된 시뮬레이션.
 * 참고: 실제 데이터처럼 보이도록 마스킹된 한국식 이름 + 다양한 지역/연령대로 구성
 */

export type MockCustomer = {
  no: number
  name: string
  gender: "남성" | "여성"
  birth: string   // "1981.11.27 (44세)"
  phone: string   // "0507-1234-5678" or "010-1234-5678"
  region: string  // "서울특별시 강남구"
}

const NAMES_M = [
  "김*수", "이*혁", "박*준", "최*호", "정*훈",
  "강*민", "조*환", "윤*석", "장*우", "임*재",
  "한*빈", "오*용", "서*진", "신*태", "권*혁",
  "황*철", "안*범", "송*규", "류*환", "전*기",
  "홍*수", "고*민", "문*재", "양*수", "손*혁",
]

const NAMES_F = [
  "박*은", "최*영", "강*아", "조*은", "윤*경",
  "장*희", "임*지", "한*린", "오*린", "서*우",
  "신*아", "권*나", "황*연", "안*빈", "송*예",
  "류*아", "전*수", "홍*진", "고*원", "양*린",
  "손*영", "배*린", "백*진", "허*수", "유*아",
]

const REGIONS = [
  "서울특별시 강남구", "서울특별시 송파구", "서울특별시 마포구", "서울특별시 영등포구",
  "서울특별시 종로구", "서울특별시 성동구", "서울특별시 노원구", "서울특별시 관악구",
  "경기도 성남시 분당구", "경기도 수원시 영통구", "경기도 고양시 일산동구", "경기도 용인시 수지구",
  "경기도 부천시", "경기도 안산시 단원구", "경기도 화성시", "경기도 파주시",
  "인천광역시 연수구", "인천광역시 남동구", "인천광역시 부평구",
  "부산광역시 해운대구", "부산광역시 수영구", "부산광역시 동래구",
  "대구광역시 수성구", "대구광역시 달서구",
  "대전광역시 유성구", "대전광역시 서구",
  "광주광역시 서구", "광주광역시 북구",
  "울산광역시 남구", "세종특별자치시", "제주특별자치도 제주시",
  "강원특별자치도 춘천시", "충청북도 청주시", "충청남도 천안시 서북구",
  "전북특별자치도 전주시 완산구", "전라남도 여수시", "경상북도 포항시 북구", "경상남도 창원시 의창구",
]

// 50명 풀 — 각 인덱스마다 결정적(deterministic)으로 생성하여 페이지 새로고침해도 데이터 유지
export const MOCK_CUSTOMERS: MockCustomer[] = Array.from({ length: 50 }, (_, i) => {
  const isFemale = i % 2 === 1
  const namePool = isFemale ? NAMES_F : NAMES_M
  const name = namePool[Math.floor(i / 2) % namePool.length]

  // 생년: 1970~2005 분포
  const birthYear = 1970 + (i * 7) % 35
  const birthMonth = ((i * 3) % 12) + 1
  const birthDay = ((i * 11) % 27) + 1
  const age = 2026 - birthYear
  const birth = `${birthYear}.${String(birthMonth).padStart(2, "0")}.${String(birthDay).padStart(2, "0")} (${age}세)`

  // 전화번호: 010 또는 0507 prefix, 가운데/끝 4자리는 인덱스 기반 의사 랜덤
  const prefix = i % 4 === 0 ? "010" : "0507"
  const mid = String(1000 + (i * 137) % 9000).padStart(4, "0")
  const tail = String(2000 + (i * 271) % 8000).padStart(4, "0")
  const phone = `${prefix}-${mid}-${tail}`

  const region = REGIONS[i % REGIONS.length]

  return {
    no: 50 - i,
    name,
    gender: isFemale ? "여성" : "남성",
    birth,
    phone,
    region,
  }
})
