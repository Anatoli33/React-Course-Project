// src/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const { email, password } = data;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      e.target.reset();
      // Навигация към страницата с постове (ProtectedRoute)
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setError("Грешна парола или имейл!");
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleLogin}>
        <h2>Вход в SportTalk</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Имейл</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Парола</label>
          <input type="password" id="password" name="password" required />
        </div>

        <button type="submit" className="btn">Вход</button>

        <p className="login-link">
          Нямаш акаунт? <a href="/register">Регистрация</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
