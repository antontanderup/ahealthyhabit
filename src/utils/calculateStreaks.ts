import { differenceInCalendarDays, isToday, isYesterday } from "date-fns";

export const getStreaks = (streaksArray: string[]): { dates: number[], isCurrentStreak?: boolean }[] => {
    let streaks: { dates: number[], isCurrentStreak?: boolean }[] = [];

    const streaksAsDates = streaksArray.map(stringDate => Date.parse(stringDate));
    if (streaksAsDates.length === 1) {
        streaks.push({dates: streaksAsDates});
        return streaks;
    }

    streaksAsDates.forEach((date, index) => {
        const previousDate = streaksAsDates[index - 1];
        const currentStreak = streaks[streaks.length -1];
        const isCurrentStreak = isToday(date) || isYesterday(date);

        if (!previousDate) {
            streaks.push({ dates: [date], });
        } else {
            const daysSinceLastDate = differenceInCalendarDays(previousDate, date);
            if (daysSinceLastDate === 1 || daysSinceLastDate === -1) {
                currentStreak.dates.push(date);
            } else {
                streaks.push({ dates: [date] });
            }
        }

        if (isCurrentStreak) {
            streaks[streaks.length -1].isCurrentStreak = true;
        }
    });

    return streaks;
}