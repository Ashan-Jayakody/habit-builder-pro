import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Habit } from '@/lib/habitTypes';
import { format, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { StickyNote } from 'lucide-react';
import { useThemeColor } from '@/hooks/use-theme-color';

interface WeeklyProgressProps {
  habits: Habit[];
  getWeeklyData: (habit: Habit) => Array<{
    date: Date;
    dayName: string;
    isCompleted: boolean;
  }>;
  getNoteForDate: (habit: Habit, date: Date) => string;
}

export const WeeklyProgress = ({ habits, getWeeklyData, getNoteForDate }: WeeklyProgressProps) => {
  const [selectedDay, setSelectedDay] = useState<{ date: Date; note: string } | null>(null);
  const { themeColor } = useThemeColor();

  if (habits.length === 0) return null;

  const weekDays = getWeeklyData(habits[0]);

  return (
    <>
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Day Headers */}
            <div className="flex items-center gap-3">
              <div className="w-8 flex-shrink-0" />
              <div className="grid grid-cols-7 gap-2 flex-1 text-center">
                {weekDays.map((day) => (
                  <div
                    key={day.dayName}
                    className={cn(
                      "text-xs font-medium",
                      isToday(day.date) ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {day.dayName}
                    <div className={cn(
                      "text-[10px] mt-0.5",
                      isToday(day.date) && "font-bold"
                    )}>
                      {format(day.date, 'd')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Habit Rows */}
            {habits.map((habit) => {
              const data = getWeeklyData(habit);
              return (
                <div key={habit.id} className="flex items-center gap-3">
                  <div className="w-8 text-center text-lg flex-shrink-0">
                    {habit.emoji}
                  </div>
                  <div className="grid grid-cols-7 gap-2 flex-1">
                    {data.map((day, idx) => {
                      const note = getNoteForDate(habit, day.date);
                      const hasNote = !!note;

                      return (
                        <div
                          key={idx}
                          className={cn(
                            "aspect-square rounded-md flex items-center justify-center transition-all relative",
                            day.isCompleted
                              ? "shadow-sm cursor-pointer hover:shadow-md"
                              : "bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-80"
                          )}
                          style={{
                            backgroundColor: day.isCompleted ? habit.color : undefined,
                          }}
                          onClick={() => hasNote && setSelectedDay({ date: day.date, note })}
                        >
                          {day.isCompleted && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          {hasNote && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                              <StickyNote className="w-2 h-2 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDay && format(selectedDay.date, 'EEEE, MMMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
            {selectedDay?.note}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
