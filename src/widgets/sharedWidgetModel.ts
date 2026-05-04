import type { AppConfig } from '../storage/storage';

export type SupportedWidgetMode = 'year' | 'goal';
export type WidgetDotTone = 'past' | 'today' | 'future' | 'goal';

export interface WidgetDot {
    id: number;
    tone: WidgetDotTone;
}

export interface WidgetModel {
    mode: SupportedWidgetMode;
    title: string;
    headlineValue: number;
    headlineLabel: string;
    footer: string;
    percentage: number;
    totalDots: number;
    columns: number;
    dots: WidgetDot[];
}

export interface WidgetPayload {
    version: 1;
    generatedAt: string;
    selectedMode: SupportedWidgetMode;
    goalTitle?: string;
    goalDate?: string;
    goalStartDay?: number;
    model: WidgetModel;
}

export const WIDGET_COLUMNS = 15;

export function getCurrentDayOfYear(now: Date = new Date()) {
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / 86400000);
}

export function getGoalDayOfYear(dateStr?: string) {
    if (!dateStr) return -1;

    const goalDate = new Date(dateStr);
    if (Number.isNaN(goalDate.getTime())) {
        return -1;
    }

    const start = new Date(goalDate.getFullYear(), 0, 0);
    const diff = goalDate.getTime() - start.getTime();
    return Math.floor(diff / 86400000);
}

function getDaysInYear(now: Date = new Date()) {
    const year = now.getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    return isLeap ? 366 : 365;
}

function clampPercentage(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
}

function buildYearDots(dayOfYear: number, totalDays: number): WidgetDot[] {
    return Array.from({ length: totalDays }, (_, index) => ({
        id: index,
        tone: index < dayOfYear - 1
            ? 'past'
            : index === dayOfYear - 1
                ? 'today'
                : 'future',
    }));
}

function buildGoalDots(startDay: number, goalDay: number, dayOfYear: number): WidgetDot[] {
    return Array.from({ length: goalDay - startDay + 1 }, (_, index) => {
        const currentDay = startDay + index;

        let tone: WidgetDotTone = 'future';
        if (currentDay === goalDay) {
            tone = 'goal';
        } else if (currentDay === dayOfYear) {
            tone = 'today';
        } else if (currentDay < dayOfYear) {
            tone = 'past';
        }

        return {
            id: index,
            tone,
        };
    });
}

function buildYearWidgetModel(now: Date = new Date()): WidgetModel {
    const dayOfYear = getCurrentDayOfYear(now);
    const totalDays = getDaysInYear(now);
    const daysRemaining = totalDays - dayOfYear;
    const percentage = clampPercentage((dayOfYear / totalDays) * 100);

    return {
        mode: 'year',
        title: 'Year Progress',
        headlineValue: daysRemaining,
        headlineLabel: 'DAYS LEFT',
        footer: `${daysRemaining}D left | ${percentage}%`,
        percentage,
        totalDots: totalDays,
        columns: WIDGET_COLUMNS,
        dots: buildYearDots(dayOfYear, totalDays),
    };
}

function buildGoalWidgetModel(config: AppConfig, now: Date = new Date()): WidgetModel | null {
    const dayOfYear = getCurrentDayOfYear(now);
    const goalDay = getGoalDayOfYear(config.goalDate);

    if (goalDay <= 0 || goalDay <= dayOfYear) {
        return null;
    }

    const startDay = config.goalStartDay && config.goalStartDay > 0 && config.goalStartDay <= dayOfYear
        ? config.goalStartDay
        : dayOfYear;

    const totalDots = goalDay - startDay + 1;
    const daysRemaining = goalDay - dayOfYear;
    const denominator = Math.max(1, goalDay - startDay);
    const percentage = clampPercentage(((dayOfYear - startDay) / denominator) * 100);

    return {
        mode: 'goal',
        title: config.goalTitle?.trim() || 'Target Goal',
        headlineValue: daysRemaining,
        headlineLabel: 'DAYS TO GO',
        footer: `${daysRemaining}D left | ${percentage}%`,
        percentage,
        totalDots,
        columns: WIDGET_COLUMNS,
        dots: buildGoalDots(startDay, goalDay, dayOfYear),
    };
}

export function buildWidgetPayload(config: AppConfig, now: Date = new Date()): WidgetPayload {
    const goalModel = config.selectedMode === 'goal' ? buildGoalWidgetModel(config, now) : null;
    const model = goalModel ?? buildYearWidgetModel(now);

    return {
        version: 1,
        generatedAt: now.toISOString(),
        selectedMode: model.mode,
        goalTitle: config.goalTitle,
        goalDate: config.goalDate,
        goalStartDay: config.goalStartDay,
        model,
    };
}
