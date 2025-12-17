import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Card, Badge, Button, Modal } from '../components/UI';
import { Github, ExternalLink, Maximize2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Barcha loyihalarni yuklash
  useEffect(() => {
    const fetchProjects = async () => {
      console.log("🔥 [Projects] Loyihalarni yuklash boshlandi...");
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const fetchedProjects: Project[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));
        
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("❌ [Projects] Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 2. URL da projectId bo'lsa, o'sha loyihani topib modalda ochish
  useEffect(() => {
    if (projectId) {
      const findAndOpenProject = async () => {
        // Agar loyihalar ro'yxati allaqachon yuklangan bo'lsa, ichidan qidiramiz
        const existing = projects.find(p => p.id === projectId);
        if (existing) {
          setSelectedProject(existing);
          return;
        }

        // Agar ro'yxatda bo'lmasa (masalan, to'g'ridan-to'g'ri link orqali kirilganda), serverdan so'raymiz
        try {
          const docRef = doc(db, 'projects', projectId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setSelectedProject({ id: docSnap.id, ...docSnap.data() } as Project);
          } else {
            console.warn("⚠️ [Projects] Loyiha topilmadi ID:", projectId);
            navigate('/projects', { replace: true });
          }
        } catch (error) {
          console.error("❌ [Projects] Loyihani yuklashda xatolik:", error);
        }
      };

      findAndOpenProject();
    } else {
      setSelectedProject(null);
    }
  }, [projectId, projects, navigate]);

  const handleCloseModal = () => {
    setSelectedProject(null);
    navigate('/projects'); // Modal yopilganda URLni tozalash
  };

  const handleOpenProject = (project: Project) => {
    navigate(`/projects/${project.id}`); // URLni o'zgartirish
  };

  return (
    <div className="pt-24 pb-20 px-4 animate-fade-in max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">My Projects</h1>
        <p className="text-slate-400 max-w-2xl">
          Below are some real-world projects and pet projects I've worked on.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="flex flex-col h-full group cursor-pointer"
              onClick={() => handleOpenProject(project)}
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
                  <Maximize2 className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
          {projects.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-10 border border-dashed border-slate-700 rounded-lg">
               Loyihalar topilmadi.
            </div>
          )}
        </div>
      )}

      {/* Project Details Modal */}
      <Modal 
        isOpen={!!selectedProject} 
        onClose={handleCloseModal}
        title={selectedProject?.title || ''}
      >
        {selectedProject && (
          <div className="space-y-6">
            <div className="rounded-lg overflow-hidden border border-slate-700">
              <img 
                src={selectedProject.imageUrl} 
                alt={selectedProject.title} 
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">About Project</h4>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedProject.description}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.techStack?.map((tech) => (
                  <Badge key={tech} color="blue">{tech}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-700">
              {selectedProject.demoUrl && (
                <Button className="flex-1" onClick={() => window.open(selectedProject.demoUrl, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                </Button>
              )}
              {selectedProject.repoUrl && (
                 <Button variant="secondary" className="flex-1" onClick={() => window.open(selectedProject.repoUrl, '_blank')}>
                  <Github className="w-4 h-4 mr-2" /> Source Code
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Projects;