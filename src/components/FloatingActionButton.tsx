import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingActionButton = ({ onClick, className }: FloatingActionButtonProps) => {
  const { impact } = useHaptics();

  const handleClick = () => {
    impact('medium');
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed bottom-20 right-4 z-50",
        "w-14 h-14 rounded-full",
        "bg-primary text-primary-foreground",
        "shadow-lg shadow-primary/30",
        "flex items-center justify-center",
        "transition-all duration-200",
        "hover:scale-110 hover:shadow-xl hover:shadow-primary/40",
        "active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      aria-label="Add new habit"
    >
      <Plus className="w-7 h-7" />
    </button>
  );
};
