const followersDao = require('../daos/followersDao');

const followUser = async (req, res) => {
  try {
    const follower_id = req.user.userId;
    const following_id = parseInt(req.params.id);

    if (follower_id === following_id) {
      return res.status(400).json({ error: "You can't follow yourself." });
    }

    const result = await followersDao.followUser(follower_id, following_id);
    if (!result) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    res.status(200).json({
      message: 'User followed successfully',
      data: result
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Error following user' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const follower_id = req.user.userId;
    const following_id = parseInt(req.params.id);

    const result = await followersDao.unfollowUser(follower_id, following_id);
    if (!result) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    res.status(200).json({
      message: 'User unfollowed successfully',
      data: result
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ error: 'Error unfollowing user' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await followersDao.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const followers = await followersDao.getFollowers(userId);
    const following = await followersDao.getFollowing(userId);
    const followersCount = await followersDao.getFollowersCount(userId);
    const followingCount = await followersDao.getFollowingCount(userId);

    res.status(200).json({
      message: 'User profile fetched successfully',
      profileData: {
        user,
        followers,
        following,
        followersCount,
        followingCount
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (req.user.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to posts' });
    }

    const followingIds = await followersDao.getFollowingIds(userId);
    if (followingIds.length === 0) {
      return res.status(200).json({ message: 'No followed users', posts: [] });
    }

    const posts = await followersDao.getFollowingPostsByUserIds(followingIds);

    res.status(200).json({
      message: 'Following posts fetched successfully',
      posts
    });
  } catch (error) {
    console.error('Get following posts error:', error);
    res.status(500).json({ error: 'Error fetching posts from following users' });
  }
};

const getFollowingPostsBySearch = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, country } = req.query;

    if (req.user.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to posts' });
    }   
    
    const followingIds = await followersDao.getFollowingIds(userId);
    if (followingIds.length === 0) {
      return res.status(200).json({ message: 'No followed users', posts: [] });
    }

    const posts = await followersDao.searchByFollowingPosts(followingIds,username, country);
    

    res.status(200).json({
      message: 'Search Following posts fetched successfully',
      posts
    });
  } catch (error) {
    console.error('Get following posts error:', error);
    res.status(500).json({ error: 'Error fetching posts from following users' });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getUserProfile,
  getFollowingPosts,
  getFollowingPostsBySearch
};
