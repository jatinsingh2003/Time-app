
// package com.anonymous.TimeApp;

// import android.content.SharedPreferences;
// import android.graphics.Canvas;
// import android.graphics.Color;
// import android.graphics.Paint;
// import android.graphics.Typeface;
// import android.os.Handler;
// import android.os.Looper;
// import android.service.wallpaper.WallpaperService;
// import android.view.SurfaceHolder;

// import java.util.Calendar;

// public class DotsLiveWallpaper extends WallpaperService {

//     @Override
//     public Engine onCreateEngine() {
//         return new DotsEngine();
//     }

//     private class DotsEngine extends Engine {

//         private static final String PREFS_NAME = "LiveWallpaperPrefs";
//         private static final long   REFRESH_MS = 60_000L;

//         private final Handler  handler      = new Handler(Looper.getMainLooper());
//         private final Runnable drawRunnable = this::drawFrame;

//         private final Paint dotPaint  = new Paint(Paint.ANTI_ALIAS_FLAG);
//         private final Paint textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);

//         private boolean visible = false;

//         @Override public void onSurfaceCreated(SurfaceHolder holder) { super.onSurfaceCreated(holder); }

//         @Override
//         public void onVisibilityChanged(boolean isVisible) {
//             this.visible = isVisible;
//             if (isVisible) { drawFrame(); scheduleNext(); }
//             else { handler.removeCallbacks(drawRunnable); }
//         }

//         @Override
//         public void onSurfaceDestroyed(SurfaceHolder holder) {
//             super.onSurfaceDestroyed(holder);
//             visible = false;
//             handler.removeCallbacks(drawRunnable);
//         }

//         @Override
//         public void onSurfaceChanged(SurfaceHolder holder, int format, int width, int height) {
//             super.onSurfaceChanged(holder, format, width, height);
//             drawFrame();
//         }

//         private void scheduleNext() {
//             handler.removeCallbacks(drawRunnable);
//             if (visible) handler.postDelayed(drawRunnable, REFRESH_MS);
//         }

//         private void drawFrame() {
//             SurfaceHolder holder = getSurfaceHolder();
//             Canvas canvas = null;
//             try {
//                 canvas = holder.lockCanvas();
//                 if (canvas != null) {
//                     SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
//                     String mode      = prefs.getString("mode",      "year");
//                     String birthDate = prefs.getString("birthDate", "1995-01-01");
//                     String goalDate  = prefs.getString("goalDate",  "");
//                     String goalTitle = prefs.getString("goalTitle", "");

//                     switch (mode) {
//                         case "life": drawLifeGrid(canvas, birthDate); break;
//                         case "goal": drawGoalGrid(canvas, goalDate, goalTitle); break;
//                         default:     drawYearGrid(canvas); break;
//                     }
//                 }
//             } finally {
//                 if (canvas != null) holder.unlockCanvasAndPost(canvas);
//             }
//             scheduleNext();
//         }

//         /**
//          * Returns the X offset to add to the last (partial) row so it appears centered.
//          * For full rows (dotsInRow == cols) this returns 0.
//          *
//          * @param total    total number of dots
//          * @param cols     number of columns
//          * @param cellSize size of each cell
//          * @param row      which row we are drawing (0-based)
//          */
//         private float lastRowOffset(int total, int cols, float cellSize, int row, int totalRows) {
//             if (row < totalRows - 1) return 0f;          // not the last row
//             int dotsInLastRow = total % cols;
//             if (dotsInLastRow == 0) return 0f;           // last row is full
//             int emptySlots = cols - dotsInLastRow;
//             return (emptySlots * cellSize) / 2f;         // shift right by half the gap
//         }

//         // ── Year Grid ─────────────────────────────────────────────────────────
//         private void drawYearGrid(Canvas canvas) {
//             canvas.drawColor(Color.BLACK);

//             int w         = canvas.getWidth();
//             int h         = canvas.getHeight();
//             int totalDays = getDaysInYear();
//             int dayOfYear = getDayOfYear();

//             int cols = 15;
//             int rows = (int) Math.ceil((double) totalDays / cols);

//             float hMargin   = dpToPx(24);
//             float gridWidth = w - hMargin * 2;
//             float cellSize  = gridWidth / cols;
//             float dotRadius = cellSize * 0.30f;

//             float footerHeight = dpToPx(40);
//             float gridHeight   = rows * cellSize;
//             float marginTop    = (h - footerHeight - gridHeight) / 2f;
//             if (marginTop < 0) marginTop = 0;

//             for (int i = 0; i < totalDays; i++) {
//                 int   col    = i % cols;
//                 int   row    = i / cols;
//                 float offset = lastRowOffset(totalDays, cols, cellSize, row, rows);
//                 float cx     = hMargin + offset + col * cellSize + cellSize / 2f;
//                 float cy     = marginTop + row * cellSize + cellSize / 2f;

//                 if (i == dayOfYear - 1)      dotPaint.setColor(0xFFFF9500);
//                 else if (i < dayOfYear - 1)  dotPaint.setColor(Color.WHITE);
//                 else                          dotPaint.setColor(0xFF333333);

//                 canvas.drawCircle(cx, cy, dotRadius, dotPaint);
//             }

//             int    pct     = (int) Math.round((dayOfYear * 100.0) / totalDays);
//             int    left    = totalDays - dayOfYear;
//             String footer  = left + "D left · " + pct + "%";
//             float  footerY = marginTop + gridHeight + dpToPx(24);
//             drawFooter(canvas, footer, w, footerY);
//         }

//         // ── Life Grid ─────────────────────────────────────────────────────────
//         private void drawLifeGrid(Canvas canvas, String birthDateStr) {
//             canvas.drawColor(Color.BLACK);

//             int w          = canvas.getWidth();
//             int h          = canvas.getHeight();
//             int totalWeeks = 80 * 52;   // 4160 — evenly divisible by 52, last row always full
//             int weeksLived = getWeeksLived(birthDateStr);

//             int cols = 52;
//             int rows = (int) Math.ceil((double) totalWeeks / cols);

//             float hMargin   = dpToPx(24);
//             float gridWidth = w - hMargin * 2;
//             float cellSize  = gridWidth / cols;
//             float dotRadius = cellSize * 0.35f;

//             float footerHeight = dpToPx(40);
//             float gridHeight   = rows * cellSize;
//             float marginTop    = (h - footerHeight - gridHeight) / 2f;
//             if (marginTop < 0) marginTop = 0;

//             for (int i = 0; i < totalWeeks; i++) {
//                 int   col    = i % cols;
//                 int   row    = i / cols;
//                 // 4160 % 52 == 0 so offset is always 0, kept for consistency
//                 float offset = lastRowOffset(totalWeeks, cols, cellSize, row, rows);
//                 float cx     = hMargin + offset + col * cellSize + cellSize / 2f;
//                 float cy     = marginTop + row * cellSize + cellSize / 2f;

//                 if (i == weeksLived)      dotPaint.setColor(0xFFFF9500);
//                 else if (i < weeksLived)  dotPaint.setColor(Color.WHITE);
//                 else                       dotPaint.setColor(0xFF333333);

//                 canvas.drawCircle(cx, cy, dotRadius, dotPaint);
//             }

//             int    remaining = totalWeeks - weeksLived;
//             int    pct       = (int) Math.round((weeksLived * 100.0) / totalWeeks);
//             String footer    = remaining + "w left · " + pct + "%";
//             float  footerY   = marginTop + gridHeight + dpToPx(24);
//             drawFooter(canvas, footer, w, footerY);
//         }

//         // ── Goal Grid ─────────────────────────────────────────────────────────
//         private void drawGoalGrid(Canvas canvas, String goalDateStr, String goalTitle) {
//             canvas.drawColor(Color.BLACK);

//             int w         = canvas.getWidth();
//             int h         = canvas.getHeight();
//             int dayOfYear = getDayOfYear();
//             int goalDay   = getGoalDayOfYear(goalDateStr);

//             if (goalDay <= 0 || goalDay <= dayOfYear) {
//                 drawYearGrid(canvas);
//                 return;
//             }

//             int totalDots = goalDay - dayOfYear + 1;
//             int cols      = 15;
//             int rows      = (int) Math.ceil((double) totalDots / cols);

//             float hMargin   = dpToPx(24);
//             float gridWidth = w - hMargin * 2;
//             float cellSize  = gridWidth / cols;
//             float dotRadius = cellSize * 0.30f;

//             float titleSpace   = (goalTitle != null && !goalTitle.isEmpty()) ? dpToPx(50) : 0;
//             float footerHeight = dpToPx(40);
//             float gridHeight   = rows * cellSize;
//             float marginTop    = (h - titleSpace - footerHeight - gridHeight) / 2f + titleSpace;
//             if (marginTop < titleSpace) marginTop = titleSpace;

//             if (goalTitle != null && !goalTitle.isEmpty()) {
//                 textPaint.setColor(Color.WHITE);
//                 textPaint.setTextSize(dpToPx(18));
//                 textPaint.setTextAlign(Paint.Align.CENTER);
//                 textPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
//                 canvas.drawText(goalTitle, w / 2f, marginTop - dpToPx(16), textPaint);
//             }

//             for (int i = 0; i < totalDots; i++) {
//                 int   dayNum = dayOfYear + i;
//                 int   col    = i % cols;
//                 int   row    = i / cols;
//                 float offset = lastRowOffset(totalDots, cols, cellSize, row, rows);
//                 float cx     = hMargin + offset + col * cellSize + cellSize / 2f;
//                 float cy     = marginTop + row * cellSize + cellSize / 2f;

//                 if (dayNum == goalDay)        dotPaint.setColor(0xFFFF3B30);
//                 else if (dayNum == dayOfYear) dotPaint.setColor(0xFFFF9500);
//                 else                           dotPaint.setColor(0xFF333333);

//                 canvas.drawCircle(cx, cy, dotRadius, dotPaint);
//             }

//             int    daysLeft = goalDay - dayOfYear;
//             int    pct      = (int) Math.round(((dayOfYear - 1) * 100.0) / goalDay);
//             String footer   = daysLeft + "D left · " + pct + "%";
//             float  footerY  = marginTop + gridHeight + dpToPx(24);
//             drawFooter(canvas, footer, w, footerY);
//         }

//         // ── Helpers ───────────────────────────────────────────────────────────

//         private void drawFooter(Canvas canvas, String text, int w, float y) {
//             textPaint.setColor(0xFFFF9500);
//             textPaint.setTextSize(dpToPx(15));
//             textPaint.setTextAlign(Paint.Align.CENTER);
//             textPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
//             canvas.drawText(text, w / 2f, y, textPaint);
//         }

//         private float dpToPx(float dp) {
//             return dp * getResources().getDisplayMetrics().density;
//         }

//         private int getDayOfYear() {
//             return Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
//         }

//         private int getDaysInYear() {
//             return Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_YEAR);
//         }

//         private int getWeeksLived(String birthDateStr) {
//             try {
//                 String[] parts = birthDateStr.split("-");
//                 Calendar birth = Calendar.getInstance();
//                 birth.set(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]) - 1, Integer.parseInt(parts[2]), 0, 0, 0);
//                 birth.set(Calendar.MILLISECOND, 0);
//                 long diffMs = Calendar.getInstance().getTimeInMillis() - birth.getTimeInMillis();
//                 return (int) Math.max(0, diffMs / (1000L * 60 * 60 * 24 * 7));
//             } catch (Exception e) { return 0; }
//         }

//         private int getGoalDayOfYear(String goalDateStr) {
//             if (goalDateStr == null || goalDateStr.isEmpty()) return -1;
//             try {
//                 String[] parts = goalDateStr.split("-");
//                 Calendar goal = Calendar.getInstance();
//                 goal.set(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]) - 1, Integer.parseInt(parts[2]));
//                 Calendar start = Calendar.getInstance();
//                 start.set(goal.get(Calendar.YEAR), Calendar.JANUARY, 0, 0, 0, 0);
//                 start.set(Calendar.MILLISECOND, 0);
//                 return (int) ((goal.getTimeInMillis() - start.getTimeInMillis()) / (1000L * 60 * 60 * 24));
//             } catch (Exception e) { return -1; }
//         }
//     }
// }
package com.spritzstudio.dotchrono;

import android.content.SharedPreferences;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.os.Handler;
import android.os.Looper;
import android.service.wallpaper.WallpaperService;
import android.view.SurfaceHolder;

import java.util.Calendar;

public class DotsLiveWallpaper extends WallpaperService {

    @Override
    public Engine onCreateEngine() {
        return new DotsEngine();
    }

    private class DotsEngine extends Engine {

        private static final String PREFS_NAME = "LiveWallpaperPrefs";
        private static final long   REFRESH_MS = 60_000L;

        private final Handler  handler      = new Handler(Looper.getMainLooper());
        private final Runnable drawRunnable = this::drawFrame;

        private final Paint dotPaint  = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);

        private boolean visible = false;

        @Override public void onSurfaceCreated(SurfaceHolder holder) { super.onSurfaceCreated(holder); }

        @Override
        public void onVisibilityChanged(boolean isVisible) {
            this.visible = isVisible;
            if (isVisible) { drawFrame(); scheduleNext(); }
            else { handler.removeCallbacks(drawRunnable); }
        }

        @Override
        public void onSurfaceDestroyed(SurfaceHolder holder) {
            super.onSurfaceDestroyed(holder);
            visible = false;
            handler.removeCallbacks(drawRunnable);
        }

        @Override
        public void onSurfaceChanged(SurfaceHolder holder, int format, int width, int height) {
            super.onSurfaceChanged(holder, format, width, height);
            drawFrame();
        }

        private void scheduleNext() {
            handler.removeCallbacks(drawRunnable);
            if (visible) handler.postDelayed(drawRunnable, REFRESH_MS);
        }

        private void drawFrame() {
            SurfaceHolder holder = getSurfaceHolder();
            Canvas canvas = null;
            try {
                canvas = holder.lockCanvas();
                if (canvas != null) {
                    SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
                    String mode         = prefs.getString("mode",      "year");
                    String birthDate    = prefs.getString("birthDate", "1995-01-01");
                    String goalDate     = prefs.getString("goalDate",  "");
                    String goalTitle    = prefs.getString("goalTitle", "");
                    int    goalStartDay = prefs.getInt("goalStartDay", 0); // 0 = not set

                    switch (mode) {
                        case "life": drawLifeGrid(canvas, birthDate); break;
                        case "goal": drawGoalGrid(canvas, goalDate, goalTitle, goalStartDay); break;
                        default:     drawYearGrid(canvas); break;
                    }
                }
            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas);
            }
            scheduleNext();
        }

        // ── Year Grid ─────────────────────────────────────────────────────────
        private void drawYearGrid(Canvas canvas) {
            canvas.drawColor(Color.BLACK);

            int w         = canvas.getWidth();
            int h         = canvas.getHeight();
            int totalDays = getDaysInYear();
            int dayOfYear = getDayOfYear();
            int cols      = 15;
            int rows      = (int) Math.ceil((double) totalDays / cols);

            float hMargin   = dpToPx(24);
            float gridWidth = w - hMargin * 2;
            float cellSize  = gridWidth / cols;
            float dotRadius = cellSize * 0.30f;

            float footerHeight = dpToPx(40);
            float gridHeight   = rows * cellSize;
            float marginTop    = (h - footerHeight - gridHeight) / 2f;
            if (marginTop < 0) marginTop = 0;

            for (int i = 0; i < totalDays; i++) {
                int   col    = i % cols;
                int   row    = i / cols;
                float offset = lastRowOffset(totalDays, cols, cellSize, row, rows);
                float cx     = hMargin + offset + col * cellSize + cellSize / 2f;
                float cy     = marginTop + row * cellSize + cellSize / 2f;

                if (i == dayOfYear - 1)      dotPaint.setColor(0xFFFF9500);
                else if (i < dayOfYear - 1)  dotPaint.setColor(Color.WHITE);
                else                          dotPaint.setColor(0xFF333333);

                canvas.drawCircle(cx, cy, dotRadius, dotPaint);
            }

            int    pct     = (int) Math.round((dayOfYear * 100.0) / totalDays);
            int    left    = totalDays - dayOfYear;
            String footer  = left + "D left · " + pct + "%";
            drawFooter(canvas, footer, w, marginTop + gridHeight + dpToPx(24));
        }

        // ── Life Grid ─────────────────────────────────────────────────────────
        private void drawLifeGrid(Canvas canvas, String birthDateStr) {
            canvas.drawColor(Color.BLACK);

            int w          = canvas.getWidth();
            int h          = canvas.getHeight();
            int totalWeeks = 80 * 52;
            int weeksLived = getWeeksLived(birthDateStr);
            int cols       = 52;
            int rows       = (int) Math.ceil((double) totalWeeks / cols);

            float hMargin   = dpToPx(24);
            float gridWidth = w - hMargin * 2;
            float cellSize  = gridWidth / cols;
            float dotRadius = cellSize * 0.35f;

            float footerHeight = dpToPx(40);
            float gridHeight   = rows * cellSize;
            float marginTop    = (h - footerHeight - gridHeight) / 2f;
            if (marginTop < 0) marginTop = 0;

            for (int i = 0; i < totalWeeks; i++) {
                int   col    = i % cols;
                int   row    = i / cols;
                float offset = lastRowOffset(totalWeeks, cols, cellSize, row, rows);
                float cx     = hMargin + offset + col * cellSize + cellSize / 2f;
                float cy     = marginTop + row * cellSize + cellSize / 2f;

                if (i == weeksLived)      dotPaint.setColor(0xFFFF9500);
                else if (i < weeksLived)  dotPaint.setColor(Color.WHITE);
                else                       dotPaint.setColor(0xFF333333);

                canvas.drawCircle(cx, cy, dotRadius, dotPaint);
            }

            int    remaining = totalWeeks - weeksLived;
            int    pct       = (int) Math.round((weeksLived * 100.0) / totalWeeks);
            drawFooter(canvas, remaining + "w left · " + pct + "%", w, marginTop + gridHeight + dpToPx(24));
        }

        // ── Goal Grid ─────────────────────────────────────────────────────────
        // Dots run from goalStartDay → goalDay
        // past (< today) = white, today = orange, future = grey, goal = red
        private void drawGoalGrid(Canvas canvas, String goalDateStr, String goalTitle, int goalStartDay) {
            canvas.drawColor(Color.BLACK);

            int w         = canvas.getWidth();
            int h         = canvas.getHeight();
            int dayOfYear = getDayOfYear();
            int goalDay   = getGoalDayOfYear(goalDateStr);

            if (goalDay <= 0 || goalDay <= dayOfYear) {
                drawYearGrid(canvas);
                return;
            }

            // Fall back to today if goalStartDay wasn't saved yet
            int startDay  = (goalStartDay > 0 && goalStartDay <= dayOfYear) ? goalStartDay : dayOfYear;

            int totalDots = goalDay - startDay + 1;
            int cols      = 15;
            int rows      = (int) Math.ceil((double) totalDots / cols);

            float hMargin   = dpToPx(24);
            float gridWidth = w - hMargin * 2;
            float cellSize  = gridWidth / cols;
            float dotRadius = cellSize * 0.30f;

            float titleSpace   = (goalTitle != null && !goalTitle.isEmpty()) ? dpToPx(50) : 0;
            float footerHeight = dpToPx(40);
            float gridHeight   = rows * cellSize;
            float marginTop    = (h - titleSpace - footerHeight - gridHeight) / 2f + titleSpace;
            if (marginTop < titleSpace) marginTop = titleSpace;

            // Title
            if (goalTitle != null && !goalTitle.isEmpty()) {
                textPaint.setColor(Color.WHITE);
                textPaint.setTextSize(dpToPx(18));
                textPaint.setTextAlign(Paint.Align.CENTER);
                textPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
                canvas.drawText(goalTitle, w / 2f, marginTop - dpToPx(16), textPaint);
            }

            for (int i = 0; i < totalDots; i++) {
                int   dayNum = startDay + i;
                int   col    = i % cols;
                int   row    = i / cols;
                float offset = lastRowOffset(totalDots, cols, cellSize, row, rows);
                float cx     = hMargin + offset + col * cellSize + cellSize / 2f;
                float cy     = marginTop + row * cellSize + cellSize / 2f;

                if (dayNum == goalDay)        dotPaint.setColor(0xFFFF3B30);  // red   — goal
                else if (dayNum == dayOfYear) dotPaint.setColor(0xFFFF9500);  // orange — today
                else if (dayNum < dayOfYear)  dotPaint.setColor(Color.WHITE); // white  — past
                else                           dotPaint.setColor(0xFF333333); // grey   — future

                canvas.drawCircle(cx, cy, dotRadius, dotPaint);
            }

            int    daysLeft = goalDay - dayOfYear;
            int    pct      = (int) Math.round(((dayOfYear - startDay) * 100.0) / (goalDay - startDay));
            drawFooter(canvas, daysLeft + "D left · " + pct + "%", w, marginTop + gridHeight + dpToPx(24));
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        /** Offset to center the last partial row. Returns 0 for full rows. */
        private float lastRowOffset(int total, int cols, float cellSize, int row, int totalRows) {
            if (row < totalRows - 1) return 0f;
            int dotsInLastRow = total % cols;
            if (dotsInLastRow == 0) return 0f;
            return ((cols - dotsInLastRow) * cellSize) / 2f;
        }

        private void drawFooter(Canvas canvas, String text, int w, float y) {
            textPaint.setColor(0xFFFF9500);
            textPaint.setTextSize(dpToPx(15));
            textPaint.setTextAlign(Paint.Align.CENTER);
            textPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
            canvas.drawText(text, w / 2f, y, textPaint);
        }

        private float dpToPx(float dp) {
            return dp * getResources().getDisplayMetrics().density;
        }

        private int getDayOfYear() {
            return Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
        }

        private int getDaysInYear() {
            return Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_YEAR);
        }

        private int getWeeksLived(String birthDateStr) {
            try {
                String[] parts = birthDateStr.split("-");
                Calendar birth = Calendar.getInstance();
                birth.set(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]) - 1, Integer.parseInt(parts[2]), 0, 0, 0);
                birth.set(Calendar.MILLISECOND, 0);
                long diffMs = Calendar.getInstance().getTimeInMillis() - birth.getTimeInMillis();
                return (int) Math.max(0, diffMs / (1000L * 60 * 60 * 24 * 7));
            } catch (Exception e) { return 0; }
        }

        private int getGoalDayOfYear(String goalDateStr) {
            if (goalDateStr == null || goalDateStr.isEmpty()) return -1;
            try {
                String[] parts = goalDateStr.split("-");
                Calendar goal = Calendar.getInstance();
                goal.set(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]) - 1, Integer.parseInt(parts[2]));
                Calendar start = Calendar.getInstance();
                start.set(goal.get(Calendar.YEAR), Calendar.JANUARY, 0, 0, 0, 0);
                start.set(Calendar.MILLISECOND, 0);
                return (int) ((goal.getTimeInMillis() - start.getTimeInMillis()) / (1000L * 60 * 60 * 24));
            } catch (Exception e) { return -1; }
        }
    }
}
