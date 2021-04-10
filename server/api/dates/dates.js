/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
const moment = require('moment');

const getAvailableWeeks = (all) => {
  const startingWeek = getStartingWeek();

  const weeks = new Array(17).fill(0)
    .map((_, index) => index + 1).filter(week => week >= startingWeek);
  return weeks;
};

const getStartingWeek = () => {
  const now = moment();
  const nflSeasonStart = moment(process.env.SEASON_START_DATE); // SEASON START
  const weekDiff = Math.ceil(now.diff(nflSeasonStart, 'hour') / 24 / 7);
  const startingWeek = Math.min(Math.max(weekDiff, 1), 17); // 1, ..., 17

  return startingWeek;
};

module.exports = {
  getAvailableWeeks,
  getStartingWeek
};
