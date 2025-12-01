import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase.js";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("time", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <section id="feed" className="feed">
      <h3 className="feed-title">Последни публикации</h3>

      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  );
};

const Post = ({ post }) => {
  const [likes, setLikes] = useState(0);

  const likeHandler = () => setLikes(likes + 1);

  return (
    <div className="post">
      <Link to={`/details`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="post-header">
          <span className="post-user">{post.user}</span>
          <br/>
          <span className="post-time">{post.time}</span>
          <br/>
          <span className="post-time">{post.title}</span>
        </div>

        <div className="post-text">{post.text || post.content}</div>
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