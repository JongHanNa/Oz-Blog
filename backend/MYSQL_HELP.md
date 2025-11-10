# MySQL 설정 도움말

## MySQL 비밀번호를 아시는 경우

backend/.env 파일을 수정하세요:
```
DB_USER=root
DB_PASSWORD=your_mysql_password_here
```

## MySQL 비밀번호를 모르시는 경우

### 방법 1: 새 사용자 생성 (권장)

1. MySQL 접속:
```bash
sudo mysql
```

2. 스크립트 실행:
```sql
source /Users/jonghanna/workspace/inputserver_myMac/Oz-Blog/backend/create_mysql_user.sql
exit;
```

3. backend/.env는 이미 설정되어 있습니다:
```
DB_USER=ozblog
DB_PASSWORD=ozblog123
```

4. 데이터베이스 설정:
```bash
npm run setup-db
```

### 방법 2: root 비밀번호 재설정

1. MySQL 중지:
```bash
brew services stop mysql
```

2. 안전 모드로 시작:
```bash
sudo mysqld_safe --skip-grant-tables &
```

3. 비밀번호 변경:
```bash
mysql -u root
```

MySQL에서:
```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
exit;
```

4. MySQL 재시작:
```bash
sudo killall mysqld
brew services start mysql
```

5. .env 파일 수정:
```
DB_USER=root
DB_PASSWORD=new_password
```

## 테스트

설정 후 테스트:
```bash
mysql -u ozblog -pozblog123 -e "SELECT 'Connected!' as status;"
```
