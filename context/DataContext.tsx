import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Firestore from 'firebase/firestore';
import { db } from '../firebase';
import { ProfileData, BlogPost, Project } from '../types';

interface DataContextType {
  profile: ProfileData | null;
  posts: BlogPost[];
  projects: Project[];
  loading: {
    profile: boolean;
    posts: boolean;
    projects: boolean;
  };
  getProfile: () => Promise<void>;
  getPosts: () => Promise<void>;
  getProjects: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [loading, setLoading] = useState({
    profile: false,
    posts: false,
    projects: false
  });

  // Smart fetcher for Profile (Essential for Navbar/Footer)
  const getProfile = useCallback(async () => {
    if (profile || loading.profile) return; // Already have it or currently fetching
    
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const docRef = Firestore.doc(db, 'profile', 'main_info');
      const docSnap = await Firestore.getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as ProfileData);
      }
    } catch (e) {
      // Handle error silently
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, [profile, loading.profile]);

  // Smart fetcher for Posts
  const getPosts = useCallback(async () => {
    if (posts.length > 0 || loading.posts) return; // Cache hit
    
    setLoading(prev => ({ ...prev, posts: true }));
    try {
      const postsQuery = Firestore.query(
        Firestore.collection(db, 'posts'), 
        Firestore.orderBy('createdAt', 'desc')
      );
      const querySnapshot = await Firestore.getDocs(postsQuery);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      } as BlogPost));
      setPosts(fetchedPosts);
    } catch (e) {
      // Handle error
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  }, [posts.length, loading.posts]);

  // Smart fetcher for Projects
  const getProjects = useCallback(async () => {
    if (projects.length > 0 || loading.projects) return; // Cache hit
    
    setLoading(prev => ({ ...prev, projects: true }));
    try {
      const querySnapshot = await Firestore.getDocs(Firestore.collection(db, 'projects'));
      const fetchedProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      } as Project));
      setProjects(fetchedProjects);
    } catch (e) {
      // Handle error
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  }, [projects.length, loading.projects]);

  // Global essential data - only profile is truly global
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <DataContext.Provider value={{ 
      profile, posts, projects, loading,
      getProfile,
      getPosts,
      getProjects
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};