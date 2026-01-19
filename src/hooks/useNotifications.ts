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
      const now = new Date();
      // Only remind in the evening (e.g., after 8 PM)
      if (now.getHours() >= 20) {
        const lastReminder = localStorage.getItem('last-habit-reminder');
        const todayStr = now.toDateString();

        if (lastReminder !== todayStr) {
          const incompleteHabits = habits.filter(h => !isHabitCompletedOnDate(h, now));
          
          if (incompleteHabits.length > 0) {
            const title = 'Habit Reminder';
            const body = `You still have ${incompleteHabits.length} habits to complete today!`;

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(title, { body, icon: '/favicon.ico' });
            } else {
              toast.info(body);
            }
            localStorage.setItem('last-habit-reminder', todayStr);
          }
        }
      }
    };

    // Check every hour
    const interval = setInterval(checkReminders, 1000 * 60 * 60);
    checkReminders();

    return () => clearInterval(interval);
  }, [habits, isHabitCompletedOnDate]);
};
