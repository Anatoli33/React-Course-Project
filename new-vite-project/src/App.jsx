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
import { AuthProvider } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRouter.jsx';
import PostDetail from './PostDetails.jsx';

function App() {

  return (
    <>
     <AuthProvider>
      <Header />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/posts" element={<Posts/>} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details" element={<Details />} />
        <Route path='/details/:id' element={<PostDetail/>} />
      </Routes>
      </AuthProvider>
      <Footer />
    </>
  );
}

export default App;
