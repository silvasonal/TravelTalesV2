// daos/likeDao.js
const pool = require('../config/db');

const getLikeStatus = async (userId, postId) => {
    const result = await pool.query(
        'SELECT type FROM likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
    );
    return result.rows[0];
};

const updateLike = async (userId, postId, type) => {
    const result = await pool.query(
        'UPDATE likes SET type = $3 WHERE user_id = $1 AND post_id = $2 RETURNING *',
        [userId, postId, type]
    );
    return result.rows[0];
};

const insertLike = async (userId, postId, type) => {
    const result = await pool.query(
        'INSERT INTO likes (user_id, post_id, type) VALUES ($1, $2, $3) RETURNING *',
        [userId, postId, type]
    );
    return result.rows[0];
};

const deleteLike = async (userId, postId) => {
    const result = await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING *',
        [userId, postId]
    );
    return result.rows[0];
};

module.exports = {
    getLikeStatus,
    updateLike,
    insertLike,
    deleteLike
};
