import React, { useState, useEffect } from 'react';
import { Button, FormInput, Card } from '../components/UI';
import { Mail, MapPin, Phone } from 'lucide-react';
import { db } from '../firebase';
import { ProfileData } from '../types';
import { doc, getDoc } from 'firebase/firestore';

const Contact: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("🔥 [Contact] Profile info yuklanmoqda...");
      try {
        const docRef = doc(db, 'profile', 'main_info');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          console.log("✅ [Contact] Data yuklandi:", data);
          setProfile(data);
        }
      } catch (error) {
        console.error("❌ [Contact] Xatolik:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 3000);
  };

  return (
    <div className="pt-24 pb-20 px-4 animate-fade-in max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Me</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Do you have project proposals or just want to say hello?
          Fill out the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-slate-400">{profile?.email || "Yuklanmoqda..."}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Location</h4>
                  <p className="text-slate-400">{profile?.location || "Yuklanmoqda..."}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Phone</h4>
                  <p className="text-slate-400">{profile?.phone || "Yuklanmoqda..."}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Name" placeholder="Enter your name" required />
              <FormInput label="Email" type="email" placeholder="example@mail.com" required />
            </div>
            <FormInput label="Subject" placeholder="Subject of your message" />
            <FormInput label="Message" as="textarea" placeholder="Write your message here..." required />
            
            <Button type="submit" size="lg" className="w-full mt-2">
              {formStatus === 'success' ? 'Message Sent!' : 'Send Message'}
            </Button>
            
            {formStatus === 'success' && (
              <p className="mt-4 text-green-400 text-center text-sm animate-pulse">
                Thank you! Your message has been sent successfully.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;