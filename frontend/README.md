# Oz-Blog Frontend

Next.js + TypeScript + Tailwind CSS로 구축된 블로그 프론트엔드입니다.

## 🚀 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

개발 서버: http://localhost:3000

## 📦 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🧪 린트

```bash
npm run lint
```

## 📝 환경 변수

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📚 폴더 구조

```
src/
├── app/              # Next.js App Router 페이지
├── components/       # React 컴포넌트
│   ├── ui/          # 재사용 UI 컴포넌트
│   ├── forms/       # 폼 컴포넌트
│   └── layout/      # 레이아웃 컴포넌트
├── lib/             # 유틸리티 & API
├── store/           # Zustand 상태 관리
└── types/           # TypeScript 타입 정의
```

## 🎨 주요 기능

- ✅ JWT 기반 인증
- ✅ 마크다운 에디터 & 렌더링
- ✅ 게시글 CRUD
- ✅ 댓글 시스템 (대댓글)
- ✅ 좋아요 & 북마크
- ✅ 검색 & 필터링
- ✅ 반응형 디자인

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Markdown**: react-markdown
- **Syntax Highlighting**: react-syntax-highlighter
