import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Habit, HabitStats } from '@/lib/habitTypes';
import { Check, Flame, Trash2, TrendingUp, StickyNote, X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeColor } from '@/hooks/use-theme-color';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  stats: HabitStats;
  todayNote: string;
  onToggle: () => void;
  onDelete: () => void;
  onSaveNote: (note: string) => void;
}

export const HabitCard = ({ habit, isCompletedToday, stats, todayNote, onToggle, onDelete, onSaveNote }: HabitCardProps) => {
  const [justCompleted, setJustCompleted] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(todayNote);
  const { themeColor } = useThemeColor();

  const handleToggle = () => {
    if (!isCompletedToday) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
    onToggle();
  };

  const handleSaveNote = () => {
    onSaveNote(noteText);
    setNoteOpen(false);
  };

  const handleOpenNote = (open: boolean) => {
    if (open) {
      setNoteText(todayNote);
    }
    setNoteOpen(open);
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
              ? "shadow-md brightness-110"
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

          {/* Show note preview if exists */}
          {todayNote && (
            <p className="mt-2 text-sm text-muted-foreground italic truncate">
              📝 {todayNote}
            </p>
          )}
        </div>

        {/* Note Button */}
        <Popover open={noteOpen} onOpenChange={handleOpenNote}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "transition-opacity text-muted-foreground hover:text-foreground",
                todayNote ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              <StickyNote className={cn("w-4 h-4", todayNote && "text-primary")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Today's Log Note</h4>
              <Textarea
                placeholder="How did it go? Any thoughts..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setNoteOpen(false)}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveNote}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

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
