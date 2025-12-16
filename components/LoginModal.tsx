import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (success) {
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-[450px] bg-black/80 p-8 md:p-14 rounded-lg relative ring-1 ring-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
            <X size={24} />
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-8">Sign In</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(false);
                    }}
                    className={`w-full bg-[#333] rounded px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:bg-[#454545] transition ${error ? 'border-b-2 border-[#e87c03]' : ''}`}
                />
                {error && (
                    <div className="text-[#e87c03] text-xs mt-2 absolute -bottom-5 left-0">
                        Incorrect password.
                    </div>
                )}
            </div>
            
            <button 
                type="submit"
                className="w-full bg-[#e50914] text-white font-bold py-3.5 rounded mt-6 hover:bg-[#f6121d] transition duration-200"
            >
                Sign In
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;