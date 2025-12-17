import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Button, Card, Badge } from '../components/UI';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import * as Router from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = Router.useNavigate();
  const { profile, posts, loading, getPosts } = useData();

  useEffect(() => {
    getPosts(); // Only fetches if xotira bo'sh bo'lsa
  }, [getPosts]);

  if (loading.profile && !profile) {
    return (
       <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
       </div>
    );
  }

  // Sahifada faqat 3 ta postni ko'rsatamiz, lekin xotirada hammasi saqlanadi
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="animate-fade-in">
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

          {loading.posts && posts.length === 0 ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Card 
                    key={post.id} 
                    className="flex flex-col h-full group cursor-pointer" 
                    onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="h-48 overflow-hidden relative">
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
              {latestPosts.length === 0 && !loading.posts && (
                <div className="col-span-full text-center text-slate-500 py-10 border border-dashed border-slate-700 rounded-lg">
                  <p>Articles not found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;