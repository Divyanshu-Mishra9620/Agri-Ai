import React, { useState, useEffect } from "react";
import { fetchAllPosts, createPost, voteOnPost } from "../../api/communityApi";
import { CreatePostForm } from "./CreatePostForm";
import { PostCard } from "./PostCard";
import useAuth from "../../hooks/useAuth";

const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 mr-3 text-green-600"
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

export const CommunityPage = () => {
  const { user: currentUser, accessToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllPosts()
      .then((data) => {
        setPosts(data.posts || []);
        setError(null);
      })
      .catch((err) => {
        setError("Could not fetch posts. Please check your connection.");
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handlePostCreated = async (formData) => {
    try {
      const newPost = await createPost(formData, accessToken);
      setPosts([newPost, ...posts]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to create post. Please try again."); // Notify user of failure
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
    <div className="bg-yellow-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border-l-4 border-green-500">
          <div className="flex items-center">
            <LeafIcon />
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">
              Community Hub
            </h1>
          </div>
          <p className="text-zinc-500 mt-1 ml-11">
            Share knowledge and grow together
          </p>
        </div>

        {currentUser && (
          <CreatePostForm
            onPostCreated={handlePostCreated}
            currentUser={currentUser}
          />
        )}

        {isLoading && (
          <p className="text-center text-gray-500 mt-8">Loading feed...</p>
        )}
        {error && (
          <p className="text-center text-red-600 bg-red-100 p-3 rounded-md mt-4">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="mt-8 space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onVote={handleVote}
                currentUser={currentUser}
                accessToken={accessToken}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
