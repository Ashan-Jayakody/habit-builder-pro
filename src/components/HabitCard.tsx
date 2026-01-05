import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Habit, HabitStats } from '@/lib/habitTypes';
import { Check, Flame, Trash2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  stats: HabitStats;
  onToggle: () => void;
  onDelete: () => void;
}

export const HabitCard = ({ habit, isCompletedToday, stats, onToggle, onDelete }: HabitCardProps) => {
  const [justCompleted, setJustCompleted] = useState(false);

  const handleToggle = () => {
    if (!isCompletedToday) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
    onToggle();
  };

  return (
    <Card className="p-4 shadow-card border-border/50 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {/* Completion Button */}
        <button
          onClick={handleToggle}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 flex-shrink-0",
            isCompletedToday
              ? "shadow-warm"
              : "bg-muted hover:scale-105"
          )}
          style={{
            backgroundColor: isCompletedToday ? habit.color : undefined,
          }}
        >
          {isCompletedToday ? (
            <Check className={cn("w-6 h-6 text-white", justCompleted && "animate-check")} />
          ) : (
            <span>{habit.emoji}</span>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-lg truncate transition-colors",
            isCompletedToday && "text-muted-foreground line-through"
          )}>
            {habit.name}
          </h3>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Flame 
                className={cn(
                  "w-4 h-4",
                  stats.currentStreak > 0 && "text-primary",
                  justCompleted && stats.currentStreak > 0 && "animate-streak"
                )} 
              />
              <span className={cn(stats.currentStreak > 0 && "text-primary font-medium")}>
                {stats.currentStreak} day{stats.currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{stats.completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{habit.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this habit and all its tracking data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};
