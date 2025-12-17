import React, { useEffect, useState } from 'react';
import * as Router from 'react-router-dom';
import * as Firestore from 'firebase/firestore';
import { db } from '../firebase';
import { useData } from '../context/DataContext';
import { BlogPost } from '../types';
import { Badge, Button } from '../components/UI';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const BlogPostDetail: React.FC = () => {
  const { id } = Router.useParams<{ id: string }>();
  const navigate = Router.useNavigate();
  const { posts } = useData();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      // Check cache first
      const cached = posts.find(p => p.id === id);
      if (cached) {
        setPost(cached);
        setLoading(false);
        return;
      }

      try {
        const docRef = Firestore.doc(db, 'posts', id);
        const docSnap = await Firestore.getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, posts]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen pt-32 text-center px-4">
      <h2 className="text-2xl font-bold text-white">Post not found</h2>
      <Button onClick={() => navigate('/blog')} className="mt-4">Back to Blog</Button>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" size="sm" onClick={() => navigate('/blog')} className="mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Button>

        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden mb-10 shadow-2xl shadow-blue-900/20">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
             <div className="absolute bottom-6 left-6 flex gap-3 z-10">
                <Badge color="purple">{post.category}</Badge>
            </div>
        </div>

        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-heading">{post.title}</h1>
            <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(post.date)}</span>
                <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> {post.category}</span>
            </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-700/50 shadow-xl">
             <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                {post.content || post.excerpt}
             </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;