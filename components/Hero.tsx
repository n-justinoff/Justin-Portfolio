import React from 'react';
import { Play, Calendar, Download } from 'lucide-react';
import { UserProfile } from '../types';

interface HeroProps {
  profile: UserProfile;
  onPlay: () => void;
}

const Hero: React.FC<HeroProps> = ({ profile, onPlay }) => {
  
  // Helper to determine availability visuals
  const getAvailabilityInfo = () => {
    // Fallback if availability is undefined (e.g., old local storage data)
    const { status, date } = profile.availability || { status: 'unavailable', date: '' };

    if (status === 'available') {
        return { 
            text: 'Available for Work', 
            color: 'text-green-500', 
            iconColor: 'text-green-500',
            badgeBorder: 'border-green-500'
        };
    } else if (status === 'unavailable') {
        return { 
            text: 'Not Available', 
            color: 'text-red-500', 
            iconColor: 'text-red-500',
            badgeBorder: 'border-red-500'
        };
    } else if (status === 'date' && date) {
        const dateObj = new Date(date);
        // Format date: e.g., "June 27"
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        return { 
            text: `Coming ${formattedDate}`, 
            color: 'text-white', 
            iconColor: 'text-pink-500',
            badgeBorder: 'border-white'
        };
    }
    // Fallback
    return { 
        text: 'Contact for Info', 
        color: 'text-gray-400', 
        iconColor: 'text-gray-400',
        badgeBorder: 'border-gray-400' 
    };
  };

  const { text, color, iconColor, badgeBorder } = getAvailabilityInfo();

  /**
   * ULTRA-ROBUST DOWNLOAD HANDLER
   * Specifically handles the mobile Safari ".pdf.html" issue caused by Vercel's SPA rewrites.
   */
  const handleDownloadClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = profile.resumeUrl || "/Nirmal_Justin_Resume.pdf";
    const filename = "Resume.pdf";

    // 1. DATA URL HANDLING (Sync path for better mobile compatibility)
    if (url.startsWith('data:')) {
      try {
        const parts = url.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: 'application/pdf' }); // Force PDF mime
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
        return;
      } catch (err) {
        console.error("Data URL processing failed", err);
      }
    }

    // 2. REMOTE URL HANDLING (Validation path)
    try {
      const response = await fetch(url);
      
      // If the file is missing (404) or server error, Vercel/SPA servers usually return index.html
      // with a 200 status, or a 404 page that is actually HTML.
      const contentType = response.headers.get('content-type');
      
      // If we received HTML instead of a PDF, it's the SPA fallback. DO NOT DOWNLOAD.
      if (!response.ok || (contentType && contentType.includes('text/html'))) {
        alert("The Resume file was not found on the server. \n\nIf you haven't uploaded your resume yet, please do so in the 'My Portfolio' (Admin) section.");
        // Optional: window.open(url, '_blank'); // This would just open the website again in a new tab
        return;
      }

      const originalBlob = await response.blob();
      // Explicitly construct a new Blob with the correct MIME type to override any headers
      const pdfBlob = new Blob([originalBlob], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(pdfBlob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error("Fetch download failed", error);
      // Fallback for browsers with strict cross-origin fetch policies
      window.open(url, '_blank');
    }
  };

  return (
    <div className="relative h-auto aspect-[3/4] md:aspect-auto md:h-[80vh] w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl group ring-1 ring-white/10 bg-[#141414]">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img 
          src={profile.heroImage} 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-50% to-[#141414] to-95%" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        
        {/* Mobile bottom gradient for text readability - Stronger for the card look */}
        <div className="md:hidden absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
      </div>

      {/* Mobile Top Right Badge (Availability) */}
      <div className={`md:hidden absolute top-4 right-0 bg-[#181818]/80 backdrop-blur-md border-l-2 ${badgeBorder} py-1.5 px-3 flex items-center space-x-2 rounded-l shadow-2xl z-20`}>
             <Calendar className={`${iconColor} w-3 h-3`} />
             <div className="flex flex-col">
                <span className="uppercase text-[6px] font-bold text-gray-400 tracking-wider leading-tight">Availability</span>
                <span className={`font-bold ${profile.availability?.status === 'available' ? 'text-white' : color} text-[10px] leading-tight`}>{text}</span>
             </div>
      </div>

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full z-10 flex flex-col justify-end pb-4 md:block md:bottom-[12%] md:left-12 md:pb-0">
        
        {/* Inner Wrapper: Centered on Mobile, Left-Aligned on Desktop */}
        <div className="flex flex-col items-center text-center px-4 w-full md:items-start md:text-left md:max-w-2xl md:px-0 space-y-3 md:space-y-6">

            {/* N Logo + Name */}
            <div className="flex items-center space-x-1 mb-1 opacity-90 md:opacity-100 scale-90 md:scale-100">
                 <span className="text-[#E50914] text-3xl md:text-4xl font-black tracking-tighter drop-shadow-lg">N</span>
                 <span className="text-gray-200 font-bold tracking-[0.2em] text-[10px] md:text-xs mt-1 uppercase drop-shadow-md">IRMAL JUSTIN</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] drop-shadow-2xl uppercase tracking-tighter font-inter max-w-xl mx-auto md:mx-0">
                {profile.title}
            </h1>

            {/* Metadata Line */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 text-xs md:text-base font-semibold text-white drop-shadow-lg">
                 <span className="text-green-400 font-bold">98% Match</span>
                 <span className="text-gray-400 text-[10px]">•</span>
                 <span>{new Date().getFullYear()}</span>
                 <span className="text-gray-400 text-[10px]">•</span>
                 <span className="border border-white/60 px-1 rounded-[2px] text-[10px] backdrop-blur-sm">HD</span>
                 <span className="text-gray-400 text-[10px]">•</span>
                 <span>UI/UX</span>
            </div>

            {/* Buttons - Side by side row on Mobile, Row on Desktop */}
            <div className="flex flex-row items-center w-full gap-3 pt-2 md:w-auto md:gap-4 md:pt-4">
              <button 
                onClick={onPlay}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white text-black px-4 md:px-8 py-2.5 md:py-3 rounded-[4px] font-bold hover:bg-white/90 transition shadow-lg h-10 md:h-auto"
              >
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-black" />
                <span className="text-sm md:text-lg">Play</span>
              </button>
              
              <a 
                href={profile.resumeUrl || "/Nirmal_Justin_Resume.pdf"} 
                download="Resume.pdf"
                onClick={handleDownloadClick}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-[#2f2f2f] md:bg-[rgba(109,109,110,0.7)] text-white px-4 md:px-8 py-2.5 md:py-3 rounded-[4px] font-bold hover:bg-[#404040] md:hover:bg-[rgba(109,109,110,0.5)] transition backdrop-blur-md shadow-lg h-10 md:h-auto"
              >
                <Download className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-lg whitespace-nowrap">Download Resume</span>
              </a>
            </div>

             {/* Description - Visible on Mobile */}
             <p className="block text-gray-300 text-xs md:text-xl font-medium max-w-lg drop-shadow-md opacity-80 md:opacity-100">
                {profile.tagline || "I love watching movies, so why not a portfolio like that?"}
            </p>
        </div>
      </div>
      
      {/* Desktop Bottom Right Badge (Absolute) */}
      <div className={`hidden md:flex absolute bottom-[12%] right-0 bg-[#181818]/60 backdrop-blur-md border-l-4 ${badgeBorder} py-2 px-5 items-center space-x-3 rounded-l-md shadow-2xl z-20`}>
          <Calendar className={`${iconColor} w-5 h-5`} />
          <div className="flex flex-col">
            <span className="uppercase text-[10px] font-bold text-gray-400 tracking-wider">Availability</span>
            <span className={`font-bold ${profile.availability?.status === 'available' ? 'text-white' : color} text-sm`}>{text}</span>
          </div>
      </div>
    </div>
  );
};

export default Hero;