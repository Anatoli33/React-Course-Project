import { Route, Routes, Link } from 'react-router-dom';
import Header from './Header.jsx'
import Hero from './Hero.jsx';
import Posts from './Posts.jsx';
import Footer from './Footer.jsx';
import About from './About';
import Create from './Create.jsx';
import Profile from './Profile.jsx';

function App() {
const postList = [
  {
    user: "@FootballFan",
    time: "преди 1 час",
    text: "Уникален гол на последния мач! ⚽🔥 Ливърпул показа невероятна стратегия и отборен дух.",
    hashtags: ["#football", "#goals", "#спорт"]
  },
  {
    user: "@BasketballKing",
    time: "преди 3 часа",
    text: "Точно 30 точки в последната четвърт! 🏀 Невероятен завършек на сезона за отбора ни.",
    hashtags: ["#basketball", "#dunks", "#спорт"]
  },
  {
    user: "@VolleyQueen",
    time: "вчера",
    text: "Супер мач на националния волейбол! 🏐 Тимът ни показа страхотна координация и техника.",
    hashtags: ["#volleyball", "#beachvolley", "#спорт"]
  }
];


  return (
    <>
      <Header />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/posts">About</Link>
        <Link to="/create">Create Post</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/posts" element={<Posts posts={postList}/>} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
