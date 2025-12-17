import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';

// Sahifa o'zgarganda oynani eng yuqoriga ko'tarish uchun yordamchi komponent
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-900 text-slate-50 selection:bg-blue-500/30 selection:text-blue-200">
      <ScrollToTop />
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
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          {/* Noto'g'ri URL kiritilsa Home sahifasiga yo'naltirish */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;