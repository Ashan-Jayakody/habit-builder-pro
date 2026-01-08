package app.lovable.ef37e8d168634c0a85c5c4adc117e6fc


import android.content.Context
import androidx.work.*
import java.util.*
import java.util.concurrent.TimeUnit

object ReminderScheduler {

    fun schedule(context: Context, hour: Int, minute: Int, tag: String) {
        val now = Calendar.getInstance()
        val target = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            if (before(now)) add(Calendar.DAY_OF_YEAR, 1)
        }

        val delay = target.timeInMillis - now.timeInMillis

        val work = OneTimeWorkRequestBuilder<ReminderWorker>()
            .setInitialDelay(delay, TimeUnit.MILLISECONDS)
            .addTag(tag)
            .build()

        WorkManager.getInstance(context).enqueueUniqueWork(
            tag,
            ExistingWorkPolicy.REPLACE,
            work
        )
    }

    fun cancel(context: Context) {
        WorkManager.getInstance(context).cancelAllWork()
    }
}
