# 🚀 Oz-Blog 설치 및 실행 가이드

완전한 풀스택 블로그 플랫폼 설치 가이드입니다.

## 📋 사전 요구사항

### 필수 프로그램
- **Node.js** (v18 이상) - https://nodejs.org/
- **MySQL** (8.0 이상) - https://dev.mysql.com/downloads/
- **Git** - https://git-scm.com/

### 설치 확인
```bash
node --version   # v18.0.0 이상
npm --version    # 8.0.0 이상
mysql --version  # 8.0 이상
```

---

## 🗄️ 1단계: MySQL 데이터베이스 준비

### MySQL 시작
```bash
# macOS (Homebrew)
brew services start mysql

# Windows
# MySQL Workbench 또는 서비스 관리자에서 MySQL 시작

# Linux
sudo systemctl start mysql
```

### MySQL 로그인 테스트
```bash
mysql -u root -p
# 비밀번호 입력 후 연결되면 성공
```

---

## 💻 2단계: 백엔드 설정 및 실행

### 2.1 백엔드 디렉토리로 이동
```bash
cd backend
```

### 2.2 의존성 설치
```bash
npm install
```

### 2.3 환경 변수 설정
`.env` 파일을 수정하여 MySQL 비밀번호를 설정하세요:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here    # ← 여기에 MySQL 비밀번호 입력
DB_NAME=oz_blog
JWT_SECRET=oz_blog_secret_key_dev_only
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 2.4 데이터베이스 초기화
```bash
npm run setup-db
```

**실행 결과:**
```
📦 Starting database setup...

✅ Database 'oz_blog' created
✅ Table: users
✅ Table: categories
✅ Default categories inserted
✅ Table: posts
✅ Table: tags
✅ Table: post_tags
✅ Table: comments
✅ Table: likes
✅ Table: bookmarks

🎉 Database setup completed successfully!
```

### 2.5 백엔드 서버 실행
```bash
npm run dev
```

**실행 결과:**
```
🚀 Oz-Blog Backend Server
✅ Database connected successfully
📍 Server running on http://localhost:3001
🌐 API available at http://localhost:3001/api
📊 Health check: http://localhost:3001/health
🔧 Environment: development
```

### 2.6 API 테스트
새 터미널을 열고:
```bash
curl http://localhost:3001/health
```

**응답:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

---

## 🎨 3단계: 프론트엔드 설정 및 실행

### 3.1 새 터미널에서 프론트엔드로 이동
```bash
# 새 터미널 열기
cd frontend
```

### 3.2 의존성 설치
```bash
npm install
```

### 3.3 환경 변수 확인
`.env.local` 파일이 이미 설정되어 있습니다:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3.4 프론트엔드 서버 실행
```bash
npm run dev
```

**실행 결과:**
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.3s
```

---

## 🎉 4단계: 애플리케이션 접속

### 웹 브라우저에서 접속
```
http://localhost:3000
```

### 첫 사용자 등록
1. **회원가입** 클릭
2. 이메일, 비밀번호, 사용자 이름 입력
3. 회원가입 완료

### 첫 게시글 작성
1. **글쓰기** 클릭
2. 제목과 내용을 마크다운으로 작성
3. 태그 추가 (선택사항)
4. **게시하기** 클릭

---

## 📊 5단계: 동작 확인

### ✅ 확인 항목

- [ ] 회원가입이 정상적으로 동작하는가?
- [ ] 로그인 후 사용자 이름이 표시되는가?
- [ ] 게시글 작성이 가능한가?
- [ ] 마크다운이 정상적으로 렌더링되는가?
- [ ] 댓글 작성이 가능한가?
- [ ] 좋아요 버튼이 동작하는가?
- [ ] 북마크 버튼이 동작하는가?
- [ ] 게시글 검색이 동작하는가?
- [ ] 카테고리 필터링이 동작하는가?

---

## 🛠️ 문제 해결

### MySQL 연결 오류
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**해결 방법:**
1. MySQL이 실행 중인지 확인
2. MySQL 비밀번호가 `.env` 파일에 올바르게 설정되었는지 확인
3. 포트 3306이 차단되지 않았는지 확인

### 포트 사용 중 오류 (백엔드)
```
Error: listen EADDRINUSE: address already in use :::3001
```

**해결 방법:**
```bash
# 프로세스 종료
lsof -ti:3001 | xargs kill -9

# 또는 .env에서 다른 포트 사용
PORT=3002
```

### 포트 사용 중 오류 (프론트엔드)
```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결 방법:**
```bash
# 프로세스 종료
lsof -ti:3000 | xargs kill -9

# 또는 다른 포트로 실행
PORT=3002 npm run dev
```

### 모듈을 찾을 수 없음
```
Error: Cannot find module 'express'
```

**해결 방법:**
```bash
# 백엔드 또는 프론트엔드 폴더에서
rm -rf node_modules package-lock.json
npm install
```

### 데이터베이스 테이블이 없음
```
Error: Table 'oz_blog.users' doesn't exist
```

**해결 방법:**
```bash
cd backend
npm run setup-db
```

---

## 🔐 보안 권장사항

### 개발 환경
- ✅ 기본 설정 그대로 사용 가능

### 프로덕션 환경
1. **JWT_SECRET 변경**
   ```bash
   # 안전한 랜덤 문자열 생성
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **HTTPS 사용**
   - 프로덕션에서는 반드시 HTTPS 사용

3. **환경 변수 보호**
   - `.env` 파일은 Git에 커밋하지 않기
   - 프로덕션 서버에서 환경 변수 안전하게 관리

4. **CORS 설정**
   ```env
   CORS_ORIGIN=https://yourdomain.com
   ```

---

## 📚 추가 리소스

### API 문서
- 백엔드 API: http://localhost:3001/api
- API 상세 문서: `backend/README.md` 참조

### 프로젝트 구조
```
oz-blog/
├── backend/          # Express.js API 서버
│   ├── src/
│   │   ├── config/      # DB 설정
│   │   ├── controllers/ # 요청 처리
│   │   ├── middlewares/ # 인증 미들웨어
│   │   ├── routes/      # API 라우트
│   │   ├── services/    # 비즈니스 로직
│   │   └── index.js     # 서버 시작점
│   └── package.json
│
└── frontend/         # Next.js 웹 앱
    ├── src/
    │   ├── app/        # 페이지
    │   ├── components/ # React 컴포넌트
    │   ├── lib/        # API 클라이언트
    │   ├── store/      # Zustand 상태 관리
    │   └── types/      # TypeScript 타입
    └── package.json
```

### 기술 스택
- **Backend**: Node.js, Express.js, MySQL, JWT, bcrypt
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Zustand
- **Features**: 마크다운 에디터, 댓글 시스템, 좋아요/북마크, 검색/필터링

---

## 🎯 다음 단계

### 학습 및 실습
1. 코드 분석하기
2. 새로운 기능 추가해보기
3. 디자인 커스터마이징하기

### 추가 기능 개발 (선택사항)
- [ ] 이미지 업로드 기능
- [ ] 실시간 알림
- [ ] 사용자 팔로우 시스템
- [ ] 게시글 공유 기능
- [ ] 다크 모드

### 배포
- **프론트엔드**: Vercel (https://vercel.com)
- **백엔드**: Railway, Render, DigitalOcean
- **데이터베이스**: PlanetScale, AWS RDS

---

**문제가 있으신가요?**
- README.md 파일 참조
- GitHub Issues에 질문 등록

**즐거운 개발 되세요! 🚀**
