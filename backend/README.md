# Oz-Blog Backend API

Express.js + MySQL + JWT로 구축된 블로그 백엔드 API입니다.

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=oz_blog
JWT_SECRET=your_super_secret_key
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. 데이터베이스 설정

MySQL이 설치되어 있고 실행 중인지 확인한 후:

```bash
npm run setup-db
```

이 명령은 다음을 수행합니다:
- `oz_blog` 데이터베이스 생성
- 8개의 테이블 생성 (users, categories, posts, tags, post_tags, comments, likes, bookmarks)
- 기본 카테고리 삽입

### 4. 서버 실행

**개발 모드 (nodemon):**
```bash
npm run dev
```

**프로덕션 모드:**
```bash
npm start
```

서버가 `http://localhost:3001`에서 실행됩니다.

## 📊 데이터베이스 스키마

### 테이블 구조 (8개)

1. **users** - 사용자 정보
2. **categories** - 카테고리
3. **posts** - 게시글
4. **tags** - 태그
5. **post_tags** - 게시글-태그 연결 (N:M)
6. **comments** - 댓글 (계층 구조)
7. **likes** - 좋아요
8. **bookmarks** - 북마크

## 🔌 API 엔드포인트

### 인증 (Authentication)

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보 (🔒 인증 필요)

### 게시글 (Posts)

- `GET /api/posts` - 게시글 목록 (페이지네이션, 검색, 필터)
- `GET /api/posts/:id` - 게시글 상세
- `POST /api/posts` - 게시글 작성 (🔒 인증 필요)
- `PUT /api/posts/:id` - 게시글 수정 (🔒 작성자만)
- `DELETE /api/posts/:id` - 게시글 삭제 (🔒 작성자만)

### 댓글 (Comments)

- `GET /api/comments/post/:postId` - 특정 게시글의 댓글 목록
- `POST /api/comments` - 댓글 작성 (🔒 인증 필요)
- `DELETE /api/comments/:id` - 댓글 삭제 (🔒 작성자만)

### 인터랙션 (Interactions)

- `POST /api/interactions/like/:postId` - 좋아요 토글 (🔒 인증 필요)
- `POST /api/interactions/bookmark/:postId` - 북마크 토글 (🔒 인증 필요)

### 카테고리 (Categories)

- `GET /api/categories` - 카테고리 목록

### 사용자 (Users)

- `GET /api/users/:id` - 사용자 프로필 조회
- `PUT /api/users/profile` - 프로필 수정 (🔒 인증 필요)

## 🔐 인증

JWT(JSON Web Token) 기반 인증을 사용합니다.

### 인증이 필요한 요청

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3001/api/auth/me
```

### 토큰 만료

토큰은 7일 후 만료됩니다.

## 📝 사용 예시

### 회원가입

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "테스트사용자"
  }'
```

### 로그인

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 게시글 작성

```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "첫 번째 게시글",
    "content": "# 제목\n\n마크다운 내용",
    "tags": ["개발", "React"]
  }'
```

### 게시글 목록 조회 (검색, 필터, 페이지네이션)

```bash
# 기본 목록
curl http://localhost:3001/api/posts

# 검색
curl "http://localhost:3001/api/posts?search=React"

# 카테고리 필터
curl "http://localhost:3001/api/posts?category=개발"

# 태그 필터
curl "http://localhost:3001/api/posts?tag=React"

# 페이지네이션
curl "http://localhost:3001/api/posts?page=2&limit=20"
```

## 🛠️ 프로젝트 구조

```
backend/
├── src/
│   ├── config/          # 데이터베이스 설정
│   │   ├── db.js
│   │   └── dbSetup.js
│   ├── controllers/     # 요청 처리
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   ├── interactionController.js
│   │   ├── categoryController.js
│   │   └── userController.js
│   ├── middlewares/     # JWT 인증 등
│   │   └── authMiddleware.js
│   ├── routes/          # API 라우트
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── interactionRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── userRoutes.js
│   ├── services/        # 비즈니스 로직
│   │   ├── authService.js
│   │   ├── postService.js
│   │   ├── commentService.js
│   │   ├── interactionService.js
│   │   ├── categoryService.js
│   │   └── userService.js
│   └── index.js         # 서버 시작
├── .env
├── .env.example
├── package.json
└── README.md
```

## 🔧 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| DB_HOST | MySQL 호스트 | localhost |
| DB_USER | MySQL 사용자 | root |
| DB_PASSWORD | MySQL 비밀번호 | - |
| DB_NAME | 데이터베이스 이름 | oz_blog |
| JWT_SECRET | JWT 시크릿 키 | - |
| PORT | 서버 포트 | 3001 |
| NODE_ENV | 환경 모드 | development |
| CORS_ORIGIN | CORS 허용 오리진 | http://localhost:3000 |

## ⚠️ 보안 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- `JWT_SECRET`은 안전한 랜덤 문자열로 설정하세요
- 프로덕션 환경에서는 HTTPS를 사용하세요
- 데이터베이스 비밀번호는 강력하게 설정하세요

## 🐛 문제 해결

### 데이터베이스 연결 실패

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**해결책:**
1. MySQL이 실행 중인지 확인: `mysql --version`
2. `.env` 파일의 DB 설정이 올바른지 확인
3. MySQL 서비스 시작: `brew services start mysql` (macOS)

### 포트 이미 사용 중

```
Error: listen EADDRINUSE: address already in use :::3001
```

**해결책:**
1. 실행 중인 프로세스 종료: `lsof -ti:3001 | xargs kill -9`
2. 또는 `.env`에서 다른 포트 사용

## 📄 라이선스

MIT License
