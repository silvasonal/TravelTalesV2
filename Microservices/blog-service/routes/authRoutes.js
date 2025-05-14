const express = require('express');
const useModel = require('../models/userModel');
const lodingInfoModel = require('../models/loginInfoModel');
const blogPostsModel = require('../models/blogPostsModel');
const followersModel = require('../models/followersModel');
const likePostModel = require('../models/likePostModel');
const commentsModel = require('../models/commentsModel');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', useModel.registerUser);
router.post('/login', lodingInfoModel.loginUser);
router.post('/createPost', authenticateToken, blogPostsModel.createPost);
router.put('/updatePost/:postId', authenticateToken, blogPostsModel.updatePost);
router.delete('/deletePost/:postId', authenticateToken, blogPostsModel.deletePost);
router.get('/getPost/:postId', authenticateToken, blogPostsModel.getPostByPostId);

router.get('/publicPosts', blogPostsModel.getPublicPosts);
router.get('/posts/search', blogPostsModel.searchPosts);
router.get('/posts/:userId',authenticateToken, blogPostsModel.getUserPostsById);

router.post('/follow/:id', authenticateToken, followersModel.followUser);
router.delete('/unfollow/:id', authenticateToken, followersModel.unfollowUser);
router.get('/profile/:id', authenticateToken ,followersModel.getUserProfile);

router.get('/followingPosts/:id', authenticateToken, followersModel.getFollowingPosts);
router.get('/followingPostsBySearch/:id', authenticateToken, followersModel.getFollowingPostsBySearch);

router.post('/likePost/:postId', authenticateToken, likePostModel.likePost);
router.post('/unLikePost/:postId', authenticateToken, likePostModel.unlikePost);

router.post('/createComment/:postId', authenticateToken, commentsModel.createComment);
router.put('/updateComment/:comment_id', authenticateToken, commentsModel.updateComment);    
router.delete('/deleteComment/:comment_id', authenticateToken, commentsModel.deleteComment);

router.get('/users', useModel.getAllUsers);
router.post('/passwordReset', useModel.passwordReset);

module.exports = router;