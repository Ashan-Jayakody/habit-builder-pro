import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit } from '@/lib/habitTypes';
import { format, startOfMonth, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MonthlyProgressProps {
  habits: Habit[];
  getMonthlyData: (habit: Habit, date: Date) => Array<{
    date: Date;
    dayNumber: string;
    isCompleted: boolean;
  }>;
  getNoteForDate: (habit: Habit, date: Date) => string;
}

export const MonthlyProgress = ({ habits, getMonthlyData, getNoteForDate }: MonthlyProgressProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '');

  if (habits.length === 0) return null;

  const selectedHabit = habits.find(h => h.id === selectedHabitId) || habits[0];
  const monthlyData = getMonthlyData(selectedHabit, currentMonth);
  const completedCount = monthlyData.filter(d => d.isCompleted).length;

  // Get the day of week for the first day of the month (0 = Sunday)
  const firstDayOfMonth = startOfMonth(currentMonth);
  const startingDayOfWeek = getDay(firstDayOfMonth);
  // Adjust for Monday start (0 = Monday)
  const emptyDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <TooltipProvider>
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Monthly View</CardTitle>
            <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {habits.map(habit => (
                  <SelectItem key={habit.id} value={habit.id}>
                    <span className="flex items-center gap-2">
                      <span>{habit.emoji}</span>
                      <span className="truncate">{habit.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the 1st */}
            {Array.from({ length: emptyDays }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}
            
            {/* Actual days */}
            {monthlyData.map((day, idx) => {
              const note = getNoteForDate(selectedHabit, day.date);
              const hasNote = !!note;

              const dayBox = (
                <div
                  className={cn(
                    "aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all relative",
                    day.isCompleted
                      ? "text-white shadow-sm"
                      : "bg-muted text-muted-foreground"
                  )}
                  style={{
                    backgroundColor: day.isCompleted ? selectedHabit.color : undefined,
                  }}
                >
                  {day.dayNumber}
                  {hasNote && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full flex items-center justify-center">
                      <StickyNote className="w-1.5 h-1.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              );

              if (hasNote) {
                return (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      {dayBox}
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <p className="text-xs font-medium mb-1">{format(day.date, 'MMM d')}</p>
                      <p className="text-xs">{note}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={idx}>{dayBox}</div>;
            })}
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completed this month:</span>
            <span className="font-semibold" style={{ color: selectedHabit.color }}>
              {completedCount} / {monthlyData.length} days
            </span>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
