import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const eventFn = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const { username, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setError("Паролите не съвпадат!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      e.target.reset();
      setError("");
      navigate("/posts");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Имейлът вече е използван.");
      } else {
        setError("Възникна грешка при регистрацията.");
      }
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={eventFn}>
        <h2>Регистрация в SportTalk</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Потребителско име</label>
          <input type="text" id="username" name="username" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Имейл</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Парола</label>
          <input type="password" id="password" name="password" required minLength="6" />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Потвърдете паролата</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required />
        </div>

        <button type="submit" className="btn">Регистрация</button>

        <p className="login-link">
          Вече имаш акаунт? <a href="/login">Вход</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
