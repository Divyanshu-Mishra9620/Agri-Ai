const API_BASE_URL = "http://localhost:5000/api";

export const fetchAllPosts = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch posts");
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createPost = async (postData, token) => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: postData,
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

export const fetchCommentsForPost = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${postId}/comments`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    const comments = await response.json();
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const addComment = async ({
  postId,
  message,
  token,
  parentCommentId = null,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/comments/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, parentCommentId }),
      }
    );
    if (!response.ok) throw new Error("Failed to add comment");

    const comment = await response.json();
    console.log("Comment added successfully:", comment);
    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const voteOnPost = async (postId, voteType, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ voteType }),
    });
    if (!response.ok) throw new Error("Failed to vote");
    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error("Error voting on post:", error);
    throw error;
  }
};

export const updatePost = async (postId, postData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update post");
    }

    const updated = await response.json();
    return updated;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (postId, token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete post");
    const data = await res.json();
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const editComment = async (commentId, message, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to edit comment");
    }
    return response.json();
  } catch (error) {
    console.error("Error editing comment:", error);
    throw error;
  }
};

export const voteOnComment = async (commentId, voteType, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/vote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ voteType }),
    });
    if (!response.ok) throw new Error("Failed to vote on comment");
    const updatedComment = await response.json();
    return updatedComment;
  } catch (error) {
    console.error("Error voting on comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete comment");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
