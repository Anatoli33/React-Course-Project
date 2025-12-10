import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../Auth/AuthContext.jsx";

const AddComment = ({ postId }) => {
  const [text, setText] = useState("");
  const { currentUser } = useAuth();

  const addComment = async () => {
    if (!text.trim() || !currentUser || !postId) return;

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  return (
    <div className="add-comment">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={currentUser ? "Type your comment..." : "Log in to comment"}
        disabled={!currentUser}
      />
      <button onClick={addComment} disabled={!text.trim() || !currentUser}>
        Post
      </button>
    </div>
  );
};

export default AddComment;
