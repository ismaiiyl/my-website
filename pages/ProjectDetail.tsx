import React, { useEffect, useState } from 'react';
import * as Router from 'react-router-dom';
import * as Firestore from 'firebase/firestore';
import { db } from '../firebase';
import { useData } from '../context/DataContext';
import { Project } from '../types';
import { Badge, Button } from '../components/UI';
import { ArrowLeft, Github, ExternalLink, Layers } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = Router.useParams<{ id: string }>();
  const navigate = Router.useNavigate();
  const { projects } = useData();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      // Check cache first
      const cached = projects.find(p => p.id === id);
      if (cached) {
        setProject(cached);
        setLoading(false);
        return;
      }

      try {
        const docRef = Firestore.doc(db, 'projects', id);
        const docSnap = await Firestore.getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, projects]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen pt-32 text-center px-4">
      <h2 className="text-2xl font-bold text-white">Project not found</h2>
      <Button onClick={() => navigate('/projects')} className="mt-4">Back to Projects</Button>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <Button variant="outline" size="sm" onClick={() => navigate('/projects')} className="mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
                 <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-blue-900/20 group">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    {project.demoUrl && (
                        <Button className="flex-1 justify-center py-4 text-lg" onClick={() => window.open(project.demoUrl, '_blank')}>
                        <ExternalLink className="w-5 h-5 mr-2" /> Live Demo
                        </Button>
                    )}
                    {project.repoUrl && (
                        <Button variant="secondary" className="flex-1 justify-center py-4 text-lg" onClick={() => window.open(project.repoUrl, '_blank')}>
                        <Github className="w-5 h-5 mr-2" /> Source Code
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">{project.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.techStack?.map((tech) => (
                            <Badge key={tech} color="blue" className="text-sm px-3 py-1">{tech}</Badge>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700/50 pb-4">
                        <Layers className="text-blue-400 w-6 h-6" /> Project Overview
                    </h3>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                        {project.description}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;