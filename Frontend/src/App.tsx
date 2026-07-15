import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VotingPage from './pages/VotingPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VotingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;