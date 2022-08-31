import React, {useState} from "react";
import styles from "./schedule.module.css";
import Header from "../../components/header/Header";
import ScheduleUnit from "../../components/scheduleUnit/ScheduleUnit";
import {useQuery} from "@apollo/client";
import {GET_CLASSROOMS} from "../../api/operations/queries/classrooms";
import {ACCESS_RIGHTS, ClassroomType} from "../../models/models";
import mainStyles from "../../styles/main.module.css";
import {useLocal} from "../../hooks/useLocal";
import Edit from "../../components/icons/edit/Edit";
import moment from "moment";

const timePeriods = [
  '9:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00'
];

const Schedule = () => {
  const [date, setDate] = useState(new Date());
  const {data, loading, error} = useQuery(GET_CLASSROOMS, {
    variables: {date: moment(date).toISOString()}
  });
  const { data: {accessRights}} = useLocal('accessRights');

  const handleChangeDate = (e: any) => {
    setDate(e.target.value);
  }

  return (
    <div>
      <Header>
        <h1>Розклад</h1>
        <input
          type="date"
          value={date as unknown as string}
          onChange={handleChangeDate}
          className={mainStyles.headerDateInput}
        />
        {accessRights === ACCESS_RIGHTS.ADMIN && <Edit path='/adminSchedule'/>}
      </Header>
      <div className={styles.wrapper}>
        <div className={styles.scheduleHeader}>
          <span className={styles.space}/>
          <div className={styles.timeline}>
            {timePeriods.map(el => <span>{el}</span>)}
          </div>
        </div>
        <div className={styles.scheduleUnits}>
        {!loading && !error && data.classrooms.slice().sort((a: ClassroomType, b: ClassroomType) => {
          return parseInt(a.name) - parseInt(b.name)
        })
          .map((classroom: ClassroomType) => <div className={styles.row}>
            <span>{classroom.name}</span>
            <ScheduleUnit classroomName={classroom.name}/>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
