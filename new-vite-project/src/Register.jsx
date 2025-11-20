import React from "react";

const Register = () => {
  return (
    <div className="register-wrapper">
      <form className="register-form" action="/register" method="POST">
        <h2>Регистрация в SportTalk</h2>

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
