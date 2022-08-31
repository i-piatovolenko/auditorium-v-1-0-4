import React, {FC} from 'react';
import {useQuery} from "@apollo/client";
import {GET_SCHEDULE_UNITS} from "../../api/operations/queries/scheduleUnits";
import styles from './classroomSchedule.module.css';
import moment from "moment";
import {ScheduleUnitType} from "../../models/models";
import ClassroomScheduleUnit from "./ClassroomScheduleUnit";
import Loader from "../loader/Loader";

type PropTypes = {
  classroomName: string;
  dispatchPopupWindow: (config: any) => void;
}

const ClassroomSchedule: FC<PropTypes> = ({classroomName, dispatchPopupWindow}) => {
  const {data, loading, error} = useQuery(GET_SCHEDULE_UNITS, {
    variables: {
      where: {
        classroom: {
          name: {
            equals: classroomName,
          }
        },
        dayOfWeek: {
          equals: moment().day(),
        },
      }
    }
  });
  if (!data?.scheduleUnits.length) return <span>Немає</span>
  return (
    <ul className={styles.list}>
      {data?.scheduleUnits.slice()
        .sort((a: ScheduleUnitType, b: ScheduleUnitType) => parseInt(a.from) - parseInt(b.from))
        .map((unit: ScheduleUnitType) => (
        <ClassroomScheduleUnit unit={unit} key={unit.id} dispatchPopupWindow={dispatchPopupWindow}/>
      ))}
    </ul>
  );
};

export default ClassroomSchedule;
