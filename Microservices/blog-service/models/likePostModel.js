const likeDao = require('../daos/LikesDao');

const likePost = async (req, res,) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const existing = await likeDao.getLikeStatus(userId, postId);

    if (existing) {
      if (existing.type === 1) {
        const deleteLike = await likeDao.deleteLike(userId, postId);
        return res.status(200).json({
          message: 'Post like removed',
          data: deleteLike
        });
      }

      if (existing.type === -1) {
        const updated = await likeDao.updateLike(userId, postId, 1);
        return res.status(200).json({
          message: 'Post liked',
          data: updated
        });
      }
    }

    const inserted = await likeDao.insertLike(userId, postId, 1);
    res.status(200).json({
      message: 'Post liked successfully',
      data: inserted
    });

  } catch (error) {
    console.error('Error in likePost:', error.message);
    res.status(500).json({ error: 'Error liking post' });
  }
};

const unlikePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.userId;

  try {
    const existing = await likeDao.getLikeStatus(userId, postId);

    if (existing) {
      if (existing.type === -1) {
        const deleteLike = await likeDao.deleteLike(userId, postId);
        return res.status(200).json({
          message: 'Post unlike removed',
          data: deleteLike
        });
      }

      if (existing.type === 1) {
        const updated = await likeDao.updateLike(userId, postId, -1);
        return res.status(200).json({
          message: 'Post unliked',
          data: updated
        });
      }
    }

    const inserted = await likeDao.insertLike(userId, postId, -1);
    res.status(200).json({
      message: 'Post unliked successfully',
      data: inserted
    });

  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Error unliking post' });
  }
};

module.exports = { likePost, unlikePost };

