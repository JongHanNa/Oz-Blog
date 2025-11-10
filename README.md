# 📝 Oz-Blog - 마크다운 블로그 플랫폼

완전한 풀스택 블로그/커뮤니티 플랫폼 프로젝트입니다.

## ✨ 주요 기능

- ✅ **회원가입/로그인 시스템** - JWT 기반 인증
- ✅ **게시글 CRUD** - 마크다운 에디터 지원
- ✅ **댓글 시스템** - 대댓글 지원
- ✅ **좋아요 & 북마크** - 인터랙션 기능
- ✅ **카테고리 & 태그** - 게시글 분류
- ✅ **검색 & 필터링** - 게시글 검색
- ✅ **사용자 프로필** - 프로필 관리
- ✅ **반응형 디자인** - 모바일 지원

## 🛠️ 기술 스택

### 백엔드
- **런타임**: Node.js (v18+)
- **프레임워크**: Express.js
- **데이터베이스**: MySQL (8.0+)
- **인증**: JWT (jsonwebtoken)
- **보안**: bcrypt

### 프론트엔드
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **마크다운**: react-markdown + react-syntax-highlighter

## 📁 프로젝트 구조

```
oz-blog/
├── backend/                # 백엔드 (준비 중)
│   ├── src/
│   │   ├── config/        # DB 설정
│   │   ├── controllers/   # 요청 처리
│   │   ├── middlewares/   # JWT 인증
│   │   ├── routes/        # API 라우트
│   │   ├── services/      # 비즈니스 로직
│   │   └── index.js       # 서버 시작
│   └── package.json
│
└── frontend/              # 프론트엔드 (완성)
    ├── src/
    │   ├── app/          # Next.js 페이지
    │   ├── components/   # React 컴포넌트
    │   ├── lib/          # API, 유틸리티
    │   ├── store/        # Zustand 상태 관리
    │   └── types/        # TypeScript 타입
    └── package.json
```

## 🚀 시작하기

### 1. 프론트엔드 설정

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

### 2. 백엔드 설정 (추후 구현)

백엔드 API는 아직 구현되지 않았습니다. 다음 단계로 백엔드를 구현할 예정입니다:

1. Express 서버 기본 설정
2. MySQL 데이터베이스 설계 & 생성
3. JWT 인증 시스템
4. 게시글 CRUD API
5. 댓글 시스템 API
6. 좋아요 & 북마크 API

## 📄 환경 변수

### 프론트엔드 (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 백엔드 (.env) - 추후 설정

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=oz_blog
JWT_SECRET=your_secret_key
PORT=3001
```

## 🗄️ 데이터베이스 설계

### 주요 테이블 (8개)

1. **users** - 사용자 정보
2. **categories** - 카테고리
3. **posts** - 게시글
4. **tags** - 태그
5. **post_tags** - 게시글-태그 연결 (N:M)
6. **comments** - 댓글 (계층 구조)
7. **likes** - 좋아요
8. **bookmarks** - 북마크

## 📚 주요 페이지

- `/` - 홈페이지
- `/posts` - 게시글 목록
- `/posts/new` - 게시글 작성
- `/posts/[id]` - 게시글 상세
- `/login` - 로그인
- `/signup` - 회원가입

## 🎨 주요 컴포넌트

### UI 컴포넌트
- `PostCard` - 게시글 카드
- `CommentList` - 댓글 목록
- `SearchBar` - 검색바
- `Loading` - 로딩 스피너

### 폼 컴포넌트
- `MarkdownEditor` - 마크다운 에디터

### 레이아웃 컴포넌트
- `Navbar` - 네비게이션 바
- `Footer` - 푸터

## 🔐 인증 시스템

- JWT 토큰 기반 인증
- localStorage에 토큰 저장
- Zustand를 통한 인증 상태 관리
- 보호된 라우트 (로그인 필요)

## 📝 마크다운 기능

- 실시간 미리보기
- 코드 하이라이팅 (Prism.js)
- GitHub Flavored Markdown 지원
- 이미지, 링크, 테이블 등 지원

## 🎯 다음 단계

### 우선순위 높음
1. ✅ 프론트엔드 완성 (완료)
2. ⏳ 백엔드 API 구현 (진행 예정)
3. ⏳ 데이터베이스 설정
4. ⏳ 백엔드-프론트엔드 연동

### 추가 기능 (향후)
- [ ] 이미지 업로드 (AWS S3, Cloudinary)
- [ ] 실시간 알림 (WebSocket)
- [ ] SEO 최적화
- [ ] 마이페이지 구현
- [ ] 배포 (Vercel + PlanetScale)

## 📖 개발 가이드

### 컴포넌트 추가
```typescript
// src/components/ui/NewComponent.tsx
'use client';

export default function NewComponent() {
  return <div>New Component</div>;
}
```

### API 호출 추가
```typescript
// src/lib/api.ts
export const newApi = {
  async newMethod(): Promise<ApiResponse> {
    return apiRequest('/new-endpoint');
  },
};
```

### 상태 관리 추가
```typescript
// src/store/newStore.ts
import { create } from 'zustand';

interface NewState {
  data: any;
  fetchData: () => Promise<void>;
}

export const useNewStore = create<NewState>((set) => ({
  data: null,
  fetchData: async () => {
    // Implementation
  },
}));
```

## 🤝 기여하기

이 프로젝트는 학습 목적으로 만들어졌습니다. 기여는 환영합니다!

## 📄 라이선스

MIT License

---

**Made with ❤️ using Next.js, TypeScript, and Tailwind CSS**
