const { pool } = require('../config/db');

/**
 * Get all posts with pagination and filters
 */
exports.getAllPosts = async (page = 1, limit = 10, category, tag, search, userId = null) => {
  const connection = await pool.getConnection();

  try {
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = '1=1';
    const params = [];

    if (category) {
      whereClause += ' AND c.name = ?';
      params.push(category);
    }

    if (tag) {
      whereClause += ' AND EXISTS (SELECT 1 FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id AND t.name = ?)';
      params.push(tag);
    }

    if (search) {
      whereClause += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await connection.query(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get posts with author, category, tags, and like count
    const query = `
      SELECT
        p.id,
        p.title,
        p.content,
        p.thumbnail,
        p.author_id,
        p.category_id,
        p.view_count,
        p.created_at,
        p.updated_at,
        u.username AS author_name,
        u.profile_image AS author_image,
        c.name AS category_name,
        COUNT(DISTINCT l.user_id) AS like_count,
        GROUP_CONCAT(DISTINCT t.name) AS tags,
        ${userId ? `EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ${userId}) AS is_liked,` : 'FALSE AS is_liked,'}
        ${userId ? `EXISTS(SELECT 1 FROM bookmarks WHERE post_id = p.id AND user_id = ${userId}) AS is_bookmarked` : 'FALSE AS is_bookmarked'}
      FROM posts p
      INNER JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE ${whereClause}
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [posts] = await connection.query(query, [...params, limit, offset]);

    // Process tags
    posts.forEach(post => {
      post.tags = post.tags ? post.tags.split(',') : [];
      post.is_liked = Boolean(post.is_liked);
      post.is_bookmarked = Boolean(post.is_bookmarked);
    });

    return {
      posts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    };
  } finally {
    connection.release();
  }
};

/**
 * Get post by ID
 */
exports.getPostById = async (postId, userId = null) => {
  const connection = await pool.getConnection();

  try {
    // Increment view count
    await connection.query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [postId]);

    // Get post with all details
    const query = `
      SELECT
        p.*,
        u.username AS author_name,
        u.profile_image AS author_image,
        c.name AS category_name,
        COUNT(DISTINCT l.user_id) AS like_count,
        GROUP_CONCAT(DISTINCT t.name) AS tags,
        ${userId ? `EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ${userId}) AS is_liked,` : 'FALSE AS is_liked,'}
        ${userId ? `EXISTS(SELECT 1 FROM bookmarks WHERE post_id = p.id AND user_id = ${userId}) AS is_bookmarked` : 'FALSE AS is_bookmarked'}
      FROM posts p
      INNER JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `;

    const [posts] = await connection.query(query, [postId]);

    if (posts.length === 0) {
      throw new Error('게시글을 찾을 수 없습니다');
    }

    const post = posts[0];
    post.tags = post.tags ? post.tags.split(',') : [];
    post.is_liked = Boolean(post.is_liked);
    post.is_bookmarked = Boolean(post.is_bookmarked);

    return post;
  } finally {
    connection.release();
  }
};

/**
 * Create new post
 */
exports.createPost = async (postData, authorId) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert post
    const [result] = await connection.query(
      'INSERT INTO posts (title, content, thumbnail, author_id, category_id) VALUES (?, ?, ?, ?, ?)',
      [postData.title, postData.content, postData.thumbnail || null, authorId, postData.category_id || null]
    );

    const postId = result.insertId;

    // Handle tags
    if (postData.tags && postData.tags.length > 0) {
      for (const tagName of postData.tags) {
        // Insert tag if not exists, get tag ID
        const [tagResult] = await connection.query(
          'INSERT INTO tags (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
          [tagName]
        );

        const tagId = tagResult.insertId;

        // Link post and tag
        await connection.query(
          'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
          [postId, tagId]
        );
      }
    }

    await connection.commit();

    return postId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Update post
 */
exports.updatePost = async (postId, postData, authorId) => {
  const connection = await pool.getConnection();

  try {
    // Check if user is the author
    const [posts] = await connection.query('SELECT author_id FROM posts WHERE id = ?', [postId]);

    if (posts.length === 0) {
      throw new Error('게시글을 찾을 수 없습니다');
    }

    if (posts[0].author_id !== authorId) {
      throw new Error('권한이 없습니다');
    }

    await connection.beginTransaction();

    // Update post
    await connection.query(
      'UPDATE posts SET title = ?, content = ?, thumbnail = ?, category_id = ? WHERE id = ?',
      [postData.title, postData.content, postData.thumbnail || null, postData.category_id || null, postId]
    );

    // Update tags
    if (postData.tags) {
      // Remove existing tags
      await connection.query('DELETE FROM post_tags WHERE post_id = ?', [postId]);

      // Add new tags
      for (const tagName of postData.tags) {
        const [tagResult] = await connection.query(
          'INSERT INTO tags (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
          [tagName]
        );

        const tagId = tagResult.insertId;

        await connection.query(
          'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
          [postId, tagId]
        );
      }
    }

    await connection.commit();

    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Delete post
 */
exports.deletePost = async (postId, authorId) => {
  const connection = await pool.getConnection();

  try {
    // Check if user is the author
    const [posts] = await connection.query('SELECT author_id FROM posts WHERE id = ?', [postId]);

    if (posts.length === 0) {
      throw new Error('게시글을 찾을 수 없습니다');
    }

    if (posts[0].author_id !== authorId) {
      throw new Error('권한이 없습니다');
    }

    // Delete post (CASCADE will delete related records)
    await connection.query('DELETE FROM posts WHERE id = ?', [postId]);

    return true;
  } finally {
    connection.release();
  }
};
