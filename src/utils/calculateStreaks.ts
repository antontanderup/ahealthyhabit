import {differenceInCalendarDays, isToday, isYesterday} from 'date-fns';
import {parseLocalDate} from './dateUtils';

export const getStreaks = (
  recordedDatesSortedDesc: string[],
): {dates: number[]; isCurrentStreak?: boolean}[] => {
  const streaks: {dates: number[]; isCurrentStreak?: boolean}[] = [];
  const streaksAsDates = recordedDatesSortedDesc.map(parseLocalDate);

  streaksAsDates.forEach((date, index) => {
    const previousDate = streaksAsDates[index - 1];
    const currentStreak = streaks[streaks.length - 1];

    if (!previousDate) {
      streaks.push({dates: [date]});
    } else {
      const daysSinceLastDate = differenceInCalendarDays(previousDate, date);
      if (daysSinceLastDate === 1) {
        currentStreak.dates.push(date);
      } else {
        streaks.push({dates: [date]});
      }
    }
  });

  if (streaks[0]) {
    const latestDate = streaks[0].dates[0];
    if (isToday(latestDate) || isYesterday(latestDate)) {
      streaks[0].isCurrentStreak = true;
    }
  }

  return streaks;
};
