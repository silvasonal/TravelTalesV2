import axios from 'axios';

export const loginUser = async (email ,password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const registerUser = async (username,email,password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/register', { username,email,password });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const getPublicPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/publicPosts');
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const getFollowedPosts = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:5000/auth/followingPosts/${userId}`,{
          headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const likePost = async (postId, token) => {
    try {
      const response = await axios.post(`http://localhost:5000/auth/likePost/${postId}`,{},{
          headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const unlikePost = async (postId, token) => {
    try {
      const response = await axios.post(`http://localhost:5000/auth/unLikePost/${postId}`,{},{
          headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
}


export const createPost = async (title, content, country, date_of_visit, token) => {
  try {
    const response = await axios.post('http://localhost:5000/auth/createPost', { title, content, country, date_of_visit }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (postId, title, content, country, date_of_visit, token) => {
  try {
    const response = await axios.put(`http://localhost:5000/auth/updatePost/${postId}`, { title, content, country, date_of_visit }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getProfile = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:5000/auth/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getPostsByUserId = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:5000/auth/posts/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deletePost = async (postId, token) => {
  try {
    const response = await axios.delete(`http://localhost:5000/auth/deletePost/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const getPostByPostId = async (postId, token) => {
  try {
    const response = await axios.get(`http://localhost:5000/auth/getPost/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const followUser = async (followUserId, token) => {
  try {
    const response = await axios.post(`http://localhost:5000/auth/follow/${followUserId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const unfollowUser = async (followingUserId, token) => {
  try {
    const response = await axios.delete(`http://localhost:5000/auth/unfollow/${followingUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const searchPosts = async ({ username, country }) => {
  try {

    const response = await axios.get('http://localhost:5000/auth/posts/search', {
      params: { username, country }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const followingPostsBySearch = async (userId, token, {username, country}) => {
  try {
    const response = await axios.get(`http://localhost:5000/auth/followingPostsBySearch/${userId}?username=${username}&country=${country}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createComment = async (postId, comment, token) => {

  try {
    const response = await axios.post(`http://localhost:5000/auth/createComment/${postId}`, { comment }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const updateComment = async (commentId, comment, token) => {
  try {
    const response = await axios.put(`http://localhost:5000/auth/updateComment/${commentId}`, { comment }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(`http://localhost:5000/auth/deleteComment/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const getAllUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/auth/users');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.post('http://localhost:5000/auth/passwordReset', { email, newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getCountryData = async (countryCode) => {
  try {
    const response = await axios.get(`http://localhost:7000/country/${countryCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
