import React, { useState } from 'react';
import { Project, UserProfile, CATEGORIES } from '../types';
import { X, Save, Trash2, Plus, Edit2, ChevronDown, ChevronUp, Upload } from 'lucide-react';

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
    isRestricted: false // Default to having content (not restricted)
  };

  const [currentProject, setCurrentProject] = useState<Partial<Project>>(initialProjectState);
  
  // Helper for gallery textarea
  const [galleryText, setGalleryText] = useState("");

  if (!isOpen) return null;

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setEditingProfile({ ...editingProfile, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UserProfile) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfileChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAll = () => {
    try {
        onUpdateProfile(editingProfile);
        onUpdateProjects(editingProjects);
        alert('Changes Saved Successfully!');
        onClose();
    } catch (e) {
        alert('Error saving changes. If you uploaded a large image, it might exceed local storage limits.');
        console.error(e);
    }
  };

  const deleteProject = (id: string) => {
    if(confirm('Are you sure you want to delete this project?')) {
        setEditingProjects(editingProjects.filter(p => p.id !== id));
        if (isEditingId === id) {
            resetForm();
        }
    }
  };

  const editProject = (project: Project) => {
      setIsEditingId(project.id);
      setCurrentProject(project);
      setGalleryText(project.gallery ? project.gallery.join('\n') : "");
      // Scroll to form
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
        // If restricted (no content selected), clear description/gallery, or keep them but ignore them
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

  // Helper to determine if we are in "Add Content" mode
  // If isRestricted is true -> We DO NOT have content -> Checkbox unchecked
  // If isRestricted is false -> We HAVE content -> Checkbox checked
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
                className={`flex-1 py-4 text-center font-semibold hover:bg-[#1f1f1f] transition ${activeTab === 'profile' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
            >
                Edit Profile
            </button>
            <button 
                onClick={() => setActiveTab('projects')}
                className={`flex-1 py-4 text-center font-semibold hover:bg-[#1f1f1f] transition ${activeTab === 'projects' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
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

                        <label className="block text-sm font-medium text-gray-400">Bio</label>
                        <textarea 
                            value={editingProfile.bio}
                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                            rows={4}
                            className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" 
                        />

                        {/* Hero Image Section */}
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-400">Hero Image (Background)</label>
                             <div className="flex gap-2">
                                <input 
                                    value={editingProfile.heroImage}
                                    onChange={(e) => handleProfileChange('heroImage', e.target.value)}
                                    placeholder="Enter Image URL"
                                    className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" 
                                />
                                <label className="cursor-pointer bg-[#333] hover:bg-[#444] text-white px-4 rounded border border-gray-600 flex items-center justify-center transition" title="Upload Local Image">
                                    <Upload size={18} />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => handleFileUpload(e, 'heroImage')}
                                    />
                                </label>
                             </div>
                             <p className="text-xs text-gray-500">Supported: URL or Local File Upload (stored locally)</p>
                             <img src={editingProfile.heroImage} alt="Preview" className="w-full h-48 object-cover rounded border border-gray-700 opacity-80" />
                        </div>

                        {/* Avatar Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">Avatar URL</label>
                             <div className="flex gap-2">
                                <input 
                                    value={editingProfile.avatar}
                                    onChange={(e) => handleProfileChange('avatar', e.target.value)}
                                    placeholder="Enter Image URL"
                                    className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded p-3 text-white focus:border-red-600 outline-none" 
                                />
                                <label className="cursor-pointer bg-[#333] hover:bg-[#444] text-white px-4 rounded border border-gray-600 flex items-center justify-center transition" title="Upload Local Image">
                                    <Upload size={18} />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => handleFileUpload(e, 'avatar')}
                                    />
                                </label>
                             </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Add/Edit Project Form */}
                    <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 project-form transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                {isEditingId ? <Edit2 className="text-red-600"/> : <Plus className="text-red-600"/>} 
                                {isEditingId ? 'Edit Project' : 'Add New Project'}
                            </h3>
                            {isEditingId && (
                                <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white underline">Cancel Edit</button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h4 className="text-xs uppercase text-gray-500 font-bold border-b border-gray-700 pb-1">Basic Info</h4>
                                <input 
                                    placeholder="Project Title *"
                                    value={currentProject.title}
                                    onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                                    className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <select 
                                        value={currentProject.category}
                                        onChange={(e) => setCurrentProject({...currentProject, category: e.target.value})}
                                        className="bg-[#141414] border border-gray-600 rounded p-2 text-white"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <input 
                                        placeholder="Year"
                                        type="number"
                                        value={currentProject.year}
                                        onChange={(e) => setCurrentProject({...currentProject, year: parseInt(e.target.value)})}
                                        className="bg-[#141414] border border-gray-600 rounded p-2 text-white"
                                    />
                                </div>
                                <input 
                                    placeholder="Role (e.g. Lead Designer)"
                                    value={currentProject.role}
                                    onChange={(e) => setCurrentProject({...currentProject, role: e.target.value})}
                                    className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white"
                                />
                                <input 
                                    placeholder="Platform (e.g. iOS, Web)"
                                    value={currentProject.platform}
                                    onChange={(e) => setCurrentProject({...currentProject, platform: e.target.value})}
                                    className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white"
                                />
                                
                                {/* Project Image Upload */}
                                <div className="flex gap-2">
                                    <input 
                                        placeholder="Cover Image URL *"
                                        value={currentProject.imageUrl}
                                        onChange={(e) => setCurrentProject({...currentProject, imageUrl: e.target.value})}
                                        className="flex-1 bg-[#141414] border border-gray-600 rounded p-2 text-white"
                                    />
                                    <label className="cursor-pointer bg-[#333] hover:bg-[#444] text-white px-3 rounded border border-gray-600 flex items-center justify-center" title="Upload Image">
                                        <Upload size={16} />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if(file){
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setCurrentProject({...currentProject, imageUrl: reader.result as string});
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>

                                <input 
                                    placeholder="Hero Video URL (Optional)"
                                    value={currentProject.heroVideo}
                                    onChange={(e) => setCurrentProject({...currentProject, heroVideo: e.target.value})}
                                    className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white"
                                />
                                 <textarea 
                                    placeholder="Short Description (Card View)"
                                    value={currentProject.description}
                                    onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                                    className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white h-24"
                                />
                            </div>

                            {/* Detailed Info */}
                            <div className="space-y-4">
                                <h4 className="text-xs uppercase text-gray-500 font-bold border-b border-gray-700 pb-1">Detailed Content</h4>
                                
                                <div className="flex items-center gap-2 mb-4 p-3 bg-black/20 rounded border border-gray-700">
                                     <input 
                                        type="checkbox" 
                                        id="hasCaseStudy"
                                        checked={hasContent}
                                        onChange={(e) => setCurrentProject({...currentProject, isRestricted: !e.target.checked})}
                                        className="w-5 h-5 accent-red-600 cursor-pointer"
                                     />
                                     <label htmlFor="hasCaseStudy" className="text-sm text-white select-none font-bold cursor-pointer">
                                        Include Case Study Content?
                                     </label>
                                     <span className="text-xs text-gray-500 ml-auto">
                                        {hasContent ? "Viewable" : "Restricted Access"}
                                     </span>
                                </div>

                                {hasContent ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <input 
                                            placeholder="External Link (Optional)"
                                            value={currentProject.link}
                                            onChange={(e) => setCurrentProject({...currentProject, link: e.target.value})}
                                            className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white"
                                        />
                                        
                                        <textarea 
                                            placeholder="Full Case Study Description (HTML supported)"
                                            value={currentProject.fullDescription}
                                            onChange={(e) => setCurrentProject({...currentProject, fullDescription: e.target.value})}
                                            className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white h-32 font-mono text-sm"
                                        />
                                        
                                        <textarea 
                                            placeholder="Gallery Image URLs (One per line)"
                                            value={galleryText}
                                            onChange={(e) => setGalleryText(e.target.value)}
                                            className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white h-24 font-mono text-sm"
                                        />
                                        
                                        <input 
                                            placeholder="Main Tag (e.g. Featured)"
                                            value={currentProject.mainTag}
                                            onChange={(e) => setCurrentProject({...currentProject, mainTag: e.target.value})}
                                            className="w-full bg-[#141414] border border-gray-600 rounded p-2 text-white"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-4 bg-yellow-900/10 border border-yellow-700/30 rounded text-yellow-500 text-sm">
                                        Users who click "View Case Study" will see the restricted access screen prompting them to contact you.
                                    </div>
                                )}
                            </div>
                        </div>
                        <button onClick={saveProject} className="mt-6 w-full md:w-auto bg-white text-black font-bold px-8 py-3 rounded hover:bg-gray-200 transition">
                            {isEditingId ? 'Update Project' : 'Add Project'}
                        </button>
                    </div>

                    {/* List Existing */}
                    <div className="space-y-2 pb-10">
                        <h3 className="text-lg font-bold">Manage Existing Projects</h3>
                        {editingProjects.map(p => (
                            <div key={p.id} className={`flex items-center justify-between bg-[#141414] p-3 rounded border transition ${isEditingId === p.id ? 'border-red-600 bg-red-900/10' : 'border-gray-800'}`}>
                                <div className="flex items-center gap-4">
                                    <img src={p.imageUrl} className="w-16 h-9 object-cover rounded" />
                                    <div>
                                        <div className="font-bold">{p.title}</div>
                                        <div className="text-xs text-gray-500">{p.role} • {p.year} {p.isRestricted && <span className="text-yellow-500 font-bold ml-2">(Restricted)</span>}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => editProject(p)} className="p-2 text-gray-300 hover:bg-white/10 rounded" title="Edit">
                                        <Edit2 size={18}/>
                                    </button>
                                    <button onClick={() => deleteProject(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded" title="Delete">
                                        <Trash2 size={18}/>
                                    </button>
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
             <button onClick={saveAll} className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 font-bold transition flex items-center gap-2">
                <Save size={18} /> Save Changes
             </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;