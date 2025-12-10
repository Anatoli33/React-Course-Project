import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const CreatePollPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const addOption = () => setOptions([...options, ""]);

  const removeOption = (i) => {
    if (options.length <= 2) return;
    const arr = options.filter((_, idx) => idx !== i);
    setOptions(arr);
  };

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

    const cleanOptions = options.map(o => o.trim()).filter(o => o !== "");
    if (!question.trim() || cleanOptions.length < 2) {
      alert("Please enter a question and at least 2 options");
      return;
    }

    try {
      await addDoc(collection(db, "polls"), {
        question: question.trim(),
        options: cleanOptions,
        votes: cleanOptions.map(() => 0),
        voters: {},
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });

      setQuestion("");
      setOptions(["", ""]);
      navigate("/polls");
    } catch (err) {
      console.error("Error creating poll:", err);
      alert("Failed to create poll");
    }
  };

  return (
    <div className="create-poll-wrapper">
      <h2>Create a Poll</h2>
      <input 
        placeholder="Question" 
        value={question} 
        onChange={e => setQuestion(e.target.value)} 
      />

      {options.map((opt, i) => (
        <div key={i} className="option-input">
          <input 
            placeholder={`Option ${i + 1}`} 
            value={opt} 
            onChange={e => updateOption(i, e.target.value)} 
          />
          {options.length > 2 && (
            <button onClick={() => removeOption(i)}>✖</button>
          )}
        </div>
      ))}

      <button className="add-option-btn" onClick={addOption}>➕ Add Option</button>
      <button className="submit-btn" onClick={submitPoll}>Create Poll</button>
    </div>
  );
};

export default CreatePollPage;
