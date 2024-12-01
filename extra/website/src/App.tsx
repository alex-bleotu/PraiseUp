import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AppRedirect } from './components/AppRedirect';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:type/:id" element={<AppRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;