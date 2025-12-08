import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const CreatePollPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (i, val) => {
    const arr = [...options];
    arr[i] = val;
    setOptions(arr);
  };

  const submitPoll = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to create a poll!");
      return;
    }

    const clean = options.filter(o => o.trim() !== "");
    if (!question || clean.length < 2) {
      alert("Enter a question and at least 2 options");
      return;
    }

    await addDoc(collection(db, "polls"), {
      question,
      options: clean,
      votes: clean.map(() => 0),
      voters: {},
      createdBy: user.uid,
      createdAt: serverTimestamp()
    });

    navigate("/polls");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Poll</h2>
      <input placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} />

      {options.map((opt, i) => (
        <input key={i} placeholder={`Option ${i + 1}`} value={opt} onChange={e => updateOption(i, e.target.value)} />
      ))}

      <button onClick={addOption}>Add Option</button>
      <button onClick={submitPoll} style={{ display: "block", marginTop: 10 }}>Create</button>
    </div>
  );
};

export default CreatePollPage;
