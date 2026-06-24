import {getStreaks} from './calculateStreaks';
import {parseLocalDate, toLocalISODate} from './dateUtils';

describe('getStreaks', () => {
  it('returns one streak with two entries', () => {
    const dates = ['2021-04-03', '2021-04-02'];
    const outputStreaks = getStreaks(dates);
    expect(outputStreaks).toEqual([{dates: dates.map(parseLocalDate)}]);
  });

  it('returns single streak', () => {
    const dates = ['2021-04-03'];
    const outputStreaks = getStreaks(dates);
    expect(outputStreaks).toEqual([{dates: dates.map(parseLocalDate)}]);
  });

  it('returns single streak that is current', () => {
    const today = toLocalISODate(new Date());
    const outputStreaks = getStreaks([today]);
    expect(outputStreaks).toEqual([
      {dates: [parseLocalDate(today)], isCurrentStreak: true},
    ]);
  });

  it('returns three streaks with entries', () => {
    const dates = [
      '2021-04-22',
      '2021-04-21',
      '2021-04-20',
      '2021-04-03',
      '2021-04-02',
      '2021-03-01',
    ];
    const outputStreaks = getStreaks(dates);
    expect(outputStreaks).toEqual([
      {dates: ['2021-04-22', '2021-04-21', '2021-04-20'].map(parseLocalDate)},
      {dates: ['2021-04-03', '2021-04-02'].map(parseLocalDate)},
      {dates: ['2021-03-01'].map(parseLocalDate)},
    ]);
  });
});
