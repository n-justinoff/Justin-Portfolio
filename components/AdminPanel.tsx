import React, { useState } from 'react';
import { Project, UserProfile, CATEGORIES } from '../types';
import { X, Save, Trash2, Plus, Edit2, ChevronDown, ChevronUp, Upload, Code, FileDown, AlertTriangle, Link } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  projects: Project[];
  onUpdateProfile: (p: UserProfile) => void;
  onUpdateProjects: (p: Project[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, profile, projects, onUpdateProfile, onUpdateProjects }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects'>('profile');
  const [editingProfile, setEditingProfile] = useState<UserProfile>(profile);
  const [editingProjects, setEditingProjects] = useState<Project[]>(projects);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  
  const initialProjectState: Partial<Project> = {
    id: '', 
    title: '', 
    description: '', 
    imageUrl: '', 
    heroVideo: '',
    category: CATEGORIES[0], 
    tags: [], 
    year: new Date().getFullYear(),
    role: '',
    platform: '',
    mainTag: '',
    fullDescription: '',
    gallery: [],
    link: '',
    isRestricted: false
  };

  const [currentProject, setCurrentProject] = useState<Partial<Project>>(initialProjectState);
  const [galleryText, setGalleryText] = useState("");

  if (!isOpen) return null;

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setEditingProfile({ ...editingProfile, [field]: value });
  };

  const handleAvailabilityChange = (field: 'status' | 'date', value: string) => {
    setEditingProfile({
        ...editingProfile,
        availability: {
            ...(editingProfile.availability || { status: 'unavailable' }),
            [field]: value
        }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UserProfile) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        if (!confirm(`This file is ${(file.size / 1024 / 1024).toFixed(2)}MB. Embedding large files makes your code heavy.\n\nRecommended: Upload to Google Drive and paste the link, or put it in your 'public' folder.\n\nDo you still want to embed it?`)) {
            return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfileChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        const promises = Array.from(files).map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(file as Blob);
            });
        });

        Promise.all(promises).then(base64Images => {
             setGalleryText(prev => {
                const current = prev.trim();
                const newContent = base64Images.join('\n');
                return current ? `${current}\n${newContent}` : newContent;
             });
        });
    }
  };

  const saveAll = () => {
    try {
        onUpdateProfile(editingProfile);
        onUpdateProjects(editingProjects);
        alert('Changes Saved Locally!');
        onClose();
    } catch (e) {
        alert('Error saving changes. Local storage might be full.');
        console.error(e);
    }
  };

  const exportConfig = () => {
    const configContent = `import { Project, UserProfile } from './types';

export const INITIAL_PROFILE: UserProfile = ${JSON.stringify(editingProfile, null, 2)};
export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(editingProjects, null, 2)};
`;
    
    const blob = new Blob([configContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'constants.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`Configuration downloaded! Replace 'constants.ts' with this file.`);
  };

  const deleteProject = (id: string) => {
    if(confirm('Are you sure you want to delete this project?')) {
        setEditingProjects(editingProjects.filter(p => p.id !== id));
        if (isEditingId === id) resetForm();
    }
  };

  const editProject = (project: Project) => {
      setIsEditingId(project.id);
      setCurrentProject(project);
      setGalleryText(project.gallery ? project.gallery.join('\n') : "");
      document.querySelector('.project-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
      setIsEditingId(null);
      setCurrentProject(initialProjectState);
      setGalleryText("");
  };

  const saveProject = () => {
    if(!currentProject.title || !currentProject.imageUrl) {
        alert("Title and Image URL are required");
        return;
    }

    const processedGallery = galleryText.split('\n').map(s => s.trim()).filter(s => s !== "");

    const projectToSave: Project = {
        id: isEditingId || Date.now().toString(),
        title: currentProject.title!,
        description: currentProject.description || "No description",
        imageUrl: currentProject.imageUrl!,
        heroVideo: currentProject.heroVideo,
        category: currentProject.category || CATEGORIES[0],
        tags: currentProject.tags || ["New"],
        year: currentProject.year || 2024,
        role: currentProject.role,
        platform: currentProject.platform,
        mainTag: currentProject.mainTag,
        link: currentProject.link || '#',
        fullDescription: currentProject.fullDescription,
        gallery: processedGallery,
        isRestricted: currentProject.isRestricted || false
    };

    if (isEditingId) {
        setEditingProjects(editingProjects.map(p => p.id === isEditingId ? projectToSave : p));
    } else {
        setEditingProjects([...editingProjects, projectToSave]);
    }
    
    resetForm();
  };

  const hasContent = !currentProject.isRestricted;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
      <div className="bg-[#1f1f1f] w-full max-w-6xl h-[90vh] rounded-xl flex flex-col overflow-hidden shadow-2xl border border-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-[#141414]">
          <h2 className="text-2xl font-bold text-white">Portfolio Manager</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full"><X /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-[#141414]">
            <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 text-center font-semibold transition ${activeTab === 'profile' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
            >
                Edit Profile
            </button>
            <button 
                onClick={() => setActiveTab('projects')}
                className={`flex-1 py-4 text-center font-semibold transition ${activeTab === 'projects' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
            >
                Manage Projects
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {activeTab === 'profile' ? (
                <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 gap-4">
                        <label className="block text-sm font-medium text-gray-400">Name</label>
                        <input 
                            value={editingProfile.name}
                            onChange={(e) => handleProfileChange('name', e.target.value)}
                            className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" 
                        />
                        
                        <label className="block text-sm font-medium text-gray-400">Hero Title</label>
                        <input 
                            value={editingProfile.title}
                            onChange={(e) => handleProfileChange('title', e.target.value)}
                            className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" 
                        />

                        {/* Availability Status */}
                        <div className="space-y-4 p-4 bg-[#2a2a2a] rounded border border-gray-700">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Availability Status</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                    <select 
                                        value={editingProfile.availability?.status || 'unavailable'}
                                        onChange={(e) => handleAvailabilityChange('status', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-600 rounded p-3 text-white focus:border-red-600 outline-none"
                                    >
                                        <option value="available">Available Now</option>
                                        <option value="unavailable">Not Available</option>
                                        <option value="date">Available From (Date)</option>
                                    </select>
                                </div>
                                
                                {editingProfile.availability?.status === 'date' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Select Date</label>
                                        <input 
                                            type="date"
                                            value={editingProfile.availability?.date || ''}
                                            onChange={(e) => handleAvailabilityChange('date', e.target.value)}
                                            className="w-full bg-[#141414] border border-gray-600 rounded p-3 text-white focus:border-red-600 outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resume Section */}
                        <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-400">Resume / CV (Google Drive Link or Upload)</label>
                                <Link size={14} className="text-gray-500" />
                             </div>
                             <div className="flex gap-2">
                                <input 
                                    value={editingProfile.resumeUrl || ''}
                                    onChange={(e) => handleProfileChange('resumeUrl', e.target.value)}
                                    placeholder="Paste Google Drive Link or enter local path"
                                    className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" 
                                />
                                <label className="cursor-pointer bg-[#333] hover:bg-[#444] text-white px-4 rounded border border-gray-600 flex items-center justify-center transition" title="Upload PDF">
                                    <Upload size={18} />
                                    <input 
                                        type="file" 
                                        accept="application/pdf" 
                                        className="hidden" 
                                        onChange={(e) => handleFileUpload(e, 'resumeUrl')}
                                    />
                                </label>
                             </div>
                             <p className="text-xs text-gray-500 italic">
                                Tip: You can paste a public Google Drive share link here.
                             </p>
                        </div>

                        <label className="block text-sm font-medium text-gray-400">Bio</label>
                        <textarea 
                            value={editingProfile.bio}
                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                            rows={4}
                            className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" 
                        />

                        <label className="block text-sm font-medium text-gray-400">Hero Image URL</label>
                        <div className="flex gap-2">
                             <input 
                                value={editingProfile.heroImage}
                                onChange={(e) => handleProfileChange('heroImage', e.target.value)}
                                className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" 
                            />
                            <label className="cursor-pointer bg-[#333] hover:bg-[#444] text-white px-4 rounded border border-gray-600 flex items-center justify-center transition">
                                <Upload size={18} />
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'heroImage')}/>
                            </label>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Add/Edit Project Form */}
                    <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 project-form">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            {isEditingId ? <Edit2 className="text-red-600"/> : <Plus className="text-red-600"/>} 
                            {isEditingId ? 'Edit Project' : 'Add New Project'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <input placeholder="Title *" value={currentProject.title} onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})} className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white" />
                                <div className="grid grid-cols-2 gap-2">
                                    <select value={currentProject.category} onChange={(e) => setCurrentProject({...currentProject, category: e.target.value})} className="bg-[#141414] border border-gray-600 rounded p-2 text-white">
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <input placeholder="Year" type="number" value={currentProject.year} onChange={(e) => setCurrentProject({...currentProject, year: parseInt(e.target.value)})} className="bg-[#141414] border border-gray-600 rounded p-2 text-white" />
                                </div>
                                <input placeholder="Cover Image URL *" value={currentProject.imageUrl} onChange={(e) => setCurrentProject({...currentProject, imageUrl: e.target.value})} className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white" />
                                <textarea placeholder="Short Description" value={currentProject.description} onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})} className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white h-24" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2 p-3 bg-black/20 rounded border border-gray-700">
                                     <input type="checkbox" id="hasCaseStudy" checked={hasContent} onChange={(e) => setCurrentProject({...currentProject, isRestricted: !e.target.checked})} className="w-5 h-5 accent-red-600" />
                                     <label htmlFor="hasCaseStudy" className="text-sm text-white font-bold cursor-pointer">Include Case Study Content?</label>
                                </div>
                                {hasContent && (
                                    <div className="space-y-4">
                                        <textarea placeholder="Full Description (HTML)" value={currentProject.fullDescription} onChange={(e) => setCurrentProject({...currentProject, fullDescription: e.target.value})} className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white h-32 font-mono text-sm" />
                                        <textarea placeholder="Gallery URLs (One per line)" value={galleryText} onChange={(e) => setGalleryText(e.target.value)} className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white h-24 font-mono text-sm" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <button onClick={saveProject} className="mt-6 bg-white text-black font-bold px-8 py-3 rounded hover:bg-gray-200 transition">
                            {isEditingId ? 'Update Project' : 'Add Project'}
                        </button>
                    </div>

                    {/* Project List */}
                    <div className="space-y-2">
                        {editingProjects.map(p => (
                            <div key={p.id} className="flex items-center justify-between bg-[#141414] p-3 rounded border border-gray-800">
                                <div className="flex items-center gap-4">
                                    <img src={p.imageUrl} className="w-16 h-9 object-cover rounded" />
                                    <div>
                                        <div className="font-bold">{p.title}</div>
                                        <div className="text-xs text-gray-500">{p.year} {p.isRestricted && '(Restricted)'}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => editProject(p)} className="p-2 text-gray-300 hover:bg-white/10 rounded"><Edit2 size={18}/></button>
                                    <button onClick={() => deleteProject(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={18}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-[#141414] flex justify-end gap-4">
             <button onClick={onClose} className="px-6 py-2 rounded border border-gray-600 hover:bg-gray-800 transition">Cancel</button>
             <button onClick={exportConfig} className="px-6 py-2 rounded border border-blue-600 text-blue-500 hover:bg-blue-900/20 font-bold transition flex items-center gap-2">
                <Code size={18} /> Export Code
             </button>
             <button onClick={saveAll} className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 font-bold transition flex items-center gap-2">
                <Save size={18} /> Save & Close
             </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;