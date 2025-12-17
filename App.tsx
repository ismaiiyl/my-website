import React, { useEffect } from 'react';
import * as Router from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';

const ScrollToTop = () => {
  const { pathname } = Router.useLocation();
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
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-50">
           <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"></div>
        </div>
        
        <Router.Routes>
          <Router.Route path="/" element={<Home />} />
          <Router.Route path="/blog" element={<Blog />} />
          <Router.Route path="/blog/:id" element={<BlogPostDetail />} />
          <Router.Route path="/about" element={<About />} />
          <Router.Route path="/projects" element={<Projects />} />
          <Router.Route path="/projects/:id" element={<ProjectDetail />} />
          <Router.Route path="/contact" element={<Contact />} />
          <Router.Route path="*" element={<Home />} />
        </Router.Routes>
      </main>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      {/* Use HashRouter to prevent 404 errors on manual URL entry in static hosting environments like GitHub Pages */}
      <Router.HashRouter>
        <AppContent />
      </Router.HashRouter>
    </DataProvider>
  );
}

export default App;