import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import { useAuth } from './context/AuthContext';

import LandingPage from './components/LandingPage/LandingPage.tsx';
import Feed from './components/Feed/Feed.tsx';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/feed" element={isAuthenticated ? <Feed /> : <Navigate to="/" replace />} />
      <Route path="/profile/:userId" element={isAuthenticated ? <Feed /> : <Navigate to="/" replace />}/>
    </Routes>
  )
}

export default App
