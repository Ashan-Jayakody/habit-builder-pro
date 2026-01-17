import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Menu, User, Moon, Sun, Trash2, TrendingUp, Bell, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { Habit, Goal } from '@/lib/habitTypes';
import { useThemeColor, themeColors, ThemeColor } from '@/hooks/use-theme-color';
import { cn } from '@/lib/utils';
import { NotificationSettings } from './NotificationSettings';

interface SettingsMenuProps {
  userName: string;
  onNameChange: (newName: string) => void;
  onResetAll: () => void;
  habits: Habit[];
  goals: Goal[];
}

export const SettingsMenu = ({ userName, onNameChange, onResetAll, habits, goals }: SettingsMenuProps) => {
  const [open, setOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [newName, setNewName] = useState(userName);
  const { theme, setTheme } = useTheme();
  const { themeColor, setThemeColor } = useThemeColor();

  const handleNameSave = () => {
    if (newName.trim()) {
      onNameChange(newName.trim());
      setShowNameDialog(false);
      setOpen(false);
    }
  };

  const handleReset = () => {
    onResetAll();
    setShowResetDialog(false);
    setOpen(false);
  };

  const getYearlyStats = () => {
    const currentYear = new Date().getFullYear();
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 11, 31));
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    return months.map(monthDate => {
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

      let totalCompletions = 0;
      let totalPossible = 0;
      let goalsCompleted = 0;

      daysInMonth.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayHabits = habits.filter(h => {
          const habitCreated = parseISO(h.createdAt);
          return habitCreated <= day;
        });

        totalPossible += dayHabits.length;

        dayHabits.forEach(habit => {
          if (habit.completedDates.includes(dateStr)) {
            totalCompletions++;
          }
        });
      });

      goals.forEach(goal => {
        const targetDate = parseISO(goal.targetDate);
        if (targetDate >= monthStart && targetDate <= monthEnd) {
          const createdDate = parseISO(goal.createdAt);
          const totalDays = Math.ceil((targetDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          if (goal.completedDays.length >= totalDays) {
            goalsCompleted++;
          }
        }
      });

      const completionRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;

      return {
        month: format(monthDate, 'MMM'),
        completionRate,
        habitsCompleted: totalCompletions,
        goalsAchieved: goalsCompleted,
      };
    });
  };

  const yearlyData = getYearlyStats();

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 pr-6">
            <SheetTitle>Settings</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-[calc(100vh-80px)]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setNewName(userName);
                      setShowNameDialog(true);
                    }}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <Label className="text-base font-medium cursor-pointer">Change Name</Label>
                    <User className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>

                  <Separator />

                  <button
                    onClick={() => setShowNotificationSettings(true)}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <Label className="text-base font-medium cursor-pointer">Notifications</Label>
                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>

                  <Separator />

                  <div className="flex items-center justify-between p-2">
                    <Label className="text-base font-medium">Dark Mode</Label>
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? (
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Sun className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3 p-2">
                    <Label className="text-base font-medium">Theme Color</Label>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {(Object.keys(themeColors) as ThemeColor[]).map((color) => (
                        <button
                          key={color}
                          onClick={() => setThemeColor(color)}
                          className={cn(
                            "h-8 w-8 rounded-full border-2 transition-all",
                            themeColor === color ? "border-foreground scale-110 shadow-sm" : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: `hsl(${themeColors[color].primary})` }}
                          title={color.charAt(0).toUpperCase() + color.slice(1)}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <button
                    onClick={() => setShowStatsDialog(true)}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <Label className="text-base font-medium cursor-pointer">Yearly Stats</Label>
                    <TrendingUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>

                  <Separator />

                  <button
                    onClick={() => setShowResetDialog(true)}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <Label className="text-base font-medium text-destructive cursor-pointer">Reset All Data</Label>
                    <Trash2 className="h-5 w-5 text-destructive/70 group-hover:text-destructive transition-colors" />
                  </button>
                </div>
              </div>
            </ScrollArea>
            
            <div className="pt-4 pb-2 text-center border-t mt-auto">
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                HabitFlow
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium opacity-60 uppercase tracking-widest">
                Your Journey, One Step at a Time
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={showNotificationSettings} onOpenChange={setShowNotificationSettings}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <NotificationSettings />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Your Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNameSave();
                  }
                }}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowNameDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleNameSave}
                disabled={!newName.trim()}
                className="flex-1"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Yearly Statistics {new Date().getFullYear()}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-sm font-medium mb-4">Habit Completion Rate</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      label={{ value: '%', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completionRate"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Completion Rate (%)"
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-4">Monthly Activity</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="habitsCompleted"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      name="Habits Completed"
                      dot={{ fill: 'hsl(var(--chart-1))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="goalsAchieved"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      name="Goals Achieved"
                      dot={{ fill: 'hsl(var(--chart-4))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground">Total Completions</p>
                  <p className="text-2xl font-bold mt-1">
                    {yearlyData.reduce((sum, m) => sum + m.habitsCompleted, 0)}
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground">Goals Achieved</p>
                  <p className="text-2xl font-bold mt-1">
                    {yearlyData.reduce((sum, m) => sum + m.goalsAchieved, 0)}
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground">Avg. Completion</p>
                  <p className="text-2xl font-bold mt-1">
                    {Math.round(yearlyData.reduce((sum, m) => sum + m.completionRate, 0) / 12)}%
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm text-muted-foreground">Best Month</p>
                  <p className="text-2xl font-bold mt-1">
                    {yearlyData.reduce((best, m) => m.completionRate > best.completionRate ? m : best, yearlyData[0])?.month || '-'}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your habits, goals, completion history, and notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
