import moment from "moment";
import {ScheduleUnitType} from "../models/models";

export const isDateInRange = (date: any, dateFrom: string, dateTo: string) => {
  const momentDateFrom = moment(dateFrom);
  const momentDateTo = moment(dateTo);
  return date.isBetween(momentDateFrom, momentDateTo);
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

class Interval implements IntervalI
{
  constructor(start: number,end: number)
  {
    this.start = start;
    this.end = end;
  }

  end: number;
  start: number;
}

export const hasUnitDateIntersection = (dateTime: string, currentUnitId: number, allUnits: ScheduleUnitType[]) => {
  const currentDate = moment(dateTime);
  const units = currentUnitId !== -1 ? allUnits.filter(({id}) => id !== currentUnitId) : allUnits;

  return units.filter(unit => {
    const unitDateStart = moment(unit.dateStart);
    const unitDateEnd = moment(unit.dateEnd);

    return currentDate.isBetween(unitDateStart, unitDateEnd);
  });
};

export const hasUnitTimeIntersection = (intersectedElement: ScheduleUnitType, timeFrom: string, timeTo: string) => {
  const [fromH, fromM] = intersectedElement.from.split(':');
  const [toH, toM] = intersectedElement.to.split(':');
  const [fromCurrH, fromCurrM] = timeFrom.split(':');
  const [toCurrH, toCurrM] = timeTo.split(':');

  const intersectedFromMinutes = (+fromH * 60) + +fromM;
  const intersectedToMinutes = (+toH * 60) + +toM;
  const currentFromMinutes = (+fromCurrH * 60) + +fromCurrM;
  const currentToMinutes = (+toCurrH * 60) + +toCurrM;
  if (isIntersect([
    new Interval(intersectedFromMinutes, intersectedToMinutes),
    new Interval(currentFromMinutes, currentToMinutes)
  ], 2)) {
    return intersectedElement
  } else return false;
};

export const hasUnitDateTimeIntersection = (dateTime: string, currentUnitId: number, allUnits: ScheduleUnitType[], timeFrom: string, timeTo: string) => {
  const intersectedElements = hasUnitDateIntersection(dateTime, currentUnitId, allUnits);
  if (intersectedElements.length) {
    const result = intersectedElements.filter(el => hasUnitTimeIntersection(el, timeFrom, timeTo));

    return result.length ? result : false;
  } else {
    return false;
  }
};
