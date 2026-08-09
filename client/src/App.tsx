import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import { useAuth } from './context/AuthContext';

import LandingPage from './components/LandingPage/LandingPage.tsx';
import Feed from './components/Feed/Feed.tsx';
import PostPage from './components/MiscPages/PostPage.tsx';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/feed" replace /> : <LandingPage/>}/>
      <Route path="/feed" element={isAuthenticated ? <Feed /> : <Navigate to="/" replace />}/>
      <Route path="/profile/:userId" element={isAuthenticated ? <Feed /> : <Navigate to="/" replace />}/>
      <Route path="/post/:postId" element={<PostPage/>}/>
    </Routes>
  )
}

export default App
