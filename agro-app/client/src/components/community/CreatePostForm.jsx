import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";

const formStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  marginBottom: "20px",
};

const textareaStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "16px",
  minHeight: "80px",
  marginBottom: "10px",
};

const buttonStyle = {
  background: "#4CAF50",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
};

const PhotoIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
const SendIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

export const CreatePostForm = ({ onPostCreated }) => {
  const { user: currentUser } = useAuth();
  if (!currentUser) {
    return null;
  }
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please write something to post.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("content", content);
    formData.append("title", content.substring(0, 30) || "New Post");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onPostCreated(formData);

    setContent("");
    setImageFile(null);
    e.target.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <textarea
            className="w-full h-24 p-3 bg-gray-50 rounded-lg border-2 border-transparent focus:outline-none focus:border-green-500 transition"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's happening in the fields, ${currentUser.name}?`}
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <label className="flex items-center text-sm font-semibold text-zinc-600 hover:text-green-600 cursor-pointer">
            <PhotoIcon />
            {imageFile ? `${imageFile.name}` : "Add Photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center bg-green-600 text-white font-bold py-2 px-5 rounded-full hover:bg-green-700 transition disabled:bg-green-300"
          >
            <SendIcon />
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};
