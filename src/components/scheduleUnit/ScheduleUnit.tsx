import React, {useEffect, useRef, useState} from "react";
import styles from "./scheduleUnit.module.css";
import {GET_SCHEDULE_UNIT} from "../../api/operations/queries/schedule";
import {
  fullName, getScheduleUnitSize, scheduleUnitSize,
} from "../../helpers/helpers";
import {ActivityTypes, ScheduleUnitType} from "../../models/models";
import Button from "../button/Button";
import {usePopupWindow} from "../popupWindow/PopupWindowProvider";
import UserProfile from "../userProfile/UserProfile";
import moment from "moment";
import {client} from "../../api/client";
import {WORKING_DAY_END, WORKING_DAY_START} from "../../helpers/constants";

interface PropTypes {
  classroomName: string;
  userNameSearch?: string;
  date?: string;
  showEmpty?: boolean;
}

const ScheduleUnit: React.FC<PropTypes> = ({classroomName, userNameSearch, date, showEmpty}) => {

  const [schedule, setSchedule] = useState<ScheduleUnitType[]>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    client.query({
      query: GET_SCHEDULE_UNIT,
      variables: {
        classroomName: classroomName,
        date: moment(date).toISOString(),
      },
    }).then((data: any) => {
      setSchedule(data.data.schedule);
    });
  }, []);

  const mappedSchedule = (schedule: ScheduleUnitType[]): ScheduleUnitType[] => {
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

  useEffect(() => {
    if (schedule) {
      const allUserNames = schedule.map(unit => fullName(unit.user)?.toLowerCase()).join('');
      if (allUserNames.includes(userNameSearch?.toLowerCase())) {
        setSearched(true);
      } else {
        setSearched(false);
      }
    }
  }, [userNameSearch, schedule])

  const dispatchPopupWindow = usePopupWindow();

  const handleClick = (unit: ScheduleUnitType) => {
    dispatchPopupWindow({
      header: <h1>{fullName(unit.user)}</h1>,
      body: <UserProfile userId={unit.user.id as number}/>,
    });
  };

  if (!schedule?.length) return <></>;

  return schedule && schedule.length && searched && (
    <div className={styles.scheduleRowWrapper}>
      <span>{classroomName}</span>
      <ul
        style={{
          gridTemplateColumns: document.body.clientWidth >= 1024 ? getScheduleUnitSize(schedule
              .slice()
              .sort(
                (a: ScheduleUnitType, b: ScheduleUnitType) =>
                  parseInt(a.from) - parseInt(b.from)
              ))
            : "100%"
        }}
        className={styles.scheduleRow}
      >
        {!!schedule.length && mappedSchedule(schedule)
          .map((unit: ScheduleUnitType) => (
            <li>
              {unit?.user && (
                <Button
                  onClick={() => handleClick(unit)}
                  style={{
                    height: "2rem",
                    width: "100%",
                    //@ts-ignore
                    backgroundColor: ActivityTypes[unit.activity],
                    //@ts-ignore
                    border: `1px solid ${ActivityTypes[unit.activity]}`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={fullName(unit.user, true) + " " + unit.from + " - " + unit.to}
                >
                  {fullName(unit.user, true) + " " + unit.from + " - " + unit.to}
                </Button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ScheduleUnit;
