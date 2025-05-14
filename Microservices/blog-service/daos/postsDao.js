const pool = require('../config/db');

const createBlogPost = async (user_id, title, content, country, date_of_visit) => {
  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, title, content, country, date_of_visit) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, content, country, date_of_visit]
    );
    return result.rows[0];

  } catch (error) {
    console.error('Error in createPost:', error);
    throw new Error('Error creating post');
  }
};

const updateBlogPost = async (post_id, user_id, title, content, country, date_of_visit) => {
  try {
    const result = await pool.query(
      `UPDATE posts SET title = $1, content = $2, country = $3, date_of_visit = $4  WHERE id = $5 AND user_id = $6 RETURNING *`,
      [title, content, country, date_of_visit, post_id, user_id]
    );
    return result.rows[0];

  } catch (error) {
    console.error('Error in updatePost:', error);
    throw new Error('Error updating post');
  }
};

const deleteBlogPost = async (post_id, user_id) => {
  try {

    await pool.query(
      'DELETE FROM likes WHERE post_id = $1',
      [post_id]
    );

    await pool.query(
      'DELETE FROM comments WHERE post_id = $1',
      [post_id]
    );
    
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *',
      [post_id, user_id]
    );

    return result.rows[0];

  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    throw new Error('Error deleting post');
  }
};

const getPostByPostId = async (post_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [post_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in getPostByPostId:', error);
    throw new Error('Error fetching post');
  }
};

const getAllPublicPosts = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        posts.*, 
        users.username,

        -- Use pre-aggregated likes/dislikes from subquery "l"
        -- COALESCE ensures that if no likes exist, we return 0 instead of NULL
        COALESCE(l.likes, 0) AS likes,
        COALESCE(l.dislikes, 0) AS dislikes,

        -- COALESCE ensures an empty array is returned instead of NULL for likedBy/dislikedBy
        COALESCE(l.likedBy, ARRAY[]::INTEGER[]) AS "likedBy",
        COALESCE(l.dislikedBy, ARRAY[]::INTEGER[]) AS "dislikedBy",

        -- COALESCE ensures comments is an empty array if there are no comments
        COALESCE(c.comments, '[]') AS comments
      FROM posts
      JOIN users ON posts.user_id = users.id

      -- Subquery to pre-aggregate likes and prevent row duplication
      LEFT JOIN (
        SELECT 
          post_id,
          COUNT(*) FILTER (WHERE type = 1) AS likes,
          COUNT(*) FILTER (WHERE type = -1) AS dislikes,
          ARRAY_AGG(user_id) FILTER (WHERE type = 1) AS likedBy,
          ARRAY_AGG(user_id) FILTER (WHERE type = -1) AS dislikedBy
        FROM likes
        GROUP BY post_id
      ) l ON posts.id = l.post_id

      -- Subquery to aggregate comments per post into a JSON array
      LEFT JOIN (
        SELECT 
          post_id,
          JSON_AGG(DISTINCT jsonb_build_object(
            'commentId', id,
            'comment', comment,
            'userId', user_id,
            'postId', post_id
          )) AS comments
        FROM comments
        GROUP BY post_id
      ) c ON posts.id = c.post_id
    `);

    return result.rows;
  } catch (error) {
    console.error('Error in getAllPublicPosts:', error);
    throw new Error('Error fetching public posts');
  }
};


const searchBy = async (username, country) => {
  try {
    // Start building base query with necessary joins to aggregated subqueries
    let query = `
      SELECT 
        posts.*,
        users.username,

        -- Ensure like/dislike counts and user arrays are correct using pre-aggregated subquery
        COALESCE(l.likes, 0) AS likes,
        COALESCE(l.dislikes, 0) AS dislikes,
        COALESCE(l.likedBy, ARRAY[]::INTEGER[]) AS "likedBy",
        COALESCE(l.dislikedBy, ARRAY[]::INTEGER[]) AS "dislikedBy",

        -- COALESCE empty array of comments if none exist
        COALESCE(c.comments, '[]') AS comments

      FROM posts

      -- Join user data
      JOIN users ON posts.user_id = users.id

      -- Join likes subquery (pre-aggregated per post)
      LEFT JOIN (
        SELECT 
          post_id,
          COUNT(*) FILTER (WHERE type = 1) AS likes,
          COUNT(*) FILTER (WHERE type = -1) AS dislikes,
          ARRAY_AGG(user_id) FILTER (WHERE type = 1) AS likedBy,
          ARRAY_AGG(user_id) FILTER (WHERE type = -1) AS dislikedBy
        FROM likes
        GROUP BY post_id
      ) l ON posts.id = l.post_id

      -- Join comments subquery (pre-aggregated JSON array per post)
      LEFT JOIN (
        SELECT 
          post_id,
          JSON_AGG(DISTINCT jsonb_build_object(
            'commentId', id,
            'comment', comment,
            'userId', user_id,
            'postId', post_id
          )) AS comments
        FROM comments
        GROUP BY post_id
      ) c ON posts.id = c.post_id
    `;

    let queryParams = [];
    let conditions = [];

    // Filter by username (case-insensitive)
    if (username) {
      conditions.push(`LOWER(users.username) LIKE LOWER($${queryParams.length + 1})`);
      queryParams.push(`%${username}%`);
    }

    // Filter by country (case-insensitive)
    if (country) {
      conditions.push(`LOWER(posts.country) LIKE LOWER($${queryParams.length + 1})`);
      queryParams.push(`%${country}%`);
    }

    // Add WHERE clause if there are any filters
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await pool.query(query, queryParams);
    return result.rows;

  } catch (error) {
    console.error('Error in searchBy:', error);
    throw new Error('Error fetching posts by username or country');
  }
};


const getPostsById = async (userId) => {
  try {
    const result = await pool.query(`
      SELECT posts.*, 
        users.username,
        COUNT(likes.*) FILTER (WHERE likes.type = 1) AS likes,
        COUNT(likes.*) FILTER (WHERE likes.type = -1) AS dislikes,
        ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = 1) AS "likedBy",
        ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = -1) AS "dislikedBy",
        COALESCE(
          JSON_AGG(
            DISTINCT jsonb_build_object( 
              'commentId', comments.id,
              'comment', comments.comment,
              'userId', comments.user_id,
              'postId', comments.post_id
            )
          ) FILTER (WHERE comments.id IS NOT NULL),
             '[]'
          ) AS comments
      FROM posts 
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      LEFT JOIN comments ON posts.id = comments.post_id
      WHERE posts.user_id = $1
      GROUP BY posts.id, users.username` ,
      [userId]
    );

    return result.rows;

  } catch (error) {
    console.error('Error in getPostsById:', error);
    throw new Error('Error fetching public posts');
  }
};


module.exports = { createBlogPost, updateBlogPost, deleteBlogPost,getPostByPostId, getAllPublicPosts, searchBy, getPostsById};
