const pool = require('../config/db');

const followUser = async (follower_id, following_id) => {
  const result = await pool.query(
    'INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) ON CONFLICT (follower_id, following_id) DO NOTHING RETURNING *',
    [follower_id, following_id]
  );
  return result.rows[0];
};

const unfollowUser = async (follower_id, following_id) => {
  const result = await pool.query(
    'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2 RETURNING *',
    [follower_id, following_id]
  );
  return result.rows[0];
};

const getUserById = async (userId) => {
  const result = await pool.query(`SELECT username, id FROM users WHERE id = $1`, [userId]);
  return result.rows[0];
};

const getFollowers = async (userId) => {
  const result = await pool.query(
    `SELECT users.username, users.id FROM followers JOIN users ON followers.follower_id = users.id WHERE followers.following_id = $1`,
    [userId]
  );
  return result.rows;
};

const getFollowing = async (userId) => {
  const result = await pool.query(
    `SELECT users.username, users.id FROM followers JOIN users ON followers.following_id = users.id WHERE followers.follower_id = $1`,
    [userId]
  );
  return result.rows;
};

const getFollowersCount = async (userId) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS count FROM followers WHERE following_id = $1`,
    [userId]
  );
  return result.rows[0].count;
};

const getFollowingCount = async (userId) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS count FROM followers WHERE follower_id = $1`,
    [userId]
  );
  return result.rows[0].count;
};

const getFollowingIds = async (userId) => {
  const result = await pool.query(
    `SELECT following_id FROM followers WHERE follower_id = $1`,
    [userId]
  );
  return result.rows.map(row => row.following_id);
};

const getFollowingPostsByUserIds = async (userIds) => {

  const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');

  const result = await pool.query(
    `SELECT posts.*, 
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

     WHERE posts.user_id IN (${placeholders})
     `,
    userIds
  );
  return result.rows;
};

const searchByFollowingPosts = async (userIds, username, country) => {
  const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');

  try{
  let query = `
    SELECT posts.*, 
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
        ) c ON posts.id = c.post_id `;
          
  let queryParams = [...userIds];
  let conditions = []; 

  if (username) {
    conditions.push(`LOWER(users.username) LIKE LOWER($${queryParams.length + 1})`);
    queryParams.push(`%${username}%`);
  }

  if (country) {
    conditions.push(`LOWER(posts.country) LIKE LOWER($${queryParams.length + 1})`);
    queryParams.push(`%${country}%`);
  }

  if (conditions.length > 0) {
    query += ` WHERE posts.user_id IN (${placeholders}) AND ` + conditions.join(' AND ');  }

    const result = await pool.query(query, queryParams);
    return result.rows;

  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};


module.exports = {
  followUser,
  unfollowUser,
  getUserById,
  getFollowers,
  getFollowing,
  getFollowersCount,
  getFollowingCount,
  getFollowingIds,
  getFollowingPostsByUserIds,
  searchByFollowingPosts
};
