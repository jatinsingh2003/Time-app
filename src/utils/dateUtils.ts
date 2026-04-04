export const getYearProgress = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const year = now.getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const totalDays = isLeap ? 366 : 365;

    return {
        dayOfYear,
        daysRemaining: totalDays - dayOfYear,
        totalDays,
        percentage: (dayOfYear / totalDays) * 100,
    };
};

export const getWeekProgress = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDays = (now.getTime() - startOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);

    return {
        currentWeek: weekNumber,
        totalWeeks: 52, // Standard approximation, some years have 53
        remainingWeeks: 52 - weekNumber,
    };
};

export const getGoalProgress = (targetDateStr: string) => {
    const now = new Date();
    const target = new Date(targetDateStr);
    const diffTime = target.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        isExpired: daysRemaining <= 0,
    };
};

export const getLifeProgress = (birthDateStr: string = '1995-01-01') => {
    const now = new Date();
    const birthDate = new Date(birthDateStr);

    // Total weeks in 80 years
    const totalWeeks = 80 * 52;

    // Weeks lived
    const diffTime = now.getTime() - birthDate.getTime();
    const weeksLived = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

    return {
        weeksLived: weeksLived > 0 ? weeksLived : 0,
        totalWeeks,
        remainingWeeks: totalWeeks - weeksLived > 0 ? totalWeeks - weeksLived : 0,
        percentage: (weeksLived / totalWeeks) * 100,
    };
};



export const formatDate = (date: Date) => {

    return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
