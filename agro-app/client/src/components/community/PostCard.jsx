import React, { useState, useEffect } from "react";
import {
  fetchCommentsForPost,
  addComment,
  updatePost,
  deletePost,
  voteOnComment,
} from "../../api/communityApi";
import { Comment } from "./Comment";

const UpvoteIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
);

const DownvoteIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const CommentIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const buildCommentTree = (comments) => {
  const commentMap = {};
  const tree = [];

  comments.forEach((comment) => {
    commentMap[comment._id] = { ...comment, children: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentComment) {
      if (commentMap[comment.parentComment]) {
        commentMap[comment.parentComment].children.push(
          commentMap[comment._id]
        );
      }
    } else {
      tree.push(commentMap[comment._id]);
    }
  });

  return tree;
};

export const PostCard = ({
  post,
  onVote,
  currentUser,
  onPostUpdated,
  onPostDeleted,
  accessToken,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchCommentsForPost(post._id)
        .then((data) => setComments(data.comments || []))
        .catch((error) => console.error("Error fetching comments:", error));
    }
  }, [showComments, post._id]);

  const isAuthor = currentUser?._id === post.author?._id;

  const handleCommentVote = async (commentId, voteType = "none") => {
    try {
      const updatedComment = await voteOnComment(
        commentId,
        voteType,
        accessToken
      );
      setComments(
        comments.map((c) =>
          c._id === updatedComment._id ? { ...c, ...updatedComment } : c
        )
      );
    } catch (error) {
      console.error("Failed to vote on comment:", error);
      alert(error.message);
    }
  };

  const handleSave = async () => {
    if (editedContent === post.content) {
      setIsEditing(false);
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedPost = await updatePost(
        post._id,
        { content: editedContent },
        accessToken
      );
      onPostUpdated(updatedPost);
      setIsEditing(false);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(post.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This cannot be undone."
      )
    ) {
      try {
        await deletePost(post._id, accessToken);
        onPostDeleted(post._id);
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleCommentDeleted = (deletedComment) => {
    console.log("PARENT RECEIVED:", deletedComment);
    setComments((prev) =>
      prev.map((c) =>
        c._id === deletedComment._id ? { ...c, ...deletedComment } : c
      )
    );
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === updatedComment._id ? { ...c, ...updatedComment } : c
      )
    );
  };

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div className="flex bg-white border border-gray-300 rounded-md hover:border-gray-500 mb-4">
      <div className="flex flex-col items-center bg-gray-50 p-2 rounded-l-md">
        <button
          onClick={() => onVote(post._id, "upvote")}
          className="p-1 rounded hover:bg-gray-200"
        >
          <UpvoteIcon className="w-6 h-6 text-gray-500 hover:text-orange-500" />
        </button>
        <span className="font-bold text-gray-800 my-1">
          {post?.upvotes?.length}
        </span>
        <button
          onClick={() => onVote(post._id, "downvote")}
          className="p-1 rounded hover:bg-gray-200"
        >
          <DownvoteIcon className="w-6 h-6 text-gray-500 hover:text-blue-600" />
        </button>
      </div>

      <div className="flex-grow p-4">
        <p className="text-xs text-gray-500 mb-2">
          Posted by u/{post.author?.name || "Anonymous"} •{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        {!isEditing ? (
          <div>
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
              <div className="mt-4 max-h-[500px] overflow-hidden rounded-md">
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows="5"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full disabled:bg-blue-300"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 text-sm font-bold text-gray-500">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <CommentIcon className="w-5 h-5" />
            <span>
              {comments.length > 0 ? `${comments.length} Comments` : "Comment"}
            </span>
          </button>
          {isAuthor && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded hover:bg-gray-100 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>

        {showComments && (
          <div className="p-5 border-t">
            <CommentForm
              postId={post._id}
              accessToken={accessToken}
              onCommentAdded={handleCommentAdded}
            />

            <div className="mt-6 space-y-5">
              {commentTree.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  currentUser={currentUser}
                  accessToken={accessToken}
                  onCommentAdded={handleCommentAdded}
                  onCommentVote={handleCommentVote}
                  onCommentDeleted={handleCommentDeleted}
                  onCommentUpdated={handleCommentUpdated}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentForm = ({
  postId,
  parentCommentId = null,
  accessToken,
  onCommentAdded,
  onCancel,
}) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    try {
      const newComment = await addComment({
        postId,
        message,
        parentCommentId,
        token: accessToken,
      });
      onCommentAdded(newComment);
      setMessage("");
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Could not post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        className="flex-grow bg-gray-100 border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Add a comment..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-600 text-white font-semibold px-4 rounded-md hover:bg-green-700 disabled:bg-green-300"
      >
        {isSubmitting ? "..." : "Post"}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      )}
    </form>
  );
};
