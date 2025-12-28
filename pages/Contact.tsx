import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../components/UI';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Github, 
  Linkedin, 
  Send, 
  Twitter, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { db } from '../firebase';
import { ProfileData } from '../types';
// Use namespaced import to bypass "no exported member" errors in some environments
import * as Firestore from 'firebase/firestore';

const Contact: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = Firestore.doc(db, 'profile', 'main_info');
        const docSnap = await Firestore.getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as ProfileData);
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const copyEmail = () => {
    if (profile?.email) {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const contactMethods = [
    {
      id: 'email',
      icon: <Mail className="w-6 h-6" />,
      label: 'Email Address',
      value: profile?.email,
      action: 'Send Email',
      link: `mailto:${profile?.email}`,
      color: 'blue',
      canCopy: true
    },
    {
      id: 'telegram',
      icon: <Send className="w-6 h-6" />,
      label: 'Telegram',
      value: profile?.socialLinks?.telegram?.split('/').pop() || 'Telegram',
      action: 'Chat on Telegram',
      link: profile?.socialLinks?.telegram,
      color: 'sky'
    },
    {
      id: 'linkedin',
      icon: <Linkedin className="w-6 h-6" />,
      label: 'LinkedIn',
      value: 'Professional Profile',
      action: 'View Profile',
      link: profile?.socialLinks?.linkedin,
      color: 'indigo'
    },
    {
      id: 'github',
      icon: <Github className="w-6 h-6" />,
      label: 'GitHub',
      value: profile?.socialLinks?.github?.split('/').pop() || 'Repositories',
      action: 'View Projects',
      link: profile?.socialLinks?.github,
      color: 'slate'
    },
    {
      id: 'chess',
      icon: <ChessKingIcon className="w-6 h-6" />,
      label: 'Chess.com',
      value: 'Profile',
      action: 'View Profile',
      link: profile?.socialLinks?.chess,
      color: 'white'
    },
    {
      id: 'buymeacoffee',
      icon: <Coffee className="w-6 h-6" />,
      label: 'Buy Me a Coffee',
      value: 'Support My Work',
      action: 'Support Me',
      link: profile?.socialLinks?.buymeacoffee,
      color: 'amber'
    },
    {
      id: 'twitter',
      icon: <Twitter className="w-6 h-6" />,
      label: 'Twitter / X',
      value: 'Latest Updates',
      action: 'Follow Me',
      link: profile?.socialLinks?.twitter,
      color: 'blue'
    },
    {
      id: 'location',
      icon: <MapPin className="w-6 h-6" />,
      label: 'Location',
      value: profile?.location || 'Remote / Worldwide',
      action: 'Google Maps',
      link: `https://www.google.com/maps/search/${encodeURIComponent(profile?.location || '')}`,
      color: 'emerald'
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 animate-fade-in max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <Badge color="blue" className="mb-4">Get In Touch</Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading">
          Let's Connect and <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Create Something Great
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactMethods.map((method) => (
          method.link || method.value ? (
            <Card key={method.id} className="p-6 flex flex-col group h-full">
              <div className={`w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700/50`}>
                <span className="text-blue-400">{method.icon}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-slate-400 text-sm font-medium mb-1">{method.label}</h3>
                <p className="text-white font-bold text-lg mb-4 truncate">{method.value || 'N/A'}</p>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 text-sm py-2" 
                  onClick={() => window.open(method.link, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> {method.action}
                </Button>
                
                {method.canCopy && (
                  <button 
                    onClick={copyEmail}
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </Card>
          ) : null
        ))}
      </div>

      <div className="mt-20 p-10 rounded-3xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
        <h2 className="text-2xl font-bold text-white mb-4">Preferred Working Hours</h2>
        <p className="text-slate-400">
          Monday — Friday: 9:00 AM - 6:00 PM (GMT+5) <br />
          Available for remote work worldwide.
        </p>
      </div>
    </div>
  );
};

export default Contact;
