import {HOUR, MINUTE, TIME_SNIPPETS, WORKING_DAY_END, WORKING_DAY_START,} from "./constants";
import {
  ACCESS_RIGHTS,
  ClassroomType,
  DisabledState,
  OccupiedInfo,
  OccupiedState,
  OccupiedStateUa,
  QueuePolicyTypes,
  ScheduleUnitType,
  StudentAccountStatus,
  User,
  UserTypes,
} from "../models/models";
import moment from "moment";
import {ReactElement} from "react";
import {accessRightsVar} from "../api/client";

export const getScheduleTimeline = (start: number, end: number): string[] => {
  let timeSnippets: string[] = [];
  for (let hour = start; hour <= end; hour++) {
    if (hour === end) {
      timeSnippets.push(hour + ":00");
    } else {
      TIME_SNIPPETS.forEach((minutes) => {
        timeSnippets.push(hour + minutes);
      });
    }
  }
  return timeSnippets;
};

const getScheduleTimeInMilliseconds = (scheduleUnitTime: any) => {
  return scheduleUnitTime
    .split(":")
    .map((el: any, index: number) => {
      return index === 0 ? Number(el) * HOUR : Number(el) * MINUTE;
    })
    .reduce((acc: any, curr: any) => acc + curr);
};

export const getPossiblyOccupied = (schedule: Array<any>) => {
  const current =
    new Date().getHours() * HOUR + new Date().getMinutes() * MINUTE;
  const timeSnippets = schedule.map((el: any) => {
    return {
      from: getScheduleTimeInMilliseconds(el.from),
      to: getScheduleTimeInMilliseconds(el.to),
    };
  });
  return timeSnippets
    .map((el: any) => {
      return current >= el.from && current <= el.to;
    })
    .some((el: any) => el === true);
};

export const getTimeHHMM = (date: Date) => {
  return date.getHours() + ":" + formatMinutesToMM(date.getMinutes());
};

export const getScheduleUnitRowLength = (
  schedule: Array<ScheduleUnitType>,
  units: string
) =>
  schedule
    .map((scheduleUnit: ScheduleUnitType) => {
      return parseInt(scheduleUnit.to) - parseInt(scheduleUnit.from) + units;
    })
    .join(" ");

export const formatMinutesToMM = (value: number) => {
  if (value <= 9) return `0${value}`;
  else return value;
};

export const formatTempName = (tempName: string) => {
  const withSpaces = tempName.toLowerCase().replaceAll(/\./gmi, '. ')
  const words = withSpaces.split(' ');
  const capitalizedWords = words.map(word => word[0]?.toUpperCase() === undefined ? '' : word[0].toUpperCase() + word.slice(1, word.length))
  return capitalizedWords.join(' ')
};

export const fullName = (user: User, withInitials = false) => {
  if (user) {
    if (user.nameTemp) return user.nameTemp;
    if (withInitials) {
      return `${user.lastName} ${user.firstName.charAt(0)}. ${
        user.patronymic ? user.patronymic.charAt(0) + "." : ""
      }`;
    } else {
      return `${user.lastName} ${user.firstName} ${
        user.patronymic ? user.patronymic : ""
      }`;
    }
  }
  return "";
};

export const typeStyle = (occupiedUser: User) => {
  const student = {backgroundColor: "rgba(46,40,124)", color: "#fff"};
  const employee = {backgroundColor: "#ffc000", color: "#fff"};
  const vacant = {
    backgroundColor: "transparent",
    color: "#000",
  };
  if (occupiedUser !== null) {
    switch (occupiedUser?.type) {
      case UserTypes.STUDENT:
        return student;
      case UserTypes.POST_GRADUATE:
        return student;
      default:
        return employee;
    }
  }
  return vacant;
};

//get int from time unit. ex: "9:15" -> 36 where each 15 min == 1; ex: "00:15" -> 1, "10:00" ->40
const simpleIntFromScheduleUnit = (time: string) => {
  const reducer = (accumulator: any, currentValue: any) =>
    accumulator + currentValue;
  return time
    .split(":")
    .map((el: string, index: number) => {
      if (index === 0) {
        return parseInt(el) * 4;
      } else {
        switch (parseInt(el)) {
          case 0:
            return 0;
          case 15:
            return 1;
          case 30:
            return 2;
          case 45:
            return 3;
        }
      }
    })
    .reduce(reducer);
};

export const isFirstScheduleUnitEmpty = (units: Array<ScheduleUnitType>) => {
  const firstItem = {
    from: WORKING_DAY_START + ':00',
    to: units[0].from,
  }
  return scheduleUnitSize(firstItem as ScheduleUnitType) > 0
}

export const scheduleUnitSize = (unit: ScheduleUnitType) => {
  const fromArr = unit.from.split(':');
  const toArr = unit.to.split(':');
  const from = moment().set('hours', parseInt(fromArr[0])).set('minutes', parseInt(fromArr[1]));
  const to = moment().set('hours', parseInt(toArr[0])).set('minutes', parseInt(toArr[1]));
  const diff = to.diff(from);
  return diff / 1000 / 60 / 60
}
export const getScheduleUnitSize = (
  units: Array<ScheduleUnitType>,
  fillEmpty = true
) => {
  if (!units.length) return '';
  const items = [];

  let lastPeriodEnd = WORKING_DAY_START + ':00';

  for (let item of units) {
    const spaceItem = {
      from: lastPeriodEnd,
      to: item.from
    }
    const spaceSize = scheduleUnitSize(spaceItem as ScheduleUnitType);
    spaceSize && items.push(spaceSize);

    const time = scheduleUnitSize(item);
    items.push(time);

    lastPeriodEnd = item.to;
  }

  if (fillEmpty) {
    items.push(WORKING_DAY_END - parseFloat(units[units.length - 1].to));
  }

  const percent = (WORKING_DAY_END - WORKING_DAY_START) / 100

  return items.map((item) => `${(item / percent).toFixed(1)}%`).join(" ");
};
//get schedule units size in fr units for grids

export const ISODateString = (d: Date) => {
  function pad(n: any) {
    return n < 10 ? "0" + n : n;
  }

  return (
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1) +
    "-" +
    pad(d.getUTCDate())
    // +
    // "T" +
    // pad(d.getUTCHours()) +
    // ":" +
    // pad(d.getUTCMinutes()) +
    // ":" +
    // pad(d.getUTCSeconds()) +
    // "Z"
  );
};

export const scheduleUnitToDate = (item: ScheduleUnitType) => {
  const from = item.from.split(':');
  const to = item.to.split(':');
  const fromHours = +from[0];
  const fromMinutes = +from[1];
  const toHours = +to[0];
  const toMinutes = +to[1];
  const fromDate = moment({hours: fromHours, minutes: fromMinutes, seconds: 0, milliseconds: 0});
  const toDate = moment({hours: toHours, minutes: toMinutes, seconds: 0, milliseconds: 0});

  return {
    from: fromDate,
    to: toDate
  };
};

export const isOccupiedOnSchedule = (scheduleUnits: ScheduleUnitType[]) => {
  const result: any = [];

  scheduleUnits.forEach(item => result.push(scheduleUnitToDate(item)));

  return result.some((item: { from: Date, to: Date }) => {
    const current = moment();

    return current.isAfter(item.from) && current.isBefore(item.to);
  });
};

export const showNotification = (dispatcher: any, data: string[] | HTMLElement[] | ReactElement[]) => {
  dispatcher({
    header: data[0],
    message: data[1],
    type: data[2],
  });
};

export const setAccessRights = (user: User) => {
  let accessRights = ACCESS_RIGHTS.USER;

  if (user && user?.type) {
    switch (user.type) {
      case UserTypes.ADMIN:
        accessRights = ACCESS_RIGHTS.ADMIN;
        break;
      case UserTypes.DISPATCHER:
        accessRights = ACCESS_RIGHTS.DISPATCHER;
        break;
      default:
        accessRights = ACCESS_RIGHTS.USER;
    }
  }

  accessRightsVar(accessRights);
};


export const isClassroomNotFree = (occupied: OccupiedInfo) => {
  return occupied.state !== OccupiedState.FREE;
};

export const checkVerified = (user: User) => {
  if (!user.studentInfo) return true;
  return user.studentInfo.accountStatus !== StudentAccountStatus.UNVERIFIED;
};

export const isStudent = (type: UserTypes) => {
  return type === UserTypes.STUDENT || type === UserTypes.POST_GRADUATE;
}

export const isTimeout = (time: string, returnDiffInMs = false) => {
  const outerTime = moment(time);
  const currentTime = moment();
  if (returnDiffInMs) return currentTime.diff(outerTime);
  return currentTime.diff(outerTime) > 0;
}

export const shouldOccupiedByTeacherDate = (classroomName: string, scheduleUnits: ScheduleUnitType[]) => {
  let endH = moment().set('hours', WORKING_DAY_END).set('minutes', 0).set('seconds', 0);
  if (!scheduleUnits.length) return endH;
  const occupiedOnSchedule = scheduleUnits.some(scheduleUnit => {
    const [fromH, fromM] = scheduleUnit.from.split(':');
    const [toH, toM] = scheduleUnit.to.split(':');
    const fromDate = moment().set('hours', +fromH).set('minutes', +fromM);
    const toDate = moment().set('hours', +toH).set('minutes', +toM);
    const currentDate = moment();

    const hasIntersection = currentDate.isBetween(fromDate, toDate)
    if (hasIntersection) endH = fromDate;
    return endH;
  });
}

export const shouldOccupiedByTeacher = (classroomName: string, scheduleUnits: ScheduleUnitType[]) => {
  if (!scheduleUnits.length) return 'Вільно'
  const occupiedOnSchedule = scheduleUnits.some(scheduleUnit => {
    const [fromH, fromM] = scheduleUnit.from.split(':');
    const [toH, toM] = scheduleUnit.to.split(':');
    const fromDate = moment().set('hours', +fromH).set('minutes', +fromM);
    const toDate = moment().set('hours', +toH).set('minutes', +toM);
    const currentDate = moment();

    const hasIntersection = currentDate.isBetween(fromDate, toDate)

    return hasIntersection;
  });
  if (occupiedOnSchedule) return 'Зайнято за розкладом';
  return 'Вільно';
};

export const defineOccupyStatus = (classroom: ClassroomType, scheduleUnits: ScheduleUnitType[], isOverdue: boolean) => {
  const {queueInfo: {queuePolicy: {policy, queueAllowedDepartments}}, disabled, occupied} = classroom;

  if (policy === QueuePolicyTypes.SELECTED_DEPARTMENTS && !queueAllowedDepartments.length) {
    return 'Обмежений доступ';
  }
  if (isOverdue) return 'Резервація прострочена!';
  if (disabled?.state === DisabledState.DISABLED) {
    return disabled?.comment + ' до ' + moment(disabled.until).format('DD-MM-YYYY HH:mm');
  }
  if (isClassroomNotFree(occupied)) {
    if (occupied.state === OccupiedState.RESERVED && occupied.keyHolder) {
     return OccupiedStateUa[occupied?.state as OccupiedState]
       + ` (ключ в класі у ${fullName(occupied.keyHolder, true)})`;
    }
    return OccupiedStateUa[occupied?.state as OccupiedState];
  }
  return shouldOccupiedByTeacher(classroom.name, scheduleUnits);
};

export const formatTimeWithZero = (time: string) => {
  if (!time) return;

  const [hh, mm] = time.split(':');
  const formattedHH = hh.length === 1 ? '0' + hh : hh;
  const formattedMM = mm.length === 1 ? '0' + mm : mm;
  return `${formattedHH}:${formattedMM}`;
}

export const getBriefString = (str: string) => {
  if (!str) return '';
  if (str.length < 16) return str;

  const words = str.split(' ');

  const briefWords = words.map(word => {
    if (word[3] === 'о' || word[3] === 'е' || word[3] === 'і' || word[3] === 'ї'
      || word[3] === 'а' || word[3] === 'у'|| word[3] === 'и') {

      return word.slice(0, 3) + (word.length > 3 ? '.' : '');
    }

    return word.slice(0, 4) + (word.length > 4 ? '.' : '');
  });

  return briefWords.join(' ');
};
