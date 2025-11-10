const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Database Setup Script
 * Creates database and all required tables
 */
async function setupDatabase() {
  let connection;

  try {
    // Connect without database selection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('📦 Starting database setup...\n');

    // Create database
    const dbName = process.env.DB_NAME || 'oz_blog';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' created`);

    await connection.query(`USE ${dbName}`);

    // 1. Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL,
        bio TEXT,
        profile_image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: users');

    // 2. Categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: categories');

    // Insert default categories
    await connection.query(`
      INSERT IGNORE INTO categories (name, description) VALUES
      ('개발', '프로그래밍 및 개발 관련 글'),
      ('디자인', '디자인 및 UI/UX 관련 글'),
      ('일상', '일상 생활 및 개인적인 이야기'),
      ('기타', '기타 주제')
    `);
    console.log('✅ Default categories inserted');

    // 3. Posts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        thumbnail VARCHAR(500),
        author_id INT NOT NULL,
        category_id INT,
        view_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_author (author_id),
        INDEX idx_category (category_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: posts');

    // 4. Tags table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: tags');

    // 5. Post-Tags junction table (N:M relationship)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: post_tags');

    // 6. Comments table (with self-reference for nested replies)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        parent_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
        INDEX idx_post (post_id),
        INDEX idx_parent (parent_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: comments');

    // 7. Likes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS likes (
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: likes');

    // 8. Bookmarks table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table: bookmarks');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('  - 8 tables created');
    console.log('  - 4 default categories added');
    console.log('  - Ready to use!\n');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = setupDatabase;
