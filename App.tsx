import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import ProjectModal from './components/ProjectModal';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import RestrictedAccess from './components/RestrictedAccess';
import SearchResults from './components/SearchResults';
import CaseStudyView from './components/CaseStudyView';
import { Project, UserProfile, CATEGORIES } from './types';
import { INITIAL_PROFILE, INITIAL_PROJECTS } from './constants';

const App = () => {
  // Application State
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  // UI State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewingCaseStudy, setViewingCaseStudy] = useState<Project | null>(null);
  const [restrictedViewProject, setRestrictedViewProject] = useState<Project | null>(null);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Dynamic Background State
  const [dominantColor, setDominantColor] = useState<string>('#9b3910'); // Default Fallback

  // Load from LocalStorage on Mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('portfolio_profile');
    const savedProjects = localStorage.getItem('portfolio_projects');
    const authSession = sessionStorage.getItem('portfolio_auth');

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) { console.error("Error parsing profile", e); }
    }

    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) { console.error("Error parsing projects", e); }
    }

    if (authSession === 'true') {
        setIsAuthenticated(true);
    }
  }, []);

  // Extract dominant color from Hero Image
  useEffect(() => {
    const extractColor = () => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = profile.heroImage;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = 1;
        canvas.height = 1;
        // Draw image to 1x1 canvas to blend colors
        ctx.drawImage(img, 0, 0, 1, 1);
        
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        // Set the extracted color
        setDominantColor(`rgb(${r},${g},${b})`);
      };
      
      img.onerror = () => {
        // Fallback to default if CORS fails or image broken
        setDominantColor('#9b3910');
      };
    };

    extractColor();
  }, [profile.heroImage]);

  // Handlers
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('portfolio_profile', JSON.stringify(newProfile));
  };

  const handleUpdateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('portfolio_projects', JSON.stringify(newProjects));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleOpenCaseStudy = (project: Project) => {
      // Logic: If restricted (no content) -> Show Error Page
      if (project.isRestricted) {
        setSelectedProject(null);
        setRestrictedViewProject(project);
      } else {
        // Otherwise show Case Study
        setSelectedProject(null);
        setViewingCaseStudy(project);
        window.scrollTo(0,0);
      }
  };

  const handleCloseCaseStudy = () => {
      setViewingCaseStudy(null);
  };

  const handleHeroPlay = () => {
    // Treat the Hero "Play" button as clicking a restricted project
    // We pass a dummy project or the first project just to trigger the view
    setRestrictedViewProject(projects[0] || {} as Project);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
        setIsAdminOpen(true);
    } else {
        setIsLoginOpen(true);
    }
  };

  const handleLogin = (password: string) => {
    if (password === "admin123") {
        setIsAuthenticated(true);
        sessionStorage.setItem('portfolio_auth', 'true');
        setIsLoginOpen(false);
        setIsAdminOpen(true);
        return true;
    }
    return false;
  };

  // Filter projects for search
  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group projects by category for rows
  const projectsByCategory: Record<string, Project[]> = {};
  CATEGORIES.forEach(cat => {
    projectsByCategory[cat] = projects.filter(p => p.category === cat);
  });

  // If viewing restricted page
  if (restrictedViewProject) {
      return <RestrictedAccess onBack={() => setRestrictedViewProject(null)} />;
  }

  // If viewing case study, render that view exclusively
  if (viewingCaseStudy) {
      return <CaseStudyView project={viewingCaseStudy} onBack={handleCloseCaseStudy} />;
  }

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden pb-10 transition-colors duration-1000 ease-in-out"
      style={{
        background: `linear-gradient(to bottom, ${dominantColor} 0%, #141414 40%, #141414 100%)`
      }}
    >
      
      <Navbar 
        onOpenAdmin={handleAdminClick} 
        avatar={profile.avatar}
        onSearch={handleSearch}
      />

      {searchQuery ? (
        <SearchResults 
            query={searchQuery} 
            results={filteredProjects} 
            onSelectProject={setSelectedProject}
            onOpenCaseStudy={handleOpenCaseStudy}
            onClear={() => setSearchQuery("")}
        />
      ) : (
        <>
            {/* Hero Section: Card on Desktop AND Mobile */}
            <div className="pt-24 px-4 pb-4 md:pt-24 md:px-12 md:pb-0">
               <Hero profile={profile} onPlay={handleHeroPlay} />
            </div>

            {/* Rows Section - Added ID for scrolling */}
            <div id="projects-section" className="relative z-20 mt-4 md:mt-8 pl-4 md:pl-12 space-y-8 md:space-y-12">
                <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-[-10px]">Your Next Watch</h3>
                {/* Render rows based on Categories that actually have projects */}
                {CATEGORIES.map((category) => {
                const categoryProjects = projectsByCategory[category];
                if (!categoryProjects || categoryProjects.length === 0) return null;
                
                return (
                    <Row 
                    key={category} 
                    title={category} 
                    projects={categoryProjects} 
                    onSelectProject={setSelectedProject} 
                    onOpenCaseStudy={handleOpenCaseStudy}
                    />
                );
                })}
                
                {/* Fallback */}
                {projects.length > 0 && !Object.values(projectsByCategory).flat().length && (
                    <Row 
                        title="All Projects" 
                        projects={projects} 
                        onSelectProject={setSelectedProject} 
                        onOpenCaseStudy={handleOpenCaseStudy}
                    />
                )}
            </div>
        </>
      )}

      {/* Footer */}
      <footer className="mt-20 px-12 py-8 text-gray-500 text-sm border-t border-gray-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
                <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
                <p className="mt-2">Designed with the "Streaming Service" aesthetic.</p>
            </div>
            <div className="flex space-x-6">
                <a href={profile.socials.linkedin} className="hover:text-white">LinkedIn</a>
                <a href={profile.socials.twitter} className="hover:text-white">Twitter</a>
                <a href={profile.socials.dribbble} className="hover:text-white">Dribbble</a>
            </div>
        </div>
      </footer>

      {/* Modals */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onOpenCaseStudy={handleOpenCaseStudy}
      />

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)}
        profile={profile}
        projects={projects}
        onUpdateProfile={handleUpdateProfile}
        onUpdateProjects={handleUpdateProjects}
      />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

    </div>
  );
};

export default App;