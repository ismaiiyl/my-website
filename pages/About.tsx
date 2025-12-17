import React, { useEffect, useState } from 'react';
import { SERVICES } from '../constants';
import { ProfileData } from '../types';
import { Card, Badge, Button } from '../components/UI';
import { Briefcase, User, Download, ExternalLink } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const About: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("🔥 [About] Profile yuklash boshlandi...");
      try {
        const docRef = doc(db, 'profile', 'main_info');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          console.log("✅ [About] Profile ma'lumotlari:", data);
          setProfile(data);
        } else {
          console.warn("⚠️ [About] 'profile/main_info' hujjati topilmadi!");
        }
      } catch (error) {
        console.error("❌ [About] Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Fallback UI if no data is found in DB
  if (!profile) {
    return (
      <div className="pt-32 text-center text-slate-400">
        <p>Profile information not available yet.</p>
        <p className="text-sm mt-2">Please check 'profile/main_info' in Firebase.</p>
      </div>
    );
  }

  const displayImage = profile.profileImage || profile.avatarUrl;

  return (
    <div className="pt-24 pb-20 px-4 animate-fade-in max-w-4xl mx-auto">
      
      {/* Bio Section */}
      <section className="flex flex-col md:flex-row items-center gap-10 mb-20">
        <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
          {displayImage ? (
            <img 
              src={displayImage} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full border-4 border-slate-800 relative z-10"
            />
          ) : (
             <div className="w-full h-full rounded-full border-4 border-slate-800 bg-slate-800 flex items-center justify-center relative z-10">
               <User className="w-20 h-20 text-slate-600" />
             </div>
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <Badge color="blue">{profile.role}</Badge>
          <h1 className="text-4xl font-bold text-white mb-4">About Me</h1>
          <p className="text-slate-400 leading-relaxed text-lg whitespace-pre-line mb-6">
            {profile.bio}
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {profile.resumeUrl && (
              <Button onClick={() => window.open(profile.resumeUrl, '_blank')}>
                <Download className="w-4 h-4 mr-2" /> Download CV
              </Button>
            )}
             {profile.socialLinks?.github && (
              <Button variant="secondary" onClick={() => window.open(profile.socialLinks?.github, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" /> GitHub
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Services (Static icons) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {SERVICES.map((service, idx) => (
          <Card key={idx} className="p-6 text-center hover:bg-slate-800/80">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mx-auto mb-4">
              {service.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
            <p className="text-sm text-slate-400">{service.desc}</p>
          </Card>
        ))}
      </section>

      {/* Skills from Firebase */}
      {profile.skills && profile.skills.length > 0 && (
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="text-blue-500" /> Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.skills.map((skill, idx) => (
              <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-200 font-medium">{skill.name}</span>
                <span className={`text-xs px-2 py-1 rounded bg-slate-800 ${
                  skill.level.toLowerCase() === 'expert' ? 'text-purple-400' : 
                  skill.level.toLowerCase() === 'advanced' ? 'text-blue-400' : 'text-green-400'
                }`}>{skill.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience from Firebase */}
      {profile.experience && profile.experience.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Briefcase className="text-blue-500" /> Experience
          </h2>
          <div className="space-y-8 border-l-2 border-slate-800 ml-3 pl-8 relative">
            {profile.experience.map((exp, index) => (
              <div key={index} className="relative">
                <span className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 border-slate-900 ${index === 0 ? 'bg-blue-600' : 'bg-slate-700'}`}></span>
                <div className={`mb-1 font-semibold ${index === 0 ? 'text-blue-400' : 'text-slate-400'}`}>{exp.year}</div>
                <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                <p className="text-slate-500 mb-2">{exp.company}</p>
                <p className="text-slate-400">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default About;