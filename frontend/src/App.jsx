import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Hero from './pages/Hero.jsx';
import Posts from './posts/Posts.jsx';
import Footer from './components/Footer.jsx';
import About from './pages/About.jsx';
import Create from './posts/Create.jsx';
import Profile from './pages/Profile.jsx';
import Register from './Auth/Register.jsx';
import Login from './Auth/Login.jsx';
import { AuthProvider } from './Auth/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRouter.jsx';
import PostDetail from './posts/PostDetails.jsx';
import Edit from './posts/Edit.jsx';
import CreatePollPage from './polls/CreatePollsPage.jsx';
import PollsFeed from './polls/PollsFeed.jsx';
import PoolDetails from './polls/PollDetails.jsx';

function App() {
  return (
    <AuthProvider>
      <Header />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/posts" element={<Posts />} />
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
        <Route path="/details/:id" element={<PostDetail />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/polls" element={<PollsFeed />} />
        <Route path="/polls/:id" element={<PoolDetails />} />
        <Route path="/polls/create" element={<CreatePollPage />} />
      </Routes>

      <Footer />
    </AuthProvider>
  );
}

export default App;
