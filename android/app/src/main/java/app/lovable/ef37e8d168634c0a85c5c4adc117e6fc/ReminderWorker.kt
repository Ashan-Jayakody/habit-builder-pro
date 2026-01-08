package app.lovable.ef37e8d168634c0a85c5c4adc117e6fc

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.Worker
import androidx.work.WorkerParameters
import kotlin.random.Random

class ReminderWorker(
    context: Context,
    params: WorkerParameters
) : Worker(context, params) {

    override fun doWork(): Result {
        val context = applicationContext

        // 1. SETUP CLICK ACTION
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent: PendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        // 2. DEFINE SOUND AND VIBRATION (Renamed variable to avoid error)
        val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        val myVibration = longArrayOf(0, 500, 200, 500) // Renamed this!

        // 3. SETUP CHANNEL
        // Used "v3" to make sure your phone recreates the channel with new settings
        val channelId = "reminder_channel_v3"
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Reminders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                enableVibration(true)
                setVibrationPattern(myVibration) // <--- FIXED: Used setter method
                setSound(soundUri, null)
            }
            manager.createNotificationChannel(channel)
        }

        // 4. BUILD NOTIFICATION
        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("Habit Flow")
            .setContentText("Time to check in on your habits!")
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setSound(soundUri)
            .setVibrate(myVibration) // Use the renamed variable here too
            .setAutoCancel(true)
            .build()

        manager.notify(Random.nextInt(), notification)

        return Result.success()
    }
}