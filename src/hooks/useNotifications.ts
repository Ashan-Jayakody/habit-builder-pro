import { useEffect } from 'react';
import { toast } from 'sonner';

export const useNotifications = (habits: any[], isHabitCompletedOnDate: (habit: any, date: Date) => boolean) => {
  useEffect(() => {
    const requestPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };
    requestPermission();
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const storedPrefs = localStorage.getItem('notification-preferences');
      const prefs = storedPrefs ? JSON.parse(storedPrefs) : { enabled: true, reminderTime: '20:00' };

      if (!prefs.enabled) return;

      const now = new Date();
      const [targetHours, targetMinutes] = prefs.reminderTime.split(':').map(Number);
      
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Check if it's time (within the hour of the target time)
      if (currentHours === targetHours && currentMinutes >= targetMinutes) {
        const lastReminder = localStorage.getItem('last-habit-reminder');
        const todayStr = now.toDateString();

        if (lastReminder !== todayStr) {
          const incompleteHabits = habits.filter(h => !isHabitCompletedOnDate(h, now));
          
          if (incompleteHabits.length > 0) {
            const body = `You still have ${incompleteHabits.length} habits to complete today!`;

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Habit Reminder', { body, icon: '/favicon.ico' });
            } else {
              toast.info(body);
            }
            localStorage.setItem('last-habit-reminder', todayStr);
          }
        }
      }
    };

    const interval = setInterval(checkReminders, 1000 * 60 * 5); // Check every 5 minutes
    checkReminders();

    return () => clearInterval(interval);
  }, [habits, isHabitCompletedOnDate]);
};
