import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-900 text-slate-50 selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      
      <main className="flex-grow relative">
        {/* Global Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-50">
           <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"></div>
        </div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;