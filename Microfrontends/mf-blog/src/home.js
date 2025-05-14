import React, { useEffect, useState } from 'react';
import './styles/index.css';
import { getPublicPosts, getFollowedPosts, likePost, unlikePost, searchPosts, deletePost,followingPostsBySearch } from './services/apiService';
import PostCard from './SharedComponents/PostCard';
import { jwtDecode } from 'jwt-decode';
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const [activeTab, setActiveTab] = useState('public');
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filterOption, setFilterOption] = useState('recent'); 
  const [currentPage, setCurrentPage] = useState(1); //first page will be shown initially.

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const queryParams = new URLSearchParams(location.search);
  const searchusername = queryParams.get('username');
  const searchcountry = queryParams.get('country');

  const postsPerPage = 3; // Number of posts per page
  const totalPages = Math.ceil(posts.length / postsPerPage); // Total number of pages based on posts length
  const indexOfLastPost = currentPage * postsPerPage; // Index of the last post on the current page
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // Index of the first post on the current page
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // Current posts to be displayed in the page


  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

 
  useEffect(() => {
    fetchData();
  }, [activeTab, userId, token, searchusername, searchcountry,filterOption]);

  const fetchData = async () => {
    try {
      let fetchedPosts = [];
  
      if (activeTab === 'public') {
        if (searchusername || searchcountry) {
          const response = await searchPosts({ username: searchusername, country: searchcountry });
          fetchedPosts = response.results;
        } else {
          const response = await getPublicPosts();
          fetchedPosts = response.posts;
        }
      } else if (activeTab === 'following' && userId) {
        if (searchusername || searchcountry) {
          const response = await followingPostsBySearch(userId, token, { username: searchusername, country: searchcountry });
          fetchedPosts = response.posts;
        } else {
          const response = await getFollowedPosts(userId, token);
          fetchedPosts = response.posts;
        }
      }
  
      if (filterOption === "liked"){
        fetchedPosts.sort((a,b) => (b.likes || 0) - (a.likes || 0));
      }else {
        fetchedPosts.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      }
  
      setPosts(fetchedPosts);
      setCurrentPage(1); // Reset to the first page whenever posts change
    
    } catch (error) {
      setPosts([]);
      console.error('Error fetching posts:', error);
    }
  };
  

  const handleLike = async (postId) => {
    try {
      await likePost(postId, token);
      fetchData();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await unlikePost(postId, token);
      fetchData();
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  }

  const handleUpdate = (postId) => {
    setTimeout(() => {
      navigate(`/update/${postId}`);
    }, 1500);
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId, token);
      setSnackbar({ open: true, message: 'Post deleted successfully', severity: 'success' });
      fetchData();
    } catch (error) {
      console.error('Failed to delete post', error);
      setSnackbar({ open: true, message: 'Failed to delete post', severity: 'error' });
    }
  };

  return (
    <div className='home-container'>
      <div className='toggle-buttons'>
        <button className={activeTab === 'public' ? "active" : ""}
          onClick={() => setActiveTab('public')}> For You
        </button>

        {token && (
          <button className={activeTab === 'following' ? "active" : ""}
            onClick={() => setActiveTab('following')}> Following
          </button>
        )}
      </div>

      
      <div className="filter-options">
        <button
          className={filterOption === 'recent' ? 'active' : ''}
          onClick={() => setFilterOption('recent')}
        >
          Most Recent
        </button>
        <button
          className={filterOption === 'liked' ? 'active' : ''}
          onClick={() => setFilterOption('liked')}
        >
          Most Liked
        </button>
      </div>


      <div className="posts-container">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userId={userId}
              onLike={handleLike}
              onDislike={handleDislike}
              onUpdate={() => handleUpdate(post.id)}
              onDelete={() => handleDelete(post.id)}
            />
          ))
        ) : (
          <div className="no-posts-message">
            <p>No posts to show.</p>
          </div>
        )}
      </div>

      {currentPosts.length > 0 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ◀ Previous
          </button>

            <span style={{ margin: '0 10px'}}>
              Page {currentPage} of {totalPages}
            </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
       )}

      <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </div>
  );
};

export default Home;
