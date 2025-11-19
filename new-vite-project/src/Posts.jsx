import React, { useState } from "react";

const Posts = ({ posts }) => {
  return (
    <section id="feed" className="feed">
      <h3 className="feed-title">Последни публикации</h3>

      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </section>
  );
};

// Single Post component (each post has its own like state)
const Post = ({ post }) => {
  const [likes, setLikes] = useState(0);

  const likeHandler = () => {
    setLikes(likes + 1);
  };

  return (
    <div className="post">
      <div className="post-header">
        <span className="post-user">{post.user}</span>
        <span className="post-time">{post.time}</span>
      </div>
      <div className="post-text">{post.text}</div>
      <div className="hashtags">{post.hashtags.join(" ")}</div>

      <button className="like-button" onClick={likeHandler}>
        ❤️ Like {likes > 0 && `${likes}`}
      </button>
    </div>
  );
};

export default Posts;
