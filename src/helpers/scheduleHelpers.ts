import moment from "moment";
import {ScheduleUnitType} from "../models/models";
import {WORKING_DAY_END, WORKING_DAY_START} from "./constants";
import {fullName, scheduleUnitSize} from "./helpers";

export const isDateInRange = (date: any, dateFrom: string, dateTo: string) => {
  const momentDateFrom = moment(dateFrom);
  const momentDateTo = moment(dateTo);
  return date.isBetween(momentDateFrom, momentDateTo);
};

export const getMinutesFromHHMM = (time: string) => {
  const [hh, mm] = time.split(':');
  return (+hh * 60) + +mm;
};

const isIntersect = (arr: any, n: any) => {
  // Sort intervals in increasing order of start time
  arr.sort(function (i1: any, i2: any) {
    return i1.start - i2.start;
  });

  // In the sorted array, if start time of an interval
  // is less than end of previous interval, then there
  // is an overlap
  for (let i = 1; i < n; i++)
    if (arr[i - 1].end > arr[i].start)
      return true;

  // If we reach here, then no overlap
  return false;
};

interface IntervalI {
  start: number;
  end: number;
}

class Interval implements IntervalI {
  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  end: number;
  start: number;
}

export const hasUnitDateIntersection = (dateTime: string, currentUnitId: number, allUnits: ScheduleUnitType[]) => {
  const currentDate = moment(dateTime).startOf('day');
  const units = currentUnitId !== -1 ? allUnits.filter(({id}) => id !== currentUnitId) : allUnits;

  return units.filter(unit => {
    const unitDateStart = moment(unit.dateStart).startOf('day');
    const unitDateEnd = moment(unit.dateEnd).startOf('day');

    return currentDate.isBetween(unitDateStart, unitDateEnd);
  });
};

export const hasUnitTimeIntersection = (intersectedElement: ScheduleUnitType, timeFrom: string, timeTo: string) => {
  const intersectedFromMinutes = getMinutesFromHHMM(intersectedElement.from);
  const intersectedToMinutes = getMinutesFromHHMM(intersectedElement.to);
  const currentFromMinutes = getMinutesFromHHMM(timeFrom);
  const currentToMinutes = getMinutesFromHHMM(timeTo);

  const intervalA = new Interval(intersectedFromMinutes, intersectedToMinutes);
  const intervalB = new Interval(currentFromMinutes, currentToMinutes);

  if (isIntersect([intervalA, intervalB], 2)) {
    return intersectedElement;
  } else {
    return false;
  }
};

export const hasUnitDateTimeIntersection = (dateTime: string, currentUnitId: number, allUnits: ScheduleUnitType[] = [], timeFrom: string, timeTo: string) => {
  if (!allUnits?.length) return false;

  const intersectedElements = hasUnitDateIntersection(dateTime, currentUnitId, allUnits);
  if (intersectedElements.length) {
    const result = intersectedElements.filter(el => hasUnitTimeIntersection(el, timeFrom, timeTo));
    return result.length ? result : false;
  } else {
    return false;
  }
};

export const withinPrimaryUnitBoundaries = (subUnit: ScheduleUnitType, primaryUnit: ScheduleUnitType) => {
  const subFrom = getMinutesFromHHMM(subUnit.from);
  const subTo = getMinutesFromHHMM(subUnit.to);
  const primaryFrom = getMinutesFromHHMM(primaryUnit.from);
  const primaryTo = getMinutesFromHHMM(primaryUnit.to);

  return (
    moment(subUnit.dateStart).startOf('day')
      .isSameOrAfter(moment(primaryUnit.dateStart).startOf('day')) &&
    moment(subUnit.dateEnd).startOf('day')
      .isSameOrBefore(moment(primaryUnit.dateEnd).startOf('day')) &&
    subFrom >= primaryFrom && subTo <= primaryTo
  );
};

export const isBiggerThanSubstitutions = (primaryUnit: ScheduleUnitType, substitutions: ScheduleUnitType[] = []) => {
  if (!substitutions?.length) return true;

  const subStartDateMin = moment
    .min(substitutions.map(unit => moment(unit.dateStart).startOf('day'))).startOf('day');
  const subStartDateMax = moment
    .max(substitutions.map(unit => moment(unit.dateEnd).startOf('day'))).startOf('day');
  const subFromMin = Math.min(...substitutions.map(unit => getMinutesFromHHMM(unit.from)));
  const subToMax = Math.max(...substitutions.map(unit => getMinutesFromHHMM(unit.to)));
  const primaryFrom = getMinutesFromHHMM(primaryUnit.from);
  const primaryTo = getMinutesFromHHMM(primaryUnit.to);

  return (
    moment(primaryUnit.dateStart).startOf('day').isBefore(subStartDateMin) &&
    moment(primaryUnit.dateEnd).startOf('day').isAfter(subStartDateMax) &&
    subFromMin > primaryFrom && subToMax < primaryTo
  );
};

export const isOverlaps = (
  dateStart: string, dateEnd: string, timeFrom: string, timeTo: string,
  unit: ScheduleUnitType
) => {
  const r1Start = moment(dateStart).startOf('day');
  const r1End = moment(dateEnd).startOf('day');
  const r2Start = moment(unit.dateStart).startOf('day');
  const r2End = moment(unit.dateEnd).startOf('day');
  if (r1Start.isSameOrBefore(r2Start) && r1End.isSameOrAfter(r2End)) {
    return hasUnitTimeIntersection(unit, timeFrom, timeTo);
  } else {
    return false;
  }
};

export const hasOverlappedUnits = (
  dateStart: string, dateEnd: string, timeFrom: string, timeTo: string,
  units: ScheduleUnitType[]
) => {
  const result = units?.map(unit => isOverlaps(dateStart, dateEnd, timeFrom, timeTo, unit)).filter(unit => unit);
  return result?.length ? result : false;
};

export const mappedSchedule = (schedule: ScheduleUnitType[]): ScheduleUnitType[] => {
  let res = []
  const data = schedule.slice()
    .sort(
      (a: ScheduleUnitType, b: ScheduleUnitType) =>
        parseInt(a.from) - parseInt(b.from)
    );
  let lastItemEnd = WORKING_DAY_START + ':00';
  for (let item of data) {
    const spacerData = {
      from: lastItemEnd,
      to: item.from
    }
    const spacer = scheduleUnitSize(spacerData as ScheduleUnitType);
    if (spacer) {
      res.push(spacerData);
    }
    lastItemEnd = item.to;
    res.push(item);
  }
  res.push(WORKING_DAY_END - parseFloat(data[data.length - 1].to));
  return res as ScheduleUnitType[];
}

export const scheduleUnitToString = (unit: ScheduleUnitType) => {
  return (
    fullName(unit.user, true)
    + ' | '
    + moment(unit.dateStart).format('DD.MM.YYYY') + ' - '
    + moment(unit.dateEnd).format('DD.MM.YYYY')
    + ' | '
    + unit.from + ' - ' + unit.to
  );
};
