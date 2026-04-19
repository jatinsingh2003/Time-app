// package com.anonymous.TimeApp;

// import android.app.WallpaperManager;
// import android.content.ComponentName;
// import android.content.Context;
// import android.content.Intent;
// import android.content.SharedPreferences;

// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;

// public class LiveWallpaperModule extends ReactContextBaseJavaModule {

//     private static final String MODULE_NAME = "LiveWallpaperModule";
//     private static final String PREFS_NAME   = "LiveWallpaperPrefs";

//     private final ReactApplicationContext reactContext;

//     public LiveWallpaperModule(ReactApplicationContext reactContext) {
//         super(reactContext);
//         this.reactContext = reactContext;
//     }

//     @Override
//     public String getName() {
//         return MODULE_NAME;
//     }

//     /**
//      * Called from JS to persist the wallpaper configuration before the picker is opened.
//      *
//      * @param mode      "life" | "year" | "goal"
//      * @param birthDate ISO date string  e.g. "1995-01-01"
//      * @param goalDate  ISO date string  e.g. "2025-12-31"  (empty string if none)
//      * @param goalTitle Human-readable goal label            (empty string if none)
//      */
//     @ReactMethod
//     public void setConfig(String mode, String birthDate, String goalDate, String goalTitle) {
//         SharedPreferences prefs = reactContext
//                 .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

//         prefs.edit()
//              .putString("mode",       mode)
//              .putString("birthDate",  birthDate)
//              .putString("goalDate",   goalDate)
//              .putString("goalTitle",  goalTitle)
//              .apply();
//     }

//     /**
//      * Opens the system live-wallpaper picker so the user can activate DotsLiveWallpaper.
//      */
//     @ReactMethod
//     public void openLiveWallpaperPicker() {
//         Context context = reactContext.getApplicationContext();

//         // Direct intent — jumps straight to our wallpaper in the picker
//         Intent intent = new Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER);
//         intent.putExtra(
//                 WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT,
//                 new ComponentName(context, DotsLiveWallpaper.class)
//         );
//         intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

//         try {
//             context.startActivity(intent);
//         } catch (Exception e) {
//             // Fallback: generic live-wallpaper chooser
//             Intent fallback = new Intent(WallpaperManager.ACTION_LIVE_WALLPAPER_CHOOSER);
//             fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//             context.startActivity(fallback);
//         }
//     }
// }
package com.anonymous.TimeApp;

import android.app.WallpaperManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LiveWallpaperModule extends ReactContextBaseJavaModule {

    private static final String MODULE_NAME = "LiveWallpaperModule";
    private static final String PREFS_NAME  = "LiveWallpaperPrefs";

    private final ReactApplicationContext reactContext;

    public LiveWallpaperModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * Called from JS to persist the wallpaper configuration before the picker is opened.
     *
     * @param mode         "life" | "year" | "goal"
     * @param birthDate    ISO date string  e.g. "1995-01-01"
     * @param goalDate     ISO date string  e.g. "2025-12-31"  (empty string if none)
     * @param goalTitle    Human-readable goal label            (empty string if none)
     * @param goalStartDay Day-of-year when the goal was originally set (0 if none)
     */
    @ReactMethod
    public void setConfig(String mode, String birthDate, String goalDate, String goalTitle, int goalStartDay) {
        SharedPreferences prefs = reactContext
                .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        prefs.edit()
             .putString("mode",         mode)
             .putString("birthDate",    birthDate)
             .putString("goalDate",     goalDate)
             .putString("goalTitle",    goalTitle)
             .putInt("goalStartDay",    goalStartDay)
             .apply();
    }

    /**
     * Opens the system live-wallpaper picker so the user can activate DotsLiveWallpaper.
     */
    @ReactMethod
    public void openLiveWallpaperPicker() {
        Context context = reactContext.getApplicationContext();

        Intent intent = new Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER);
        intent.putExtra(
                WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT,
                new ComponentName(context, DotsLiveWallpaper.class)
        );
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        try {
            context.startActivity(intent);
        } catch (Exception e) {
            Intent fallback = new Intent(WallpaperManager.ACTION_LIVE_WALLPAPER_CHOOSER);
            fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(fallback);
        }
    }
}