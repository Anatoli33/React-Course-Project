import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);

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

        <div className="post-buttons">
          <button className="post-button" onClick={likeHandler}>
            ❤️ Like {likes > 0 && likes}
          </button>
          <button className="post-button">💬 Comment</button>
          <button className="post-button">🔁 Repost</button>
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
