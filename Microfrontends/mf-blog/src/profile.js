import { useEffect, useState } from 'react';
import { getProfile, getPostsByUserId, likePost, unlikePost, deletePost, followUser, unfollowUser } from './services/apiService';
import PostCard from './SharedComponents/PostCard';
import { jwtDecode } from 'jwt-decode';
import { BsPersonCircle, } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const [userId, setUserId] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [modalContent, setModalContent] = useState([]);
    const [modalTitle, setModalTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const { authorId } = useParams();
    const authorIdFromParams = parseInt(authorId)


    useEffect(() => {
        if (profileData?.user?.username) {
            if (!authorIdFromParams || authorIdFromParams === userId) {
                setIsOwnProfile(true);
            } else {
                setIsOwnProfile(false);
            }
        }
    }, [authorIdFromParams, userId, profileData]);


    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
    }, [token]);

    useEffect(() => {
        if (userId || authorIdFromParams) {
            fetchProfileData();
            fetchPosts();
        }
    }, [userId, authorIdFromParams]);

    const fetchProfileData = async () => {
        try {
            const response = await getProfile(authorIdFromParams ? authorIdFromParams : userId , token);
            setProfileData(response.profileData);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await getPostsByUserId(authorIdFromParams ? authorIdFromParams : userId, token);
            setPosts(response.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await likePost(postId, token);
            fetchPosts();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDislike = async (postId) => {
        try {
            const response = await unlikePost(postId, token);
            fetchPosts();
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
            const response = await deletePost(postId, token);
            setSnackbar({ open: true, message: 'Post deleted successfully', severity: 'success' });
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete post', error);
            setSnackbar({ open: true, message: 'Failed to delete post', severity: 'error' });
        }
    };

    const handleFollow = async (followedUserId) => {
        try{
            const response = await followUser(followedUserId, token);
            fetchProfileData();
        }catch(error){
            console.error('Error following user:', error);
        } 
    }

    const handleUnfollow = async (followedUserId) => {
        try{
            const response = await unfollowUser(followedUserId, token);
            fetchProfileData();
        }catch(error){
            console.error('Error unfollowing user:', error);
        }
    }

    const openModal = (type) => {
        if (type === 'followers') {
            setModalContent(profileData.followers);
            setModalTitle('Followers');
        } else {
            setModalContent(profileData.following);
            setModalTitle('Following');
        }
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    return (
        <div className="profile-page">
            {profileData && (
                <div className="profile-content">
                    <div className="profile-header">
                        <p className="profile-info">
                            <BsPersonCircle className="nav-icon" /> {profileData.user.username}
                        </p>
                        <div className="profile-stats">
                            <p className="profile-info">
                                <span className="link-text" onClick={() => openModal('followers')}>
                                    {profileData.followersCount} Followers
                                </span>
                            </p>
                            <p className="profile-info">
                                <span className="link-text" onClick={() => openModal('following')}>
                                    {profileData.followingCount} Following
                                </span>
                            </p>
                        </div>
                    </div>

                    {!isOwnProfile && (
                        <div className="follow-buttons">
                            <button
                                className={`follow-btn ${profileData.followers.some(follower => follower.id === userId) ? 'unfollow' : 'follow'}`}
                                onClick={() => {
                                   const isFollwing = profileData.followers.some(follower => follower.id === userId);
                                   isFollwing 
                                   ? handleUnfollow(profileData.user.id)
                                   : handleFollow(profileData.user.id)
                                }}
                            >
                                {profileData.followers.some(follower  => follower.id === userId) ? 'Unfollow' : 'Follow'}
                            </button>
                        </div>
                    )}



                    <div className="posts-container">
                        {posts.length > 0 ? (
                            posts.map((post) => (
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

                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{modalTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ul className="custom-list">
                                {modalContent.map((item, index) => (
                                    <li key={index} className="list-item">
                                        {item.username}
                                    </li>
                                ))}
                            </ul>
                        </Modal.Body>
                    </Modal>
                </div>
            )}

            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />

        </div>
    );
};

export default Profile;
