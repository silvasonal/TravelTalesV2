import  { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import TextInput from './SharedComponents/TextInput';
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import { createComment, updateComment, deleteComment,getAllUsers } from './services/apiService';
import { FaTrashAlt } from 'react-icons/fa';

const PostModal = ({ show, handleClose, post, userId }) => {
    const token = localStorage.getItem('token');
    const [comment, setAddNewComment] = useState('');
    const [showComments, setShowComments] = useState([]);
    const [existingComment, setExistingComment] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [users, setUsers] = useState([]);


    useEffect(() => {
        if (show) {
            fetchPostComments();
            fetchUsers(); 
        }
    }, [show]);

    const fetchPostComments = () => {
        const comments = post?.comments || [];
        setShowComments(comments);

        const userComment = comments.find(c => c.userId === userId);
        if (userComment) {
            setExistingComment(true);
            setAddNewComment(userComment.comment);
        } else {
            setExistingComment(false);
            setAddNewComment('');
        }
    };

    const addComment = async () => {
        try {
            if (existingComment) {
                const currentUserComment = showComments.find(comment => comment.userId === userId);
                await updateComment(currentUserComment.commentId, comment, token);
                setSnackbar({ open: true, message: 'Updated comment', severity: 'success' });

                // Update the comment in the local state
                const updatedComments = showComments.map(commentObj =>
                    commentObj.commentId === currentUserComment.commentId
                        ? { ...commentObj, comment: comment }
                        : commentObj
                );

                setShowComments(updatedComments);

                // Update the comment in the post object 
                post.comments = updatedComments;
        

            } else {
                const newComment = await createComment(post.id, comment, token);
                setSnackbar({ open: true, message: 'Created new comment', severity: 'success' });


                // Create a new comment object with the userId
                const newCommentObj  = {
                    ...newComment,
                    comment: comment,
                    userId: userId,
                    commentId: newComment.comment.id, 
                }

                // Add the new comment to the local state
                const updatedComments = [...showComments, newCommentObj];
                setShowComments(updatedComments);

                // Update the comment in the post object
                post.comments = updatedComments;
                
            }
            handleClose();
        } catch (error) {
            console.error('Error handling comment:', error);
            setSnackbar({ open: true, message: 'Error handling comment', severity: 'error' });
        }
    };

    const handleDeleteComment = async () => {
        try {
            const currentUserComment = showComments.find(comment => comment.userId === userId);
            await deleteComment(currentUserComment.commentId, token);
            setSnackbar({ open: true, message: 'Deleted comment', severity: 'success' });

            const updatedComments = showComments.filter(
                commentObj => commentObj.commentId !== currentUserComment.commentId
            );

            setShowComments(updatedComments);
            // Update the post object 
            if (post.comments) {
                post.comments = updatedComments;
            }

            handleClose();
        } catch (error) {
            console.error('Error deleting comment:', error);
            setSnackbar({ open: true, message: 'Error deleting comment', severity: 'error' });
        }
    };


    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response); 
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const showCommentUserName = (userId) => {
        const user = users.find(user => user.id === userId); 
        if (user) {
            return user.username;
        } else {
            return '';  
        }
    };
    
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {token && (
                    <TextInput
                        id="comment"
                        label="Comment"
                        type="text"
                        value={comment}
                        onChange={(e) => setAddNewComment(e.target.value)}
                        placeholder="Add a comment..."
                    />
                    )}

                    {token && (
                    <div className="postModal-actions-container">
                        <span onClick={handleDeleteComment} className="actions-button delete-icon" title="Delete Comment">
                            <FaTrashAlt />
                        </span>
                        
                        <button className="postModal-updateButton" onClick={addComment}>
                            {existingComment ? 'Update' : 'Add'}
                        </button>
                    </div>
                    )}

                    <div className="comments-list">
                        {showComments.length > 0 ? (
                            showComments.map((commentObj) => (
                                <div key={commentObj.commentId || commentObj.id} className="comment-item">
                                    <p>
                                        <span className="comment-text"><strong>{commentObj.comment}</strong></span> 
                                        <span className="username">{showCommentUserName(commentObj.userId)}</span>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>
                </Modal.Body>
            </Modal>

            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        </>
    );
};

export default PostModal;
