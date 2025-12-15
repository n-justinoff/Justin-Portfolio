import React, { useEffect, useState, useRef } from 'react';
import { Search, Smile, X, Home, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  avatar: string;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, avatar, onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
        // Focus appropriate input based on screen size
        if (window.innerWidth < 768 && mobileInputRef.current) {
            mobileInputRef.current.focus();
        } else if (inputRef.current) {
            inputRef.current.focus();
        }
    }
  }, [isSearchOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setSearchValue("");
      onSearch("");
    } else {
      setIsSearchOpen(true);
    }
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className={`md:hidden fixed top-0 w-full z-50 transition-all duration-300 px-4 py-4 flex justify-between items-center ${isScrolled ? 'bg-black/90 shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
            {/* Logo (Left) - Hidden if search is full width, or just managed via flex */}
            <div 
                className={`text-[#E50914] text-4xl font-black tracking-tighter symbol-n-mobile drop-shadow-lg transition-opacity duration-300 ${isSearchOpen && searchValue ? 'opacity-0 w-0' : 'opacity-100'}`}
                onClick={scrollToTop}
            >
                N
            </div>

            {/* Search (Right) */}
            <div className={`flex items-center justify-end transition-all duration-300 flex-1 ${isSearchOpen ? 'bg-[#181818] border border-white/20 rounded-md py-1 px-2' : ''}`}>
                 <div className={`flex items-center ${isSearchOpen ? 'w-full' : 'w-auto'}`}>
                    {isSearchOpen && (
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                    )}
                    <input 
                        ref={mobileInputRef}
                        type="text"
                        placeholder="Search..."
                        className={`bg-transparent border-none outline-none text-white text-sm transition-all duration-300 ${isSearchOpen ? 'w-full px-1' : 'w-0 overflow-hidden'}`}
                        value={searchValue}
                        onChange={handleSearchChange}
                        onBlur={() => !searchValue && setIsSearchOpen(false)}
                    />
                    {!isSearchOpen && (
                        <Search className="w-6 h-6 text-white cursor-pointer ml-auto" onClick={toggleSearch} />
                    )}
                    {isSearchOpen && (
                         <X className="w-5 h-5 text-gray-400 cursor-pointer ml-1" onClick={toggleSearch} />
                    )}
                 </div>
            </div>
      </div>

      {/* --- DESKTOP NAVBAR --- */}
      <nav className={`hidden md:flex fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#141414] shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center justify-between px-12 py-4 h-24 gap-4 w-full">
            
            {/* Left Side: Custom Smiley Logo (Profile) */}
            <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={onOpenAdmin}>
                <div className="w-10 h-10 bg-[#0D8ABC] rounded-lg flex items-center justify-center shadow-lg hover:scale-105 transition hover:rotate-3">
                    <Smile className="text-white w-6 h-6" />
                </div>
            </div>

            {/* Center: Navigation & Search */}
            <div className="flex-1 flex items-center justify-center pl-20">
                <div className="flex items-center space-x-6">
                    <div className={`${isSearchOpen ? 'hidden lg:flex' : 'flex'} items-center space-x-4`}>
                        <button 
                            onClick={scrollToTop}
                            className="text-gray-300 hover:text-white text-sm font-bold bg-white text-black px-5 py-1.5 rounded-full shadow-lg hover:bg-gray-200 transition transform hover:scale-105"
                        >
                            Home
                        </button>
                        <button 
                            onClick={scrollToProjects}
                            className="text-gray-300 hover:text-white text-sm font-medium transition drop-shadow-md"
                        >
                            Projects
                        </button>
                        <a 
                            href="mailto:n.justinoff@gmail.com"
                            className="text-gray-300 hover:text-white text-sm font-medium transition drop-shadow-md"
                        >
                            Contact
                        </a>
                    </div>

                    <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5' : ''}`}>
                        <Search 
                            className="w-5 h-5 text-gray-200 cursor-pointer hover:text-white" 
                            onClick={toggleSearch}
                        />
                        <input 
                            ref={inputRef}
                            type="text"
                            placeholder="Search..."
                            className={`bg-transparent border-none outline-none text-white text-sm ml-2 transition-all duration-300 ${isSearchOpen ? 'w-48' : 'w-0 overflow-hidden'}`}
                            value={searchValue}
                            onChange={handleSearchChange}
                            onBlur={() => !searchValue && setIsSearchOpen(false)}
                        />
                        {searchValue && (
                            <X className="w-4 h-4 cursor-pointer text-gray-400 hover:text-white mx-1" onClick={() => { setSearchValue(""); onSearch(""); }} />
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side: Red N Logo */}
            <div className="flex items-center flex-shrink-0 pl-1">
                <div className="text-[#E50914] text-4xl font-black tracking-tighter cursor-pointer transform scale-y-110 drop-shadow-lg">
                    N
                </div>
            </div>

        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-[60] bg-[#121212] border-t border-white/10 pb-safe">
        <div className="flex justify-around items-center h-16 text-[#808080]">
             {/* Home */}
             <button onClick={scrollToTop} className="flex flex-col items-center gap-1 hover:text-white transition w-full h-full justify-center active:text-white focus:text-white">
                 <Home className="w-5 h-5" />
                 <span className="text-[10px] font-medium">Home</span>
             </button>

             {/* Projects */}
             <button onClick={scrollToProjects} className="flex flex-col items-center gap-1 hover:text-white transition w-full h-full justify-center active:text-white focus:text-white">
                 <Layers className="w-5 h-5" />
                 <span className="text-[10px] font-medium">Projects</span>
             </button>

             {/* Profile/Admin (My Portfolio) */}
             <button onClick={onOpenAdmin} className="flex flex-col items-center gap-1 hover:text-white transition w-full h-full justify-center active:text-white focus:text-white">
                 <div className="w-5 h-5 rounded overflow-hidden border border-transparent hover:border-white relative">
                     <img src={avatar} alt="Me" className="w-full h-full object-cover" />
                 </div>
                 <span className="text-[10px] font-medium">My Portfolio</span>
             </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;