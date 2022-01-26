import moment from "moment";

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const TIME_SNIPPETS = [":00", ":15", ":30", ":45"];
export const WORKING_DAY_END = 23;
export const WORKING_DAY_START = 8;

export const FIRST_SEMESTER_START_DATE = moment().set('month', 7).set('date', 1).format('YYYY-MM-DD');
export const SECOND_SEMESTER_START_DATE = moment().set('month', 0).set('date', 1).format('YYYY-MM-DD');
export const FIRST_SEMESTER_END_DATE = moment().set('month', 11).set('date', 31).format('YYYY-MM-DD');
export const SECOND_SEMESTER_END_DATE = moment().set('month', 5).set('date', 30).format('YYYY-MM-DD');
export const CONSTANTLY_START_DATE = moment().set('month', 0).set('date', 1).format('YYYY-MM-DD');
export const CONSTANTLY_END_DATE = moment().set('month', 11).set('date', 31).set('year', 2099).format('YYYY-MM-DD');
