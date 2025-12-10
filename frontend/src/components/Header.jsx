import React from "react";
import { Link } from "react-router-dom"; 
import { useAuth } from "./Auth/AuthContext";

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header>
      <h1>Sport Talk</h1>
      <nav>
        <Link to="/">Начало</Link>
        <Link to="/posts">Постове</Link>
        <Link to="/polls">Анкети</Link>
        {currentUser && <Link to="/profile">Профил</Link>}
        <Link to="/about">За нас</Link>

        {currentUser ? (
          <>
            <span onClick={logout} style={{ marginLeft: "20px", cursor: "pointer" }}>Изход</span>
          </>
        ) : (
          <>
            <Link to="/register">Регистрация</Link>
            <Link to="/login">Вход</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
