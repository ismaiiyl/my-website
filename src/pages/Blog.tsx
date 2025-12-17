import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { Card, Badge, Button } from '../components/UI';
import { Search, Frown, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { db } from '../firebase';
import { formatDate } from '../utils/helpers';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

const Blog: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // List state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Single post state
  const [singlePost, setSinglePost] = useState<BlogPost | null>(null);
  const [singleLoading, setSingleLoading] = useState(false);

  // 1. Agar postId bo'lsa, bitta postni yuklaymiz
  useEffect(() => {
    if (postId) {
      const fetchSinglePost = async () => {
        setSingleLoading(true);
        console.log(`🔥 [Blog] Post ID: ${postId} yuklanmoqda...`);
        try {
          const docRef = doc(db, 'posts', postId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("✅ [Blog] Post topildi:", data);
            setSinglePost({ id: docSnap.id, ...data } as BlogPost);
          } else {
            console.warn("⚠️ [Blog] Post topilmadi");
            setSinglePost(null);
          }
        } catch (error) {
          console.error("❌ [Blog] Xatolik:", error);
        } finally {
          setSingleLoading(false);
        }
      };
      fetchSinglePost();
    } else {
      setSinglePost(null);
    }
  }, [postId]);

  // 2. Agar postId yo'q bo'lsa, ro'yxatni yuklaymiz
  useEffect(() => {
    if (!postId && posts.length === 0) {
      const fetchPosts = async () => {
        setLoading(true);
        console.log("🔥 [Blog] Barcha postlar yuklanmoqda...");
        try {
          const postsRef = collection(db, 'posts');
          const q = query(postsRef, orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          
          const fetchedPosts: BlogPost[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as BlogPost));
          
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("❌ [Blog] Xatolik:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [postId, posts.length]);

  // --- SINGLE POST VIEW ---
  if (postId) {
    if (singleLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!singlePost) {
      return (
        <div className="pt-32 text-center text-slate-400 min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <p className="mb-6">The article you are looking for does not exist.</p>
          <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
        </div>
      );
    }

    return (
      <div className="pt-24 pb-20 px-4 animate-fade-in max-w-4xl mx-auto min-h-screen">
        <Button variant="secondary" size="sm" onClick={() => navigate('/blog')} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Button>

        <article className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="h-64 md:h-96 relative">
            <img 
              src={singlePost.imageUrl} 
              alt={singlePost.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <Badge color="blue" className="mb-3">{singlePost.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                {singlePost.title}
              </h1>
              <div className="flex items-center text-slate-300 text-sm gap-4">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {formatDate(singlePost.date)}</span>
                <span className="flex items-center"><Tag className="w-4 h-4 mr-1" /> {singlePost.category}</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose prose-invert prose-lg max-w-none text-slate-300 whitespace-pre-wrap">
              {/* Content rendering */}
              {singlePost.content || singlePost.excerpt}
            </div>
          </div>
        </article>
      </div>
    );
  }

  // --- LIST VIEW ---
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 px-4 animate-fade-in max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Blog Posts</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          The latest news and tutorials.
        </p>
        
        <div className="mt-8 max-w-md mx-auto relative">
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-3 px-6 pl-12 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-sm"
          />
          <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="flex flex-col h-full group cursor-pointer hover:border-blue-500/50 transition-all"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4">
                      <Badge color="purple">{post.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-center text-sm text-slate-500 mb-3">
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Button variant="outline" size="sm" className="w-full mt-auto">
                      Read More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <Frown className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-slate-300">No articles found</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;