import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { Play, ChevronDown } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (p: Project) => void;
  onOpenCaseStudy: (p: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onOpenCaseStudy }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    // 500ms delay before showing the popup, just like Netflix
    hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  useEffect(() => {
    return () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="relative h-[140px] min-w-[240px] md:h-[180px] md:min-w-[320px] transition-all duration-300 z-10 hover:z-20"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
    >
        {/* Placeholder / Base Image */}
        <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover rounded-md cursor-pointer"
        />

        {/* Hover Popup */}
        {isHovered && (
            <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[110%] bg-[#181818] rounded-md shadow-2xl overflow-hidden ring-1 ring-gray-700 animate-in fade-in zoom-in duration-300 origin-center"
                style={{ height: '120%' }}
                onClick={(e) => e.stopPropagation()} // Prevent double firing if clicking background of popup
            >
                <div className="h-1/2 relative" onClick={() => onSelect(project)}>
                     <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10"></div>
                </div>
                
                <div className="p-3 flex flex-col justify-between flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                        {/* Play Button -> Open Case Study */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenCaseStudy(project);
                            }}
                            className="flex items-center justify-center bg-white rounded-full w-10 h-10 hover:bg-gray-200 cursor-pointer transition-transform hover:scale-110"
                            title="View Case Study"
                        >
                            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                        </button>

                        {/* Dropdown Button -> Open Preview Modal */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(project);
                            }}
                            className="border-2 border-gray-400 rounded-full p-1.5 hover:border-white text-gray-300 hover:text-white ml-auto cursor-pointer transition-transform hover:scale-110"
                            title="More Info"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div onClick={() => onSelect(project)} className="cursor-pointer">
                        <div className="flex items-center space-x-2 text-xs text-green-400 font-semibold">
                            <span>{project.year}</span>
                            <span className="text-gray-400 border border-gray-500 px-1 rounded text-[10px] uppercase">HD</span>
                        </div>
                        <div className="text-white text-sm font-bold mt-1 line-clamp-1">{project.title}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {project.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] text-gray-400">
                                    {tag}{" "}
                                    <span className="text-gray-600 last:hidden">•</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProjectCard;