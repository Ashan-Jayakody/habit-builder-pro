import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/lib/habitTypes';
import { format, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeeklyProgressProps {
  habits: Habit[];
  getWeeklyData: (habit: Habit) => Array<{
    date: Date;
    dayName: string;
    isCompleted: boolean;
  }>;
}

export const WeeklyProgress = ({ habits, getWeeklyData }: WeeklyProgressProps) => {
  if (habits.length === 0) return null;

  const weekDays = getWeeklyData(habits[0]);

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 text-center">
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

          {/* Habit Rows */}
          {habits.map((habit) => {
            const data = getWeeklyData(habit);
            return (
              <div key={habit.id} className="flex items-center gap-3">
                <div className="w-8 text-center text-lg flex-shrink-0">
                  {habit.emoji}
                </div>
                <div className="grid grid-cols-7 gap-2 flex-1">
                  {data.map((day, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "aspect-square rounded-md flex items-center justify-center transition-all",
                        day.isCompleted
                          ? "shadow-sm"
                          : "bg-muted"
                      )}
                      style={{
                        backgroundColor: day.isCompleted ? habit.color : undefined,
                      }}
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
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
