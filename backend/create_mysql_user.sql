-- MySQL 사용자 생성 스크립트
-- 이 파일을 MySQL에서 실행하여 새 사용자를 생성합니다

-- 1. 새 사용자 생성 (비밀번호: ozblog123)
CREATE USER IF NOT EXISTS 'ozblog'@'localhost' IDENTIFIED BY 'ozblog123';

-- 2. oz_blog 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON oz_blog.* TO 'ozblog'@'localhost';

-- 3. 데이터베이스 생성 권한 부여
GRANT CREATE ON *.* TO 'ozblog'@'localhost';

-- 4. 권한 적용
FLUSH PRIVILEGES;

-- 5. 확인
SELECT User, Host FROM mysql.user WHERE User = 'ozblog';
SHOW GRANTS FOR 'ozblog'@'localhost';
