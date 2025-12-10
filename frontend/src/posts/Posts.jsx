import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../Auth/AuthContext.jsx";
import usePostActions from "../hooks/usePostActions.js";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="feed" className="feed">
      <h3 className="feed-title">Latest Posts</h3>

      {currentUser && (
        <Link to="/create">
          <button className="post-button" style={{ margin: "20px" }}>
            ➕ Create Post
          </button>
        </Link>
      )}

      {posts.length === 0 && <p>No posts yet.</p>}
      
      {posts.map(post => (
        <Post key={post.id} post={post} currentUser={currentUser} />
      ))}
    </section>
  );
};

const Post = ({ post, currentUser }) => {
  const { likes, hasLiked, likePost, repostPost } = usePostActions(post, currentUser);

  return (
    <div className="post">
      <Link to={`/details/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="post-header">
          <span className="post-user">@{post.user || "Unknown"}</span>
          <br />
          <span className="post-time">
            {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString("en-US") : "—"}
          </span>
        </div>

        <h4 className="post-title">{post.title}</h4>
        <p className="post-text">{post.text || post.content}</p>

        <div className="hashtags">
          {post.hashtags?.map(tag => (
            <span className="hashtag" key={tag}>#{tag}</span>
          ))}
        </div>
      </Link>

      {currentUser && (
        <div className="post-buttons">
          <button className={`post-button ${hasLiked ? "liked" : ""}`} onClick={likePost}>
            {hasLiked ? "💔 Unlike" : "❤️ Like"} {likes > 0 && likes}
          </button>
          <Link to={`/details/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <button className="post-button">💬 Comment</button>
          </Link>
          <button className="post-button" onClick={repostPost}>
            🔁 Repost
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;
