import React, {useEffect, useState} from "react";
import styles from "./scheduleUnit.module.css";
import {GET_SCHEDULE_UNIT} from "../../api/operations/queries/schedule";
import {fullName, getScheduleUnitSize, scheduleUnitSize,} from "../../helpers/helpers";
import {ActivityTypes, ScheduleUnitType, ScheduleUnitTypeT} from "../../models/models";
import Button from "../button/Button";
import {usePopupWindow} from "../popupWindow/PopupWindowProvider";
import UserProfile from "../userProfile/UserProfile";
import moment from "moment";
import {client} from "../../api/client";
import {WORKING_DAY_END, WORKING_DAY_START} from "../../helpers/constants";
import ScheduleUnitList from "../../pages/schedule/ScheduleUnitList";

interface PropTypes {
  classroomName: string;
  userNameSearch?: string;
  date?: string;
  showEmpty?: boolean;
}

const ScheduleUnit: React.FC<PropTypes> = ({classroomName, userNameSearch, date, showEmpty}) => {

  const [schedule, setSchedule] = useState<ScheduleUnitType[]>(null);
  const [subSchedule, setSubSchedule] = useState<ScheduleUnitType[]>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    client.query({
      query: GET_SCHEDULE_UNIT,
      variables: {
        classroomName: classroomName,
        date: moment(date).toISOString(),
      },
    }).then((data: any) => {
      const primary = data.data.schedule.filter((unit: ScheduleUnitType) => unit.type === ScheduleUnitTypeT.PRIMARY);
      const substitutions = data.data.schedule
        .filter((unit: ScheduleUnitType) => unit.type === ScheduleUnitTypeT.SUBSTITUTION);

      setSchedule(primary);
      setSubSchedule(substitutions);
    });
  }, []);

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

  if (!schedule?.length && !subSchedule?.length) return <></>;

  return schedule && schedule.length && searched && (
    <div className={styles.scheduleRowWrapper}>
      <span>{classroomName}</span>
      <div className={styles.listsContainer}>
        <div className={styles.absoluteWrapper}>
          <ScheduleUnitList units={subSchedule} onClick={handleClick} withoutGrid/>
        </div>
        <ScheduleUnitList units={schedule} onClick={handleClick}/>
      </div>
    </div>
  );
};

export default ScheduleUnit;
