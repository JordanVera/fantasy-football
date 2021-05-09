/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
const moment = require('moment');

const dates = [
  moment('2021-05-12T02:55'),
  moment('2021-05-13T02:55'),
  moment('2021-05-19T02:55'),
  moment('2021-05-20T02:55')
];

const getAvailableWeeks = (all) => {
  const startingWeek = getStartingWeek();

  const weeks = new Array(18)
    .fill(0)
    .map((_, index) => index + 1)
    .filter((week) => week >= startingWeek);
  return weeks;
};

// const nflSeasonStart = moment(process.env.SEASON_START_DATE); // SEASON START
const getStartingWeek = () => {
  const now = moment();

  const startingWeek = dates.findIndex((date) => {
    const startInHours = date.diff(now, 'hour');
    return startInHours > 0;
  }) + 1;

  return startingWeek;
};

console.log('dates', dates);
console.log('getStartingWeek()', getStartingWeek());

module.exports = {
  getAvailableWeeks,
  getStartingWeek,
};
