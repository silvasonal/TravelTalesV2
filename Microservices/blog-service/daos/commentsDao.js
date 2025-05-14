const pool = require('../config/db');

const createComment = async (user_id, post_id, comment) => {
  try {
    const result = await pool.query(
      'INSERT INTO comments (user_id, post_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [user_id, post_id, comment]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in createComment:', error);
    throw new Error('Error creating comment');
  }
}

const updateComment = async (comment_id, comment) => {
  try {

    if (!comment_id || isNaN(Number(comment_id))) {
      throw new Error('Invalid comment ID');
    }

    const result = await pool.query(
      `UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *`,
      [comment, comment_id ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateComment:', error);
    throw new Error('Error updating comment');
  }
}

const deleteComment = async (comment_id) => {
  try {
    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 RETURNING *',
      [comment_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in deleteComment:', error);
    throw new Error('Error deleting comment');
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
}