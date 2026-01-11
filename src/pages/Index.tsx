import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { useHabits } from '@/hooks/useHabits';
import { useMomentumBank } from '@/hooks/useMomentumBank';
import { ViewMode } from '@/lib/habitTypes';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { HabitCard } from '@/components/HabitCard';
import { WeeklyProgress } from '@/components/WeeklyProgress';
import { MonthlyProgress } from '@/components/MonthlyProgress';
import { MonthlyReport } from '@/components/MonthlyReport';
import { StatsOverview } from '@/components/StatsOverview';
import { EmptyState } from '@/components/EmptyState';
import { SettingsMenu } from '@/components/SettingsMenu';
import { MomentumBank } from '@/components/MomentumBank';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, LayoutGrid, Calendar, FileText, Target, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoalView } from '@/components/GoalView';
import { Onboarding } from '@/components/Onboarding';
import { quotes } from '@/lib/quotes';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/useNotifications';
import { PenguinCelebration } from '@/components/PenguinCelebration';
import { Penguin } from '@/components/Penguin';
import { Puppy } from '@/components/Puppy';
import { HabitCompanion } from '@/components/HabitCompanion';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('user_name'));
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('user_name'));
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCelebrationDate, setLastCelebrationDate] = useState<string | null>(
    localStorage.getItem('last_celebration_date')
  );

  const [dailyQuote, setDailyQuote] = useState("");

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % quotes.length;
    setDailyQuote(quotes[quoteIndex]);
  }, []);

  const {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompletedOnDate,
    getHabitStats,
    getWeeklyData,
    getMonthlyData,
    addNote,
    getNoteForDate,
    goals,
    addGoal,
    deleteGoal,
    toggleGoalDay,
    addGoalLog,
  } = useHabits();

  useNotifications(habits, isHabitCompletedOnDate);

  // Momentum Bank hook
  const {
    momentumPoints,
    currentStreak,
    freezePotential,
    freezesUsed,
    awardPoints,
    updateStreak,
    resetMomentum,
  } = useMomentumBank(habits, isHabitCompletedOnDate);

  // Check if all habits are completed to trigger celebration
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const completedToday = habits.filter(h => isHabitCompletedOnDate(h, today)).length;
  const allHabitsCompleted = habits.length > 0 && completedToday === habits.length;
  const prevCompletedRef = useRef(completedToday);

  // Track habit completions and award momentum points
  useEffect(() => {
    if (completedToday > prevCompletedRef.current) {
      // A habit was just completed - award points
      awardPoints(10);
    }
    prevCompletedRef.current = completedToday;
  }, [completedToday, awardPoints]);

  // Update streak when all habits completed for the day
  const hasAwardedStreakToday = useRef(false);
  useEffect(() => {
    if (allHabitsCompleted && !hasAwardedStreakToday.current) {
      updateStreak(true);
      hasAwardedStreakToday.current = true;
    }
    // Reset the ref when date changes
    const checkDate = localStorage.getItem('streak_awarded_date');
    if (checkDate !== todayStr) {
      hasAwardedStreakToday.current = false;
      if (allHabitsCompleted) {
        localStorage.setItem('streak_awarded_date', todayStr);
      }
    }
  }, [allHabitsCompleted, todayStr, updateStreak]);

  useEffect(() => {
    if (allHabitsCompleted && lastCelebrationDate !== todayStr) {
      setShowCelebration(true);
      setLastCelebrationDate(todayStr);
      localStorage.setItem('last_celebration_date', todayStr);
    }
  }, [allHabitsCompleted, lastCelebrationDate, todayStr]);

  const handleCloseCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);
  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem('user_name', name);
    setUserName(name);
    setShowOnboarding(false);
  };

  const handleNameChange = (newName: string) => {
    localStorage.setItem('user_name', newName);
    setUserName(newName);
    toast.success('Name updated successfully!');
  };

  const handleResetAll = () => {
    localStorage.removeItem('habits-tracker-data');
    localStorage.removeItem('goals-tracker-data');
    localStorage.removeItem('last_celebration_date');
    localStorage.removeItem('momentum-bank-data');
    localStorage.removeItem('streak_awarded_date');
    resetMomentum();
    window.location.reload();
  };


  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SettingsMenu
                userName={userName || 'User'}
                onNameChange={handleNameChange}
                onResetAll={handleResetAll}
                habits={habits}
                goals={goals}
              />
              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors">
                <UserCircle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-none transition-all">
                  Hi, {userName}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(today, 'EEEE, MMMM d')}
                </p>
              </div>
            </div>
            <AddHabitDialog onAdd={addHabit} />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 transition-all duration-300">
          <p className="text-foreground/80 text-sm font-medium text-center leading-relaxed italic">
            "{dailyQuote}"
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Momentum Bank */}
        {habits.length > 0 && (
          <MomentumBank
            momentumPoints={momentumPoints}
            currentStreak={currentStreak}
            freezePotential={freezePotential}
            freezesUsed={freezesUsed}
          />
        )}

        {/* Progress Summary */}
        {habits.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20">
            <div className="flex items-center justify-between text-primary-foreground">
              <div>
                <p className="text-sm opacity-90">Today's Progress</p>
                <p className="text-3xl font-bold">
                  {completedToday} / {habits.length}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden p-1">
                <HabitCompanion 
                  completedCount={habits.reduce((acc, h) => acc + h.completedDates.length, 0)} 
                  size={64} 
                  isCelebrating={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* View Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="grid w-full grid-cols-5 h-11">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Today</span>
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Week</span>
            </TabsTrigger>
            <TabsTrigger value="month" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Month</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Report</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content */}
        {habits.length === 0 && viewMode !== 'goals' ? (
          <EmptyState />
        ) : (
          <>
            {viewMode === 'today' && (
              <div className="space-y-3">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompletedToday={isHabitCompletedOnDate(habit, today)}
                    stats={getHabitStats(habit)}
                    todayNote={getNoteForDate(habit, today)}
                    onToggle={() => toggleHabitCompletion(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                    onSaveNote={(note) => addNote(habit.id, today, note)}
                  />
                ))}
              </div>
            )}

            {viewMode === 'week' && (
              <div className="space-y-6">
                <StatsOverview habits={habits} getHabitStats={getHabitStats} />
                <WeeklyProgress habits={habits} getWeeklyData={getWeeklyData} getNoteForDate={getNoteForDate} />
              </div>
            )}

            {viewMode === 'month' && (
              <div className="space-y-6">
                <StatsOverview habits={habits} getHabitStats={getHabitStats} />
                <MonthlyProgress habits={habits} getMonthlyData={getMonthlyData} getNoteForDate={getNoteForDate} />
              </div>
            )}

            {viewMode === 'report' && (
              <MonthlyReport 
                habits={habits} 
                getHabitStats={getHabitStats} 
                getMonthlyData={getMonthlyData} 
              />
            )}

            {viewMode === 'goals' && (
              <GoalView
                goals={goals}
                onAddGoal={addGoal}
                onDeleteGoal={deleteGoal}
                onToggleDay={toggleGoalDay}
                onAddLog={addGoalLog}
              />
            )}
          </>
        )}
      </main>

      {/* Penguin Celebration */}
      <PenguinCelebration
        isVisible={showCelebration}
        onClose={handleCloseCelebration}
        userName={userName || undefined}
        habits={habits}
      />
    </div>
  );
};

export default Index;
