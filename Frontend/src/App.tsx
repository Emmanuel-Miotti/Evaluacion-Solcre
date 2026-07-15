import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VotingPage from './pages/VotingPage';
import LoginPage from './pages/LoginPage';
import AdminPanelPage from './pages/AdminPanelPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VotingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;