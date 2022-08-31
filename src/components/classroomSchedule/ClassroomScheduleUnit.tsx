import React, {FC} from 'react';
import {ScheduleUnitType} from "../../models/models";
import styles from './classroomSchedule.module.css';
import {fullName} from "../../helpers/helpers";
import Button from "../button/Button";
import UserProfile from "../userProfile/UserProfile";

type PropTypes = {
  unit: ScheduleUnitType;
  dispatchPopupWindow: (config: any) => void;
}

const ClassroomScheduleUnit: FC<PropTypes> = ({unit, dispatchPopupWindow}) => {
  const handleClick = () => {
    dispatchPopupWindow({
      header: <h1>{fullName(unit.user)}</h1>,
      body: <UserProfile userId={unit.user.id as number}/>,
    });
  };

  return (
    <li onClick={handleClick}>
      <button className={styles.unit}>
        {fullName(unit.user, true)} {unit.from}-{unit.to}
      </button>
    </li>
  );
};

export default ClassroomScheduleUnit;
