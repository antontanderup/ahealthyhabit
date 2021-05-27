import {getStreaks} from './calculateStreaks';

describe('getStreaks', () => {
  it('returns one streak with two entries', () => {
    const testObject = {
      name: 'Develop Habbit app',
      id: 'rEoEKuOAHKFsQMYM04S_G',
      recordedDates: ['Sat Apr 03 2021', 'Fri Apr 02 2021'],
    };
    const outputStreaks = getStreaks(testObject.recordedDates);
    const expectedOutput = [
      {
        dates: testObject.recordedDates.map(dateString =>
          Date.parse(dateString),
        ),
      },
    ];
    expect(outputStreaks).toEqual(expectedOutput);
  });

  it('returns single streak', () => {
    const testObject = {
      name: 'Develop Habbit app',
      id: 'rEoEKuOAHKFsQMYM04S_G',
      recordedDates: ['Sat Apr 03 2021'],
    };
    const outputStreaks = getStreaks(testObject.recordedDates);
    const expectedOutput = [
      {
        dates: testObject.recordedDates.map(dateString =>
          Date.parse(dateString),
        ),
      },
    ];
    expect(outputStreaks).toEqual(expectedOutput);
  });

  it('returns single streak that is current', () => {
    const testObject = {
      name: 'Develop Habbit app',
      id: 'rEoEKuOAHKFsQMYM04S_G',
      recordedDates: [new Date().toDateString()],
    };
    const outputStreaks = getStreaks(testObject.recordedDates);
    const expectedOutput = [
      {
        dates: testObject.recordedDates.map(dateString =>
          Date.parse(dateString),
        ),
        isCurrentStreak: true,
      },
    ];
    expect(outputStreaks).toEqual(expectedOutput);
  });

  it('returns three streaks streak with entries', () => {
    const testObject = {
      name: 'Develop Habbit app',
      id: 'rEoEKuOAHKFsQMYM04S_G',
      recordedDates: [
        'Sat Apr 22 2021',
        'Fri Apr 21 2021',
        'Sat Apr 20 2021',
        'Sat Apr 03 2021',
        'Fri Apr 02 2021',
        'Sat Mar 1 2021',
      ],
    };
    const outputStreaks = getStreaks(testObject.recordedDates);
    const expectedOutput = [
      {
        dates: [
          Date.parse('Sat Apr 22 2021'),
          Date.parse('Fri Apr 21 2021'),
          Date.parse('Sat Apr 20 2021'),
        ],
      },
      {
        dates: [Date.parse('Sat Apr 03 2021'), Date.parse('Fri Apr 02 2021')],
      },
      {
        dates: [Date.parse('Sat Mar 1 2021')],
      },
    ];
    expect(outputStreaks).toEqual(expectedOutput);
  });
});
