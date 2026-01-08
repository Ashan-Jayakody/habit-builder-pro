package app.lovable.ef37e8d168634c0a85c5c4adc117e6fc;

import android.os.Bundle;
import android.os.Build;
import android.Manifest;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. ASK FOR PERMISSION (Android 13+)
        if (Build.VERSION.SDK_INT >= 33) {
            requestPermissions(
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    1001
            );
        }

        // 2. SCHEDULE REMINDERS
        // This runs automatically when the app starts
        try {
            ReminderScheduler.INSTANCE.schedule(this, 9, 0, "REMINDER_1");
            ReminderScheduler.INSTANCE.schedule(this, 14, 0, "REMINDER_2");
            ReminderScheduler.INSTANCE.schedule(this, 20, 0, "REMINDER_3");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 3. TURN OFF REMINDERS
     * This method is now available in your Activity.
     * You can call this method later if you implement a button
     * or a setting to disable notifications.
     */
    public void stopReminders() {
        try {
            ReminderScheduler.INSTANCE.cancel(this);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}