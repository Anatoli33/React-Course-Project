import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "../firebase";

const PollsFeed = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPolls(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const vote = async (pollId, optionIndex) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Моля влезте в акаунта си, за да гласувате!");
      return;
    }

    try {
      const pollRef = doc(db, "polls", pollId);
      await updateDoc(pollRef, {
        [`votes.${optionIndex}`]: increment(1),
        [`voters.${user.uid}`]: true,
      });
    } catch (err) {
      console.error("Неуспешно гласуване:", err);
    }
  };

  return (
    <div className="polls-container">
      <h2>Анкети</h2>

      {auth.currentUser && (
        <Link to="/polls/create">
          <button className="post-button" style={{ marginBottom: "20px" }}>
            ➕ Създай анкета
          </button>
        </Link>
      )}

      {polls.map((poll) => {
        const user = auth.currentUser;
        const voters = poll.voters || {};
        const rawVotes = poll.votes || {};
        const options = Array.isArray(poll.options) ? poll.options : [];
        const votes = options.map((_, index) => rawVotes[index] || 0);

        const hasVoted = user ? voters[user.uid] : false;
        const totalVotes = votes.reduce((sum, v) => sum + (v || 0), 0);

        return (
          <Link
            to={`/polls/${poll.id}`}
            key={poll.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="poll-card">
              <div className="poll-question">{poll.question || "Няма въпрос"}</div>

              {options.map((option, i) => {
                const count = votes[i] || 0;
                const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

                return (
                  <div className="poll-option" key={i}>
                    <button
                      disabled={hasVoted}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        vote(poll.id, i);
                      }}
                    >
                      {option || `Опция ${i + 1}`}
                    </button>

                    {hasVoted && (
                      <span>
                        {count} гласа ({pct}%)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PollsFeed;
