import React, {useEffect, useState} from "react";
import styles from "./scheduleUnit.module.css";
import {GET_SCHEDULE_UNIT} from "../../api/operations/queries/schedule";
import {fullName} from "../../helpers/helpers";
import {ScheduleUnitType, ScheduleUnitTypeT} from "../../models/models";
import {usePopupWindow} from "../popupWindow/PopupWindowProvider";
import UserProfile from "../userProfile/UserProfile";
import moment from "moment";
import {client} from "../../api/client";
import ScheduleUnitList from "../../pages/schedule/ScheduleUnitList";

interface PropTypes {
  classroomName: string;
  userNameSearch?: string;
  date?: string;
  showEmpty?: boolean;
  color?: string;
}

const ScheduleUnit: React.FC<PropTypes> = ({classroomName, color, userNameSearch, date, showEmpty}) => {

  const [schedule, setSchedule] = useState<ScheduleUnitType[]>(null);
  const [subSchedule, setSubSchedule] = useState<ScheduleUnitType[]>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    client.query({
      query: GET_SCHEDULE_UNIT,
      variables: {
        classroomName,
        date: moment(date).set("h", 12).toISOString(),
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
      <span style={{backgroundColor: color + '55'}}>{classroomName}</span>
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
