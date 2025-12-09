import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import { useAuth } from "./AuthContext";

import AddComment from "./Comment.jsx";
import CommentsList from "./CommentList.jsx";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such post!");
      }
    };

    fetchPost();
  }, [id]);

  const likeHandler = () => setLikes(likes + 1);

  if (!post) return <p>Loading post...</p>;

  const deleteHandler = async () => {
    const confirmed = window.confirm("Сигурен ли си, че искаш да изтриеш поста?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "posts", id));
      alert("Постът е изтрит успешно!");
      window.location.href = "/posts";
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Грешка при изтриването.");
    }
  };

  return (
    <section className="post-detail-wrapper">
      <Link to="/posts" className="post-button">← Back to Posts</Link>

      <div className="post-detail-card">
        <div className="post-header">
          <h2 className="post-title">{post.title}</h2>
          <span className="post-user">{post.user}</span>
          <span className="post-time">{post.time}</span>
        </div>

        <div className="post-text">{post.text || post.content}</div>

        {post.hashtags && (
          <div className="hashtags">{post.hashtags.join(" ")}</div>
        )}

        {currentUser && (
          <div className="post-buttons">
            <button className="post-button" onClick={likeHandler}>
              ❤️ Like {likes > 0 && likes}
            </button>
            <button className="post-button">🔁 Repost</button>

            {currentUser.displayName === post.user && (
              <>
                <button className="post-button" onClick={deleteHandler}>🗑️ Delete</button>
                <Link to={`/edit/${id}`} className="post-button">✏️ Edit</Link>
              </>
            )}
          </div>
        )}
        <div className="comments-section">
          <h3>Коментари</h3>
          <CommentsList postId={id} />
          {currentUser ? (
            <AddComment postId={id} />
          ) : (
            <p>Само регистрирани потребители могат да коментират.</p>
          )}
        </div>

      </div>
    </section>
  );
};

export default PostDetail;
