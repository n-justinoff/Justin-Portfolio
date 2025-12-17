import React, { useRef, useState } from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RowProps {
  title: string;
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onOpenCaseStudy: (p: Project) => void;
}

const Row: React.FC<RowProps> = ({ title, projects, onSelectProject, onOpenCaseStudy }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      
      if (direction === 'left' && scrollTo <= 0) {
          setIsMoved(false);
      }
    }
  };

  if (projects.length === 0) return null;

  return (
    <div className="h-fit space-y-0.5 md:space-y-2 px-4 md:px-12 py-4 md:py-8 group">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      
      <div className="group relative md:-ml-2">
        <ChevronLeft
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${!isMoved && "hidden"}`}
          onClick={() => handleClick("left")}
        />

        {/* Increased padding here (py-10) to allow hover cards to expand without clipping */}
        <div
          ref={rowRef}
          className="flex items-center space-x-1.5 overflow-x-scroll no-scrollbar md:space-x-3.5 px-2 py-10"
        >
          {projects.map((project) => (
            <ProjectCard 
                key={project.id} 
                project={project} 
                onSelect={onSelectProject}
                onOpenCaseStudy={onOpenCaseStudy}
            />
          ))}
        </div>

        <ChevronRight
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
};

export default Row;