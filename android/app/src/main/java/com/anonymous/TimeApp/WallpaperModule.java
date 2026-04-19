package com.anonymous.TimeApp;

import android.app.WallpaperManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.io.IOException;

public class WallpaperModule extends ReactContextBaseJavaModule {

    private static final String MODULE_NAME = "WallpaperManager";

    public WallpaperModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void setWallpaper(ReadableMap options, Callback successCallback, Callback errorCallback) {
        try {
            String imagePath = options.getString("imagePath");

            if (imagePath == null || imagePath.isEmpty()) {
                errorCallback.invoke("Image path is null or empty");
                return;
            }

            Bitmap bitmap = BitmapFactory.decodeFile(imagePath);
            if (bitmap == null) {
                errorCallback.invoke("Could not decode image at path: " + imagePath);
                return;
            }

            WallpaperManager manager =
                WallpaperManager.getInstance(getReactApplicationContext());
            manager.setBitmap(bitmap);

            successCallback.invoke("Wallpaper set successfully");

        } catch (IOException e) {
            errorCallback.invoke("IO_ERROR: " + e.getMessage());
        } catch (Exception e) {
            errorCallback.invoke("UNKNOWN_ERROR: " + e.getMessage());
        }
    }
}
