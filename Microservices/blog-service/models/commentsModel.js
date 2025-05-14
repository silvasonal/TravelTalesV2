const commentsDAO = require('../daos/commentsDao');

const createComment = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { postId } = req.params;
    const { comment } = req.body;

    const newComment = await commentsDAO.createComment(user_id, postId, comment);
    res.status(201).json({
      message: 'Comment created successfully',
      comment: {
        id: newComment.id,
        user_id: newComment.user_id,
        post_id: newComment.post_id,
        comment: newComment.comment,
      },
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Error creating comment' });
  }
}

const updateComment = async (req, res) => {
  try {
    const {comment_id } = req.params;
    const { comment } = req.body;

    const updatedComment = await commentsDAO.updateComment(comment_id, comment);
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found or not authorized' });
    }

    res.status(200).json({
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Error updating comment' });
  }
}

const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const user_id = req.user.userId;


    const deletedComment = await commentsDAO.deleteComment(comment_id);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({
      message: 'Comment deleted successfully',
      deletedComment,
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Error deleting comment' });
  }
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};