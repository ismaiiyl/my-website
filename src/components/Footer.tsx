import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Send, Twitter } from 'lucide-react';
import { ProfileData } from '../types';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Footer: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<ProfileData['socialLinks'] | null>(null);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const docRef = doc(db, 'profile', 'main_info');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          setSocialLinks(data.socialLinks);
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };
    fetchSocials();
  }, []);

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
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link to="/projects" className="hover:text-blue-400 transition-colors">Projects</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Me</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Social Media</h4>
            <div className="flex space-x-4">
              {socialLinks?.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.telegram && (
                <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <Send className="w-5 h-5" />
                </a>
              )}
              {/* Fallback if no links are set yet */}
              {!socialLinks && (
                 <span className="text-slate-500 text-sm">Loading links...</span>
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