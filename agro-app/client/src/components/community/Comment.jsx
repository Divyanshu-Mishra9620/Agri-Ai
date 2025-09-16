import React, { useState } from "react";
import { editComment, deleteComment } from "../../api/communityApi";
import { CommentForm } from "./PostCard";
import { useEffect } from "react";

const UpvoteIcon = ({ className }) => (
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
      d="M5 10l7-7m0 0l7 7m-7-7v18"
    />
  </svg>
);
const DownvoteIcon = ({ className }) => (
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
      d="M19 14l-7 7m0 0l-7-7m7 7V2"
    />
  </svg>
);
const OptionsIcon = ({ className }) => (
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
      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
    />
  </svg>
);

export const Comment = ({
  comment,
  postId,
  currentUser,
  accessToken,
  onCommentAdded,
  onCommentVote,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedMessage, setEditedMessage] = useState(comment.message);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthor = currentUser?._id === comment.author?._id;

  useEffect(() => {
    setEditedMessage(comment.message);
  }, [comment.message]);

  const handleSave = async () => {
    if (editedMessage.trim() === "" || editedMessage === comment.message) {
      return setIsEditing(false);
    }
    try {
      const updatedComment = await editComment(
        comment._id,
        editedMessage,
        accessToken
      );
      const payload = updatedComment?.comment ??
        updatedComment ?? { ...comment, message: editedMessage };
      onCommentUpdated(payload);
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update comment.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const deletedCommentResponse = await deleteComment(
          comment._id,
          accessToken
        );
        const deletedId =
          deletedCommentResponse?.comment?._id ??
          deletedCommentResponse?._id ??
          deletedCommentResponse?.id ??
          comment._id;
        console.log("CHILD IS SENDING:", deletedCommentResponse.comment);
        onCommentDeleted(deletedId);
        setMenuOpen(false);
      } catch (error) {
        alert("Failed to delete comment.");
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(comment.message);
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex-shrink-0 flex items-center justify-center font-bold">
        {comment.author?.name?.charAt(0) || "A"}
      </div>

      <div className="flex-1">
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm text-zinc-800">
              {comment.author?.name || "[deleted]"}
            </p>
            {isAuthor && !isEditing && comment.author && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <OptionsIcon className="w-4 h-4 text-gray-600" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10 border">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isEditing ? (
            <p className="text-zinc-700 text-sm mt-1">{comment.message}</p>
          ) : (
            <div className="mt-2">
              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="w-full text-sm p-2 border border-gray-300 rounded-md"
              />
              <div className="flex justify-end gap-2 mt-1">
                <button
                  onClick={handleCancelEdit}
                  className="text-xs font-bold text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-xs font-bold text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mt-1 pl-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onCommentVote(comment._id, "upvote")}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <UpvoteIcon className="w-4 h-4 hover:text-green-600" />
            </button>
            <span className="text-xs w-3 text-center">
              {comment?.upvotes?.length}
            </span>
            <button
              onClick={() => onCommentVote(comment._id, "downvote")}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <DownvoteIcon className="w-4 h-4 hover:text-red-600" />
            </button>
          </div>
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="hover:underline"
          >
            Reply
          </button>
        </div>

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              postId={postId}
              parentCommentId={comment._id}
              accessToken={accessToken}
              onCommentAdded={onCommentAdded}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}

        {comment.children && comment.children.length > 0 && (
          <div className="mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
            {comment.children.map((childComment) => (
              <Comment
                key={childComment._id}
                comment={childComment}
                postId={postId}
                currentUser={currentUser}
                accessToken={accessToken}
                onCommentAdded={onCommentAdded}
                onCommentVote={onCommentVote}
                onCommentUpdated={onCommentUpdated}
                onCommentDeleted={onCommentDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
