<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Global Weather & Exchange Rate

전 세계 날씨 정보와 환율 정보를 제공하는 웹 애플리케이션입니다. Gemini AI를 활용하여 실시간 날씨 예보와 환율 정보를 생성합니다.

## 주요 기능

- 🌍 전 세계 도시 날씨 정보 (5일 예보, 3시간 간격)
- 💱 실시간 환율 정보 (KRW 기준)
- 📍 현재 위치 기반 날씨 정보
- ⭐ 즐겨찾기 도시 관리
- 📱 반응형 디자인 (모바일 친화적)
- 🎨 현대적인 UI/UX

## 기술 스택

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Netlify Serverless Functions
- **AI**: Google Gemini AI
- **배포**: Netlify

## 로컬 개발 환경 설정

1. 저장소 클론
```bash
git clone <repository-url>
cd global-weather-exchange-rate
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 Gemini API 키를 추가하세요:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. 개발 서버 실행
```bash
npm run dev
```

5. Netlify Functions 로컬 테스트 (선택사항)
```bash
npx netlify dev
```

## Netlify 배포

### 1. Netlify CLI 설치
```bash
npm install -g netlify-cli
```

### 2. Netlify 로그인
```bash
netlify login
```

### 3. 환경 변수 설정
Netlify 대시보드에서 다음 환경 변수를 설정하세요:
- `GEMINI_API_KEY`: Google Gemini API 키

### 4. 배포
```bash
# 빌드
npm run build

# 배포
netlify deploy --prod
```

또는 GitHub 저장소를 Netlify에 연결하여 자동 배포를 설정할 수 있습니다.

## API 엔드포인트

### 날씨 정보
- `GET /.netlify/functions/getWeatherData?city={city_name}`
- 도시 이름으로 5일 날씨 예보 조회

### 환율 정보
- `GET /.netlify/functions/getExchangeRate`
- KRW 기준 실시간 환율 정보 조회

### 역지오코딩
- `GET /.netlify/functions/getReverseGeoData?lat={latitude}&lon={longitude}`
- 좌표로 도시 정보 조회

## 프로젝트 구조

```
├── components/          # React 컴포넌트
├── netlify/
│   └── functions/      # Serverless Functions
├── services/           # API 서비스
├── types.ts           # TypeScript 타입 정의
├── constants.ts       # 상수 정의
├── App.tsx           # 메인 앱 컴포넌트
└── index.tsx         # 앱 진입점
```

## 라이선스

MIT License

## 기여

이슈나 풀 리퀘스트를 통해 기여해 주세요.
