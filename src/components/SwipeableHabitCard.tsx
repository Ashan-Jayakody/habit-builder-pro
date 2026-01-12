import React, { useState, useRef, useCallback } from 'react';
import { Habit, HabitStats } from '@/lib/habitTypes';
import { HabitCard } from './HabitCard';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SwipeableHabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  stats: HabitStats;
  todayNote: string;
  onToggle: () => void;
  onDelete: () => void;
  onSaveNote: (note: string) => void;
}

export const SwipeableHabitCard = ({
  habit,
  isCompletedToday,
  stats,
  todayNote,
  onToggle,
  onDelete,
  onSaveNote,
}: SwipeableHabitCardProps) => {
  const [swipeX, setSwipeX] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isSwipingHorizontal = useRef<boolean | null>(null);
  const { impact, notification } = useHaptics();

  const swipeThreshold = 80;
  const maxSwipe = 100;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isSwipingHorizontal.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX.current;
    const diffY = currentY - startY.current;

    // Determine swipe direction on first significant movement
    if (isSwipingHorizontal.current === null) {
      if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
        isSwipingHorizontal.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (!isSwipingHorizontal.current) return;

    // Swipe right = complete, Swipe left = delete
    const clampedX = Math.max(-maxSwipe, Math.min(maxSwipe, diffX));
    setSwipeX(clampedX);

    // Haptic feedback at threshold
    if (Math.abs(clampedX) >= swipeThreshold && Math.abs(swipeX) < swipeThreshold) {
      impact('medium');
    }
  }, [swipeX, impact]);

  const handleTouchEnd = useCallback(() => {
    if (swipeX >= swipeThreshold && !isCompletedToday) {
      // Swipe right - complete
      notification('success');
      onToggle();
    } else if (swipeX <= -swipeThreshold) {
      // Swipe left - delete
      notification('warning');
      setShowDeleteDialog(true);
    }

    setSwipeX(0);
    isSwipingHorizontal.current = null;
  }, [swipeX, isCompletedToday, onToggle, notification]);

  const progress = Math.abs(swipeX) / swipeThreshold;

  return (
    <>
      <div className="relative overflow-hidden rounded-xl">
        {/* Left action (complete) */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex items-center justify-start pl-4 transition-opacity rounded-l-xl",
            swipeX > 0 ? "bg-success" : "bg-transparent"
          )}
          style={{
            width: Math.max(swipeX, 0),
            opacity: swipeX > 0 ? Math.min(progress, 1) : 0,
          }}
        >
          <Check className="w-6 h-6 text-success-foreground" />
        </div>

        {/* Right action (delete) */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex items-center justify-end pr-4 transition-opacity rounded-r-xl",
            swipeX < 0 ? "bg-destructive" : "bg-transparent"
          )}
          style={{
            width: Math.max(-swipeX, 0),
            opacity: swipeX < 0 ? Math.min(progress, 1) : 0,
          }}
        >
          <Trash2 className="w-6 h-6 text-destructive-foreground" />
        </div>

        {/* Card content */}
        <div
          className="relative transition-transform touch-pan-y"
          style={{
            transform: `translateX(${swipeX}px)`,
            transition: swipeX === 0 ? 'transform 0.3s ease-out' : 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <HabitCard
            habit={habit}
            isCompletedToday={isCompletedToday}
            stats={stats}
            todayNote={todayNote}
            onToggle={onToggle}
            onDelete={onDelete}
            onSaveNote={onSaveNote}
          />
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{habit.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and all its tracking data.
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
    </>
  );
};
