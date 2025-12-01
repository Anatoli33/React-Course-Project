   import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = collection(db, "posts");
      const snapshot = await getDocs(postsRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section id="feed" className="feed">
      <h3 className="feed-title">Последни публикации</h3>

      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </section>
  );
};

const Post = ({ post }) => {
  const [likes, setLikes] = useState(0);

  const likeHandler = () => {
    setLikes(likes + 1);
  };

  return (
    <div className="post">
      <Link to={`/details`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="post-header">
          <span className="post-user">{post.user}</span>
          <span className="post-time">{post.time}</span>
        </div>

        <div className="post-text">{post.text}</div>
        <div className="hashtags">{post.hashtags?.join(" ")}</div>
      </Link>

      <button className="post-button" onClick={likeHandler}>
        ❤️ Like {likes > 0 && likes}
      </button>
      <button className="post-button">💬 Comment</button>
      <button className="post-button">🔁 Repost</button>
    </div>
  );
};

export default Posts;

   
   {/* <button className="post-button">✏️ Edit</button>
      <button className="post-button">🗑️ Delete</button> */}