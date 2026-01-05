import { Target } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl gradient-warm flex items-center justify-center mb-6 shadow-warm">
        <Target className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
      <p className="text-muted-foreground max-w-sm">
        Start building better habits today! Add your first habit and begin tracking your progress.
      </p>
    </div>
  );
};
