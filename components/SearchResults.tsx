import React from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface SearchResultsProps {
  query: string;
  results: Project[];
  onSelectProject: (p: Project) => void;
  onOpenCaseStudy: (p: Project) => void;
  onClear: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, results, onSelectProject, onOpenCaseStudy, onClear }) => {
  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl text-gray-400">
            Results for "<span className="text-white font-bold">{query}</span>"
          </h2>
          {results.length === 0 && (
              <button onClick={onClear} className="text-sm text-red-500 hover:underline">Clear Search</button>
          )}
      </div>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {results.map(project => (
                <div key={project.id} className="mb-8">
                    <ProjectCard 
                        project={project} 
                        onSelect={onSelectProject} 
                        onOpenCaseStudy={onOpenCaseStudy}
                    />
                </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg">No projects found matching your search.</p>
            <p className="text-sm mt-2">Try searching for tools (Figma, React), categories (App, Web), or titles.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;