import React from "react";

const Details = () => {
  const post = [
    {
      user: "@FootballFan",
      time: "преди 1 час",
      text: "Уникален гол на последния мач! ⚽🔥 Ливърпул показа невероятна стратегия и отборен дух.",
      hashtags: ["#football", "#goals", "#спорт"],
      likes: 12,
      comments: 5,
    }
  ];

  const p = post[0]; // get the first post

  return (
    <section className="details-page">
      <h2 className="details-title">Post Details</h2>

      <div className="details-card">
        <div className="details-header">
          <span className="details-user">{p.user}</span>
          <span className="details-time">{p.time}</span>
        </div>

        <p className="details-text">{p.text}</p>

        <div className="details-hashtags">
          {p.hashtags.join(" ")}
        </div>

        <div className="details-stats">
          <span>❤️ Likes: {p.likes}</span>
          <span>💬 Comments: {p.comments}</span>
        </div>
      </div>
    </section>
  );
};

export default Details;
