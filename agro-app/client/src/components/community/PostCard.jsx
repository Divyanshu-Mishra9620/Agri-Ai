import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchCommentsForPost,
  addComment,
  updatePost,
  deletePost,
  voteOnComment,
} from "../../api/communityApi";
import { Comment } from "./Comment";

// Modern Icons with better styling
const UpvoteIcon = ({ className, filled, size = "w-5 h-5" }) => (
  <svg
    className={`${className} ${size} transition-all duration-200`}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke={!filled ? "currentColor" : "none"}
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

const DownvoteIcon = ({ className, filled, size = "w-5 h-5" }) => (
  <svg
    className={`${className} ${size} transition-all duration-200`}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke={!filled ? "currentColor" : "none"}
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const CommentIcon = ({ size = "w-5 h-5" }) => (
  <svg
    className={`${size} transition-all duration-200`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const ShareIcon = ({ size = "w-5 h-5" }) => (
  <svg
    className={`${size} transition-all duration-200`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-2.684 2.684m0 0a3 3 0 00-2.684-2.684m0 0a3 3 0 10-2.684-2.684"
    />
  </svg>
);

const SaveIcon = ({ filled, size = "w-5 h-5" }) => (
  <svg
    className={`${size} transition-all duration-200`}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

const MoreIcon = ({ size = "w-5 h-5" }) => (
  <svg
    className={`${size} transition-all duration-200`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

const EditIcon = ({ size = "w-4 h-4" }) => (
  <svg
    className={`${size} transition-all duration-200`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = ({ size = "w-4 h-4" }) => (
  <svg
    className={`${size} transition-all duration-200`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const formatTimeAgo = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return postDate.toLocaleDateString();
};

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

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const voteVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

const commentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isAuthor = currentUser?._id === post.author?._id;
  const voteCount = post?.upvotes?.length || 0;

  useEffect(() => {
    if (currentUser && post.upvotes?.includes(currentUser._id)) {
      setUserVote("upvote");
    } else if (currentUser && post.downvotes?.includes(currentUser._id)) {
      setUserVote("downvote");
    } else {
      setUserVote(null);
    }
  }, [post.upvotes, post.downvotes, currentUser]);

  useEffect(() => {
    if (showComments) {
      fetchCommentsForPost(post._id)
        .then((data) => setComments(data.comments || []))
        .catch((error) => console.error("Error fetching comments:", error));
    }
  }, [showComments, post._id]);

  const handleVote = (voteType) => {
    if (!currentUser) {
      alert("Please login to vote");
      return;
    }

    const newVoteType = userVote === voteType ? "none" : voteType;
    setUserVote(newVoteType === "none" ? null : newVoteType);
    onVote(post._id, newVoteType);
  };

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
    setComments((prev) =>
      prev.map((c) => {
        if (c._id === deletedComment._id) {
          return {
            ...c,
            isDeleted: true,
            message: "[deleted]",
            author: { name: "[deleted]" },
          };
        }
        return c;
      })
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
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 mb-6 overflow-visible"
    >
      <div className="flex">
        {/* Voting Section */}
        <div className="flex flex-col items-center bg-gray-50 px-3 py-4 min-w-[60px]">
          <motion.button
            variants={voteVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleVote("upvote")}
            className={`p-2 rounded-full transition-all duration-200 ${
              userVote === "upvote"
                ? "text-orange-500 bg-orange-50"
                : "text-gray-400 hover:text-orange-500 hover:bg-orange-50"
            }`}
          >
            <UpvoteIcon size="w-6 h-6" />
          </motion.button>

          <motion.span
            className={`font-bold text-sm my-2 transition-colors duration-200 ${
              voteCount > 0
                ? "text-orange-500"
                : voteCount < 0
                ? "text-blue-500"
                : "text-gray-500"
            }`}
            animate={{ scale: userVote ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {voteCount}
          </motion.span>

          <motion.button
            variants={voteVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleVote("downvote")}
            className={`p-2 rounded-full transition-all duration-200 ${
              userVote === "downvote"
                ? "text-blue-500 bg-blue-50"
                : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            <DownvoteIcon size="w-6 h-6" />
          </motion.button>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {(post.author?.name || "A")[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  u/{post.author?.name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative z-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <MoreIcon />
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setIsSaved(!isSaved);
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <SaveIcon filled={isSaved} size="w-4 h-4" />
                        <span>{isSaved ? "Unsave" : "Save"}</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <ShareIcon size="w-4 h-4" />
                        <span>Share</span>
                      </button>
                      {isAuthor && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <EditIcon />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDelete();
                              setMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <DeleteIcon />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed mb-4">
                  {post.content}
                </p>
                {post.imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 max-h-[500px] overflow-hidden rounded-lg border border-gray-200"
                  >
                    <img
                      src={post.imageUrl}
                      alt="Post content"
                      className="w-full h-auto object-contain"
                    />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
                  rows="5"
                  placeholder="What's on your mind?"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:bg-green-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showComments
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <CommentIcon />
                <span>
                  {comments.length > 0
                    ? `${comments.length} Comments`
                    : "Comment"}
                </span>
              </motion.button>
            </div>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                variants={commentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mt-6 pt-6 border-t border-gray-100"
              >
                <CommentForm
                  postId={post._id}
                  accessToken={accessToken}
                  onCommentAdded={handleCommentAdded}
                />

                <div className="mt-6 space-y-4">
                  {commentTree.map((comment, index) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Comment
                        comment={comment}
                        postId={post._id}
                        currentUser={currentUser}
                        accessToken={accessToken}
                        onCommentAdded={handleCommentAdded}
                        onCommentVote={handleCommentVote}
                        onCommentDeleted={handleCommentDeleted}
                        onCommentUpdated={handleCommentUpdated}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
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
    <motion.form
      onSubmit={handleSubmit}
      className="flex gap-3 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-sm">U</span>
      </div>
      <div className="flex-grow">
        <input
          type="text"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          placeholder="Add a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isSubmitting || !message.trim()}
        className="bg-green-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isSubmitting ? "Posting..." : "Post"}
      </motion.button>
      {onCancel && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200"
        >
          Cancel
        </motion.button>
      )}
    </motion.form>
  );
};
