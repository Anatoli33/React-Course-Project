// src/Auth/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
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
      await updateProfile(userCredential.user, { displayName: username });
      e.target.reset();
      setError("");
      navigate("/posts"); // къде да отиде след регистрация
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
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Регистрация</h2>
        {error && <p className="error-message">{error}</p>}

        <label>Потребителско име</label>
        <input type="text" name="username" required />

        <label>Имейл</label>
        <input type="email" name="email" required />

        <label>Парола</label>
        <input type="password" name="password" required minLength={6} />

        <label>Потвърдете паролата</label>
        <input type="password" name="confirmPassword" required />

        <button type="submit">Регистрация</button>

        <p>
          Вече имаш акаунт? <a href="/login">Вход</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
