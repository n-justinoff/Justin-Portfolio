import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';

interface RestrictedAccessProps {
  onBack: () => void;
}

const RestrictedAccess: React.FC<RestrictedAccessProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#141414] text-white p-6 animate-in fade-in zoom-in duration-300">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <ArrowLeft /> Back
      </button>

      <div className="bg-[#1f1f1f] p-12 rounded-2xl shadow-2xl max-w-lg text-center border border-gray-800">
        <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-black mb-4 uppercase tracking-wide">Access Restricted</h1>
        
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          This project contains sensitive or confidential information. 
          To view the live project or detailed documentation, please contact the designer directly.
        </p>

        <a 
          href="mailto:n.justinoff@gmail.com"
          className="inline-block bg-white text-black font-bold px-8 py-3 rounded hover:bg-gray-200 transition"
        >
          Contact Justin for Access
        </a>
      </div>
    </div>
  );
};

export default RestrictedAccess;