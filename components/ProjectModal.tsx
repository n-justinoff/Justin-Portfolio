import React from 'react';
import { Project } from '../types';
import { X, Play, User, Monitor } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenCaseStudy: (project: Project) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenCaseStudy }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl rounded-lg bg-[#181818] shadow-2xl overflow-hidden ring-1 ring-white/20">
        
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#181818]/50 hover:bg-[#2a2a2a] transition backdrop-blur-md"
        >
            <X className="w-6 h-6 text-white" />
        </button>

        {/* Cover Image Area */}
        <div className="relative aspect-video w-full">
            <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            
            <div className="absolute bottom-10 left-10 space-y-4 max-w-xl">
                {project.mainTag && (
                  <div className="inline-flex items-center space-x-2 bg-red-600/90 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                    {project.mainTag}
                  </div>
                )}
                <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{project.title}</h1>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {/* Button 1: View Case Study (Redirects to error if no content) */}
                    <button 
                        onClick={() => onOpenCaseStudy(project)}
                        className="flex items-center justify-center gap-2 rounded bg-white px-6 md:px-8 py-2 text-lg md:text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
                    >
                        <Play className="h-5 w-5 md:h-6 md:w-6 fill-black" />
                        <span>View Case Study</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Details Area */}
        <div className="flex flex-col gap-x-10 gap-y-4 px-10 pb-10 pt-4 md:flex-row bg-[#181818]">
            <div className="w-full md:w-2/3 space-y-6">
                <div className="flex items-center space-x-4 text-sm font-semibold text-green-400">
                    <span>99% Match</span>
                    <span className="text-white font-normal">{project.year}</span>
                    <span className="text-white border border-gray-500 px-1 rounded text-xs">HD</span>
                </div>
                
                {/* Highlighted Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    {project.role && (
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 mt-0.5 text-gray-500" />
                        <div>
                          <span className="block text-gray-500 text-xs uppercase tracking-wider">Role</span>
                          <span className="text-white font-medium">{project.role}</span>
                        </div>
                      </div>
                    )}
                    {project.platform && (
                      <div className="flex items-start gap-2">
                        <Monitor className="w-4 h-4 mt-0.5 text-gray-500" />
                        <div>
                          <span className="block text-gray-500 text-xs uppercase tracking-wider">Platform</span>
                          <span className="text-white font-medium">{project.platform}</span>
                        </div>
                      </div>
                    )}
                </div>

                <p className="text-white text-lg leading-relaxed">
                    {project.description}
                </p>
            </div>
            
            <div className="w-full md:w-1/3 text-sm space-y-5">
                <div>
                    <span className="text-gray-500 block mb-2">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded border border-gray-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                {project.mainTag && (
                  <div>
                      <span className="text-gray-500 block mb-1">List:</span>
                      <span className="text-white">{project.mainTag}</span>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;