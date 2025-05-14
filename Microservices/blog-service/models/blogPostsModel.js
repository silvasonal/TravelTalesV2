const blogPostsDAO = require('../daos/postsDao');

const createPost = async (req, res) => {
  try {
    const { title, content, country, date_of_visit } = req.body;
    const user_id = req.user.userId;

    const post = await blogPostsDAO.createBlogPost(user_id, title, content, country, date_of_visit);
    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        country: post.country,
        date_of_visit: post.date_of_visit,
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const post_id = req.params.postId;
    const user_id = req.user.userId;
    const { title, content, country, date_of_visit } = req.body;

    const updatedPost = await blogPostsDAO.updateBlogPost(post_id, user_id, title, content, country, date_of_visit);
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found or not authorized' });
    }

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Error updating post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const deletedPost = await blogPostsDAO.deleteBlogPost(postId, userId);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({
      message: 'Post deleted successfully',
      deletedPost,
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
};

const getPostByPostId =  async (req, res) => {
  try {
    const postId = req.params.postId;
    const result = await blogPostsDAO.getPostByPostId(postId);
    res.status(200).json({
      message: 'Post fetched successfully',
      post: result,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPublicPosts = async (req, res) => {
  try {
    const result = await blogPostsDAO.getAllPublicPosts();
    res.status(200).json({
      message: 'Public posts fetched successfully',
      posts: result,
    });
  } catch (error) {
    console.error('Error fetching public posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const searchPosts = async (req, res) => {
  try {
    const { username, country } = req.query;
    const posts = await blogPostsDAO.searchBy(username, country);

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.status(200).json({
      message: 'Posts found',
      results: posts,
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserPostsById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await blogPostsDAO.getPostsById(userId);

    res.status(200).json({
      message: 'User posts fetched successfully',
      posts: result,
    });
 
  } catch (error) {
    console.error('Error fetching user post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostByPostId,
  getPublicPosts,
  searchPosts,
  getUserPostsById,
};
