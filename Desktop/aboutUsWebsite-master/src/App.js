import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./components/Home"
import About from './pages/aboutus';
import Contact from './components/contactForm/contact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/about" element={<About />}>
          <Route index element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
