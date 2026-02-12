import { Routes, Route } from 'react-router-dom'

import './App.css'

import LandingPage from './components/LandingPage/LandingPage.tsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />           {/* Home feed */}
      <Route path="/profile/:userId" element={<LandingPage />} /> {/* Profile page */}
    </Routes>
  )
}

export default App
