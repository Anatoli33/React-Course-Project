const Login = () => {

  const eventFn = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    e.target.reset();
    console.log(data);
    
  }

    return(
    <div className="register-wrapper">
    <form className="register-form" onSubmit={eventFn}>
      <h2>Вход в SportTalk</h2>

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