import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { Card, Badge, Button } from '../components/UI';
import { Search, Frown } from 'lucide-react';
import { db } from '../firebase';
import { formatDate } from '../utils/helpers';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("🔥 [Blog] Postlarni yuklash boshlandi...");
      try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(postsQuery);
        
        const fetchedPosts: BlogPost[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any)
        } as BlogPost));
        
        console.log(`✅ [Blog] ${fetchedPosts.length} ta post yuklandi:`, fetchedPosts);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("❌ [Blog] Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
                    className="flex flex-col h-full group cursor-pointer"
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
                    <p className="text-slate-400 text-sm mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/blog/${post.id}`);
                        }}
                    >
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