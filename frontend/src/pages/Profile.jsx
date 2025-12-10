import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../Auth/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const loadProfile = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.error("User document does not exist in Firestore.");
          setLoading(false);
          return;
        }

        setUser(userSnap.data());

        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc") 
        );

        const postsSnap = await getDocs(postsQuery);
        setPosts(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);

      } catch (err) {
        console.error("❌ Error loading profile:", err);
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  if (!currentUser) return <p>Моля, влез в профила си...</p>;
  if (loading) return <p>Зареждане...</p>;
  if (!user) return <p>Не са намерени потребителски данни.</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.avatar} alt="Avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2>@{user.username}</h2>
          <p>Joined: {user.joined}</p>
        </div>
      </div>

      <div className="profile-posts">
        <h3>Твоите публикации</h3>
        {posts.length === 0 && <p>Нямаш публикации</p>}
        {posts.map(post => (
          <Link key={post.id} to={`/details/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="post">
              <h4 className="post-title">{post.title}</h4>
              <p className="post-text">{post.text || post.content}</p>
              <span className="post-time">
                {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString("bg-BG") : "—"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Profile;
