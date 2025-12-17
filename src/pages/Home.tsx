import React, { useEffect, useState } from 'react';
import { BlogPost, ProfileData } from '../types';
import { Button, Card, Badge } from '../components/UI';
import { ArrowRight } from 'lucide-react';
import { db } from '../firebase';
import { formatDate } from '../utils/helpers';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("🔥 [Home] Ma'lumotlarni yuklash boshlandi...");

      try {
        // 1. Profile (Hero) ma'lumotlarini olish
        console.log("📡 [Home] Profile (main_info) so'ralmoqda...");
        const profileRef = doc(db, 'profile', 'main_info');
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          const profileData = profileSnap.data() as ProfileData;
          console.log("✅ [Home] Profile yuklandi:", profileData);
          setProfile(profileData);
        } else {
          console.warn("⚠️ [Home] 'profile/main_info' hujjati topilmadi!");
        }

        // 2. Eng so'nggi 3 ta postni olish
        console.log("📡 [Home] Postlar so'ralmoqda...");
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(postsQuery);
        
        const posts: BlogPost[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BlogPost));
        
        console.log(`✅ [Home] ${posts.length} ta post yuklandi:`, posts);
        setLatestPosts(posts);

      } catch (error) {
        console.error("❌ [Home] Xatolik yuz berdi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
       <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
       </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-5xl mx-auto text-center">
          <Badge color="blue">{profile?.role || "Developer"}</Badge>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold font-heading text-white leading-tight">
            Hi, I'm a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {profile?.role || "Developer"}
            </span>
          </h1>
          <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto">
            {profile?.bio || "Passionate about creating amazing web experiences"}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigate('/projects')} size="lg">
              View Projects
            </Button>
            <Button onClick={() => navigate('/contact')} variant="secondary" size="lg" className="group">
              Contact Me <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Latest Articles</h2>
              <p className="text-slate-400">The most recent technical articles and updates.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/blog')}>
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <Card 
                key={post.id} 
                className="flex flex-col h-full group cursor-pointer hover:border-blue-500/50 transition-all"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge color="blue">{post.category}</Badge>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-slate-500 mb-2">{formatDate(post.date)}</div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center text-blue-400 text-sm font-medium">
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Card>
            ))}
            {latestPosts.length === 0 && (
              <div className="col-span-full text-center text-slate-500 py-10 border border-dashed border-slate-700 rounded-lg">
                <p>Maqolalar topilmadi. Firebasega ma'lumot qo'shing.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;