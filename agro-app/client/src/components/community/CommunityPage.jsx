import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllPosts, createPost, voteOnPost } from "../../api/communityApi";
import { CreatePostForm } from "./CreatePostForm";
import { PostCard } from "./PostCard";
import useAuth from "../../hooks/useAuth";

// Modern Icons
const LeafIcon = ({ size = "w-8 h-8" }) => (
  <svg
    className={`${size} text-green-600 transition-all duration-200`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const LoadingIcon = ({ size = "w-6 h-6" }) => (
  <svg
    className={`${size} animate-spin text-green-600`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const ErrorIcon = ({ size = "w-6 h-6" }) => (
  <svg
    className={`${size} text-red-500`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RefreshIcon = ({ size = "w-5 h-5" }) => (
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
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const postVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const loadingVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const errorVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const CommunityPage = () => {
  const { user: currentUser, accessToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await fetchAllPosts();
      setPosts(data.posts || []);
      setError(null);
    } catch (err) {
      setError("Could not fetch posts. Please check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPosts();
    setIsRefreshing(false);
  };

  const handlePostCreated = async (formData) => {
    try {
      const newPost = await createPost(formData, accessToken);
      setPosts([newPost, ...posts]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      const updatedPost = await voteOnPost(postId, voteType, accessToken);
      setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Your vote could not be registered. Please try again.");
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-green-500 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full transform -translate-x-12 translate-y-12"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <LeafIcon />
                </motion.div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Community Hub
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    Share knowledge, grow together, and build the future of
                    farming
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                <RefreshIcon className={isRefreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Create Post Form */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <CreatePostForm
              onPostCreated={handlePostCreated}
              currentUser={currentUser}
            />
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-center justify-center py-16"
            >
              <LoadingIcon size="w-12 h-12" />
              <p className="text-gray-600 mt-4 text-lg font-medium">
                Loading your feed...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center space-x-3">
                <ErrorIcon />
                <div className="flex-grow">
                  <h3 className="text-red-800 font-semibold">
                    Something went wrong
                  </h3>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all duration-200"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Feed */}
        <AnimatePresence>
          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {posts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <LeafIcon size="w-12 h-12" className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Be the first to share something with the community!
                  </p>
                  {currentUser && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const textarea = document.querySelector("textarea");
                        if (textarea) textarea.focus();
                      }}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                      Create First Post
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    variants={postVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard
                      post={post}
                      onVote={handleVote}
                      currentUser={currentUser}
                      accessToken={accessToken}
                      onPostUpdated={handlePostUpdated}
                      onPostDeleted={handlePostDeleted}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
