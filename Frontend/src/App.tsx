import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VotingPage from './pages/VotingPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VotingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;