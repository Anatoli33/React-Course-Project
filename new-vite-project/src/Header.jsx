import React from "react";
import { Link } from "react-router-dom"; 

const Header = () => {
  return (
    <header>
      <h1>Sport Talk</h1>
      <nav>
        <Link to="/">Начало</Link>
        <Link to="/Posts">Постове</Link>
        <Link to="/create">Създай пост</Link>
        <Link to="/profile">Профил</Link>
        <Link to="/about">За нас</Link>
        <Link to="/register">Регистрация</Link>
        <Link to="/login">Вход</Link>
      </nav>
    </header>
  );
};

export default Header;
