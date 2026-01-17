import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface NotificationPrefs {
  enabled: boolean;
  reminderTime: string; // "HH:mm"
  lastReminderDate: string | null;
}

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    enabled: true,
    reminderTime: '20:00',
    lastReminderDate: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem('notification-preferences');
    if (stored) {
      setPrefs(JSON.parse(stored));
    }
  }, []);

  const savePrefs = () => {
    localStorage.setItem('notification-preferences', JSON.stringify(prefs));
    toast.success('Notification preferences saved!');
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <CardTitle>Notifications</CardTitle>
        </div>
        <CardDescription>
          Get reminded to complete your habits
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Reminders</Label>
            <p className="text-xs text-muted-foreground">Receive daily habit alerts</p>
          </div>
          <Switch
            checked={prefs.enabled}
            onCheckedChange={(checked) => setPrefs({ ...prefs, enabled: checked })}
          />
        </div>

        {prefs.enabled && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Reminder Time</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="time"
                value={prefs.reminderTime}
                onChange={(e) => setPrefs({ ...prefs, reminderTime: e.target.value })}
                className="flex-1"
              />
              <Button onClick={savePrefs} size="icon" className="shrink-0">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
