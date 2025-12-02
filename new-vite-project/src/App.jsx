import { Route, Routes, Link } from 'react-router-dom';
import Header from './Header.jsx'
import Hero from './Hero.jsx';
import Posts from './Posts.jsx';
import Footer from './Footer.jsx';
import About from './About';
import Create from './Create.jsx';
import Profile from './Profile.jsx';
import Register from './Register';
import Login from './Login';
import Details from './Details';

function App() {

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/posts" element={<Posts posts={postList}/>} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details" element={<Details />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
