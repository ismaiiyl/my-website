import React from 'react';
import { Github, Linkedin, Send, Twitter } from 'lucide-react';
import * as Router from 'react-router-dom';
import { useData } from '../context/DataContext';

const Footer: React.FC = () => {
  const { profile } = useData();
  const socialLinks = profile?.socialLinks;

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">DevBlog</h3>
            <p className="text-slate-400 mb-4">
              A personal space writing about technology, coding, and personal growth.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Router.Link to="/" className="hover:text-blue-400 transition-colors">Home</Router.Link></li>
              <li><Router.Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Router.Link></li>
              <li><Router.Link to="/projects" className="hover:text-blue-400 transition-colors">Projects</Router.Link></li>
              <li><Router.Link to="/about" className="hover:text-blue-400 transition-colors">About Me</Router.Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Social Media</h4>
            <div className="flex space-x-4">
              {socialLinks?.github && (
                <a 
                  href={socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              
              {socialLinks?.linkedin && (
                <a 
                  href={socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}

              {socialLinks?.twitter && (
                <a 
                  href={socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}

              {socialLinks?.telegram && (
                <a 
                  href={socialLinks.telegram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Send className="w-5 h-5" />
                </a>
              )}
              
              {!profile && (
                 <div className="flex space-x-4 opacity-50">
                    <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse"></div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse"></div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse"></div>
                 </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} My Personal Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;