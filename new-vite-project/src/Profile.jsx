import React from "react";

const Profile = () => {
  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="Avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2>@FootballFan</h2>
            <p>Футболен ентусиаст и фен на Ливърпул</p>
            <p>Joined: January 2022</p>
          </div>
        </div>

        <div className="profile-posts">
          <h3>Последни публикации</h3>

          <div className="post">
            <p className="post-text">Любимият ми мач беше вчера! ⚽🔥</p>
            <span className="post-time">преди 2 часа</span>
          </div>

          <div className="post">
            <p className="post-text">
              Гледах баскетболен мач — невероятни дънкове! 🏀
            </p>
            <span className="post-time">преди 1 ден</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
