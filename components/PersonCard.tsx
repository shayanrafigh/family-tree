import React from 'react';
import { PersonData } from '../types';
import { User, Calendar, Trash2, Heart } from 'lucide-react';

interface PersonCardProps {
  person: PersonData;
  onChange: (data: Partial<PersonData>) => void;
  onDelete?: () => void;
  isSpouse?: boolean;
  canDelete?: boolean;
}

export const PersonCard: React.FC<PersonCardProps> = ({ 
  person, 
  onChange, 
  onDelete, 
  isSpouse = false,
  canDelete = false
}) => {
  const isMale = person.gender === 'male';
  
  // Theme configuration based on gender
  const theme = {
    bg: isMale ? 'bg-blue-50' : 'bg-pink-50',
    border: isMale ? 'border-blue-200' : 'border-pink-200',
    iconBg: isMale ? 'bg-blue-100' : 'bg-pink-100',
    iconColor: isMale ? 'text-blue-600' : 'text-pink-600',
    focusRing: isMale ? 'focus-within:ring-blue-200' : 'focus-within:ring-pink-200',
  };

  const toggleGender = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ gender: isMale ? 'female' : 'male' });
  };

  return (
    <div className={`relative group w-52 flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border ${theme.border} overflow-hidden`}>
      
      {/* Card Header / Drag Handle */}
      <div className={`h-1.5 w-full ${isMale ? 'bg-blue-400' : 'bg-pink-400'}`}></div>

      <div className="p-3 flex flex-col gap-3">
        {/* Header: Icon & Title */}
        <div className="flex items-start gap-3">
          <button 
            onClick={toggleGender}
            className={`flex-shrink-0 w-8 h-8 rounded-full ${theme.iconBg} ${theme.iconColor} flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer`}
            title="Toggle Gender"
          >
            <User size={16} strokeWidth={2.5} />
          </button>
          
          <div className="flex-1 min-w-0 flex flex-col group/inputs">
             <input
              type="text"
              value={person.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Title"
              className="w-full text-xs font-semibold text-slate-400 placeholder-slate-300 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-slate-300 p-0 focus:ring-0 mb-0.5 tracking-wide uppercase transition-colors"
            />
            <input
              type="text"
              value={person.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full text-base font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-400 p-0 focus:ring-0 placeholder-slate-300 leading-tight transition-colors"
              placeholder="Name"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-100"></div>

        {/* Date Inputs */}
        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 rounded-md p-1.5 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-slate-400" />
            <input
              type="text"
              value={person.birthYear || ''}
              onChange={(e) => onChange({ birthYear: e.target.value })}
              placeholder="Born"
              className="w-10 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:border-slate-400 focus:outline-none transition-colors"
            />
            <span className="text-slate-300">-</span>
            <input
              type="text"
              value={person.deathYear || ''}
              onChange={(e) => onChange({ deathYear: e.target.value })}
              placeholder="Died"
              className="w-10 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:border-slate-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Delete Button (Hover only) */}
      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="absolute -top-1 -right-1 bg-white border border-slate-200 text-slate-400 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 shadow-sm z-20 cursor-pointer"
          title="Remove Person"
        >
          <Trash2 size={12} />
        </button>
      )}

      {/* Spouse Indicator (if applicable) */}
      {isSpouse && (
         <div className="absolute top-2 right-2 text-pink-300 opacity-20 pointer-events-none">
           <Heart size={40} fill="currentColor" />
         </div>
      )}
    </div>
  );
};
