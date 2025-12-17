import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, Badge, Button } from '../components/UI';
import { ArrowRight } from 'lucide-react';
import * as Router from 'react-router-dom';

const Projects: React.FC = () => {
  const navigate = Router.useNavigate();
  const { projects, loading, getProjects } = useData();

  useEffect(() => {
    getProjects(); // Faqat bir marta yuklaydi
  }, [getProjects]);

  return (
    <div className="pt-24 pb-20 px-4 animate-fade-in max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">My Projects</h1>
        <p className="text-slate-400 max-w-2xl">
          Here are some projects fetched directly from Firebase. Click to view details.
        </p>
      </div>

      {loading.projects && projects.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="flex flex-col h-full group cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="h-56 overflow-hidden relative border-b border-slate-700/50">
                 <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                   <Button size="sm" variant="primary">
                     View Details
                   </Button>
                 </div>
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.techStack?.slice(0, 3).map((tech) => (
                    <Badge key={tech} color="gray">{tech}</Badge>
                  ))}
                  {project.techStack?.length > 3 && (
                    <Badge color="gray">+{project.techStack.length - 3}</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {projects.length === 0 && !loading.projects && (
            <div className="col-span-full text-center text-slate-500 py-10 border border-dashed border-slate-700 rounded-lg">
               Projects not found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;