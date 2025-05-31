package expo.modules.hello


import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.app.usage.UsageStats
import android.os.Binder
import android.os.Build

import android.os.Bundle
import android.text.format.DateFormat
import java.text.SimpleDateFormat
import java.util.*

import android.content.pm.PackageManager
import android.content.pm.ApplicationInfo

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoHelloModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoHello')` in JavaScript.
    Name("ExpoHello")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello Josias Quiñonez! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    AsyncFunction("getInstalledApps") {
      val reactContext = requireNotNull(appContext.reactContext) {
        "ReactContext is null. Make sure the module is initialized correctly."
      }

      val pm = reactContext.packageManager
      val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)

      val usageStatsManager = reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

      val endTime = System.currentTimeMillis()
      val startTime = endTime - (1000L * 60 * 60 * 24 * 7)
      val usageStatsList = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)

      val lastUsedMap = usageStatsList.associateBy({ it.packageName }, { it.lastTimeUsed })

      fun formatDateToDDMMYYYY(dateInMillis: Long): String {
        val date = Date(dateInMillis)
        val format = SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.getDefault())
        return format.format(date)
      }

      fun formatDateToDayOnly(dateInMillis: Long): String {
        val date = Date(dateInMillis)
        val format = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
        return format.format(date)
      }

      fun formatTimeInSeconds(seconds: Long): String {
        val hours = seconds / 3600
        val minutes = (seconds % 3600) / 60
        val remainingSeconds = seconds % 60
        return String.format("%02d:%02d:%02d", hours, minutes, remainingSeconds)
      }

      val result = apps.filter {
        (it.flags and ApplicationInfo.FLAG_SYSTEM) == 0 &&
        (it.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) == 0 &&
        !listOf(
          "com.google.android.safetycore",
          "com.google.android.contactkeys"
        ).contains(it.packageName)
      }.map { appInfo ->
        val packageName = appInfo.packageName
        val appName = pm.getApplicationLabel(appInfo).toString()
        val icon = pm.getApplicationIcon(appInfo)
        val versionName = try {
          pm.getPackageInfo(packageName, 0).versionName
        } catch (e: PackageManager.NameNotFoundException) {
          "Unknown version"
        }
        val firstInstallTime = try {
          pm.getPackageInfo(packageName, 0).firstInstallTime
        } catch (e: PackageManager.NameNotFoundException) {
          0L
        }
        val lastUpdateTime = try {
          pm.getPackageInfo(packageName, 0).lastUpdateTime
        } catch (e: PackageManager.NameNotFoundException) {
          0L
        }

        val lastUsedTime = lastUsedMap[packageName] ?: 0L

        val formattedFirstInstallTime = formatDateToDDMMYYYY(firstInstallTime)
        val formattedLastUpdateTime = formatDateToDDMMYYYY(lastUpdateTime)

        // Filtrar estadísticas solo para esta app y últimos 7 días
        val filteredUsageStats = usageStatsList
          .filter { it.packageName == packageName && it.lastTimeUsed >= startTime }

        // Agrupar por día (dd/MM/yyyy) y sumar tiempo de uso diario
        val usageByDate = filteredUsageStats.groupBy {
          formatDateToDayOnly(it.lastTimeUsed)
        }

        val formattedUsageList = usageByDate.map { (date, statsList) ->
          val totalSeconds = statsList.sumOf { it.totalTimeInForeground / 1000 }
          val formattedTime = formatTimeInSeconds(totalSeconds)
          "$date - $formattedTime"
        }.sortedBy { it }

        val totalUsageSeconds = filteredUsageStats.sumOf { it.totalTimeInForeground / 1000 }
        val formattedTotalUsage = formatTimeInSeconds(totalUsageSeconds)

        mapOf(
          "packageName" to packageName,
          "appName" to appName,
          "versionName" to versionName,
          "firstInstallTime" to formattedFirstInstallTime,
          "lastUpdateTime" to formattedLastUpdateTime,
          "lastUsedTime" to formatDateToDDMMYYYY(lastUsedTime),
          "formattedHoursUsedByDay" to formattedUsageList,
          "formattedTotalUsage" to formattedTotalUsage
        )
      }

      return@AsyncFunction result
    }

    Function("isUsageAccessGranted") {
      val context = appContext.reactContext ?: throw Exception("ReactContext is null")
      val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
      val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        appOps.unsafeCheckOpNoThrow(
          AppOpsManager.OPSTR_GET_USAGE_STATS,
          Binder.getCallingUid(),
          context.packageName
        )
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
        appOps.checkOpNoThrow(
          AppOpsManager.OPSTR_GET_USAGE_STATS,
          Binder.getCallingUid(),
          context.packageName
        )
      } else {
        return@Function false
      }
      mode == AppOpsManager.MODE_ALLOWED
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ExpoHelloView::class) {
      // Defines a setter for the `url` prop.
      Prop("url") { view: ExpoHelloView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      // Defines an event that the view can send to JavaScript.
      Events("onLoad")
    }
  }
}
