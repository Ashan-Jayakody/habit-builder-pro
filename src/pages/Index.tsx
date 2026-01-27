import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarDays, LayoutGrid, Calendar, FileText, Target, UserCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoalView } from '@/components/GoalView';
import { Onboarding } from '@/components/Onboarding';
import { quotes } from '@/lib/quotes';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/useNotifications';
import { HabitCompanion } from '@/components/HabitCompanion';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('user_name'));
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('user_name'));
  const [showCelebration, setShowCelebration] = useState(false);
  const [showGrowthInfo, setShowGrowthInfo] = useState(false);
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
    toggleHabitFreeze,
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
    useFreeze,
    resetMomentum,
  } = useMomentumBank(habits, isHabitCompletedOnDate);

  const handleUseFreeze = (habitId: string) => {
    toggleHabitFreeze(habitId);
    useFreeze();
    toast.success('Streak frozen for this habit!');
  };

  // Check if all habits are completed to trigger celebration
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const completedToday = habits.filter(h => isHabitCompletedOnDate(h, today)).length;
  const allHabitsCompleted = habits.length > 0 && completedToday === habits.length;

  const currentLevel = habits.length < 6 ? 'Seed' : habits.length <= 10 ? 'Sprout' : 'Tree';
  const levelEmoji = habits.length < 6 ? '🌱' : habits.length <= 10 ? '🌿' : '🌳';

  // Track which habits have already awarded points today
  const [awardedHabitIds, setAwardedHabitIds] = useState<string[]>(() => {
    const stored = localStorage.getItem('awarded_habit_ids');
    const date = localStorage.getItem('awarded_habit_date');
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (date === todayStr && stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Award momentum points only once per habit per day
  useEffect(() => {
    const newlyCompletedHabits = habits.filter(h => 
      isHabitCompletedOnDate(h, today) && !awardedHabitIds.includes(h.id)
    );

    if (newlyCompletedHabits.length > 0) {
      const newIds = [...awardedHabitIds, ...newlyCompletedHabits.map(h => h.id)];
      setAwardedHabitIds(newIds);
      awardPoints(newlyCompletedHabits.length * 10);
      
      localStorage.setItem('awarded_habit_ids', JSON.stringify(newIds));
      localStorage.setItem('awarded_habit_date', todayStr);
    }
  }, [habits, awardedHabitIds, awardPoints, todayStr, isHabitCompletedOnDate]);

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
      
      // Auto-hide celebration after some time
      setTimeout(() => setShowCelebration(false), 5000);
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

  const sortedHabits = [...habits].sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const weightA = priorityWeight[a.priority || 'medium'];
    const weightB = priorityWeight[b.priority || 'medium'];
    return weightB - weightA;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Celebration Popup */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-24 z-[150] flex justify-center pointer-events-none"
          >
            <div className="bg-white dark:bg-slate-900 border border-primary/20 shadow-2xl rounded-3xl p-6 flex items-center gap-4 max-w-md w-full pointer-events-auto">
              <div className="h-16 w-16 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center">
                <HabitCompanion completedCount={habits.length} size={48} isCelebrating={true} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">Amazing Job! 🌟</h3>
                <p className="text-sm text-muted-foreground">You've smashed all your goals for today. Keep this momentum going!</p>
              </div>
              <button 
                onClick={() => setShowCelebration(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={cn(
        "sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border w-full transition-all duration-300",
        isFocusModeActive && "blur-sm pointer-events-none opacity-50"
      )}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <SettingsMenu
                userName={userName || 'User'}
                onNameChange={handleNameChange}
                onResetAll={handleResetAll}
                habits={habits}
                goals={goals}
              />
              <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors">
                <UserCircle className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-none transition-all truncate">
                  Hi, {userName}
                </h1>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {format(today, 'EEEE, MMMM d')}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <AddHabitDialog onAdd={addHabit} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 transition-all duration-300">
          <p className="text-foreground/80 text-sm font-medium text-center leading-relaxed italic">
            "{dailyQuote}"
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Momentum Bank */}
        {habits.length > 0 && viewMode === 'today' && (
          <MomentumBank
            momentumPoints={momentumPoints}
            currentStreak={currentStreak}
            freezePotential={freezePotential}
            freezesUsed={freezesUsed}
            habits={habits}
            onUseFreeze={handleUseFreeze}
          />
        )}

            {/* Progress Summary */}
            {habits.length > 0 && viewMode === 'today' && (
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20">
                  <div className="flex items-center justify-between text-primary-foreground">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm opacity-90">Today's Progress</p>
                        <button 
                          onClick={() => setShowGrowthInfo(true)}
                          className="hover:scale-110 transition-transform p-1 rounded-full hover:bg-white/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-3xl font-bold">
                        {completedToday} / {habits.length}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center shadow-sm overflow-hidden p-1">
                        <HabitCompanion 
                          completedCount={completedToday} 
                          size={64} 
                          isCelebrating={showCelebration}
                        />
                      </div>
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        {levelEmoji} {currentLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showGrowthInfo && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 z-[110]"
                    >
                      <div className="bg-white dark:bg-slate-900 border border-primary/20 shadow-2xl rounded-2xl p-4 overflow-hidden">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold flex items-center gap-2">
                            <span className="p-1.5 bg-primary/10 rounded-lg">🌱</span>
                            Growth Stages
                          </h4>
                          <button onClick={() => setShowGrowthInfo(false)} className="p-1 hover:bg-muted rounded-full">
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className={cn("p-2.5 rounded-xl border transition-all", habits.length < 6 ? "bg-primary/10 border-primary/30 scale-[1.02]" : "bg-muted/30 border-transparent opacity-60")}>
                            <p className="text-xs font-bold flex items-center gap-2">🌱 Seed (1-5 habits)</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Starting small is the key to deep roots. Focus on consistency!</p>
                          </div>
                          <div className={cn("p-2.5 rounded-xl border transition-all", habits.length >= 6 && habits.length <= 10 ? "bg-primary/10 border-primary/30 scale-[1.02]" : "bg-muted/30 border-transparent opacity-60")}>
                            <p className="text-xs font-bold flex items-center gap-2">🌿 Sprout (6-10 habits)</p>
                            <p className="text-[10px] text-muted-foreground mt-1">You're branching out! Balancing more habits builds serious discipline.</p>
                          </div>
                          <div className={cn("p-2.5 rounded-xl border transition-all", habits.length > 10 ? "bg-primary/10 border-primary/30 scale-[1.02]" : "bg-muted/30 border-transparent opacity-60")}>
                            <p className="text-xs font-bold flex items-center gap-2">🌳 Tree (11+ habits)</p>
                            <p className="text-[10px] text-muted-foreground mt-1">A flourishing life! You have the strength to weather any storm.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

        {/* Content */}
        {habits.length === 0 && viewMode !== 'goals' ? (
          <EmptyState />
        ) : (
          <>
            {viewMode === 'today' && (
              <div className="space-y-3">
                {sortedHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompletedToday={isHabitCompletedOnDate(habit, today)}
                    stats={getHabitStats(habit)}
                    todayNote={getNoteForDate(habit, today)}
                    onToggle={() => toggleHabitCompletion(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                    onSaveNote={(note) => addNote(habit.id, today, note)}
                    onFocusModeChange={setIsFocusModeActive}
                  />
                ))}
              </div>
            )}

            {viewMode === 'week' && (
              <div className="space-y-6">
                <StatsOverview habits={habits} getHabitStats={getHabitStats} />
                <Tabs defaultValue="weekly" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-10 mb-4">
                    <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                    <TabsTrigger value="report" className="text-xs">Report</TabsTrigger>
                  </TabsList>
                  <TabsContent value="weekly" className="mt-0">
                    <WeeklyProgress habits={habits} getWeeklyData={getWeeklyData} getNoteForDate={getNoteForDate} />
                  </TabsContent>
                  <TabsContent value="monthly" className="mt-0">
                    <MonthlyProgress habits={habits} getMonthlyData={getMonthlyData} getNoteForDate={getNoteForDate} />
                  </TabsContent>
                  <TabsContent value="report" className="mt-0">
                    <MonthlyReport 
                      habits={habits} 
                      getHabitStats={getHabitStats} 
                      getMonthlyData={getMonthlyData} 
                    />
                  </TabsContent>
                </Tabs>
              </div>
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 pb-safe">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-around">
          <button
            onClick={() => setViewMode('today')}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors min-w-16",
              viewMode === 'today' ? "text-primary" : "text-muted-foreground"
            )}
          >
            <LayoutGrid className="w-6 h-6" />
            <span className="text-[10px] font-medium">Today</span>
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors min-w-16",
              viewMode === 'week' ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-medium">Overview</span>
          </button>
          <button
            onClick={() => setViewMode('goals')}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors min-w-16",
              viewMode === 'goals' ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Target className="w-6 h-6" />
            <span className="text-[10px] font-medium">Goals</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
