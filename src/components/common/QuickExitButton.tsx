import React from 'react';
import { LogOut } from 'lucide-react';

interface QuickExitButtonProps {
  onQuickExit: () => void;
  className?: string;
}

export const QuickExitButton: React.FC<QuickExitButtonProps> = ({ onQuickExit, className = '' }) => {
  return (
    <button
      onClick={onQuickExit}
      title="Saída Imediata (Limpa a tela e volta à camuflagem)"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-full shadow-sm transition-all active:scale-95 ${className}`}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Saída Rápida</span>
    </button>
  );
};
