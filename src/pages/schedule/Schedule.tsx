import React, {useEffect, useState} from "react";
import styles from "./schedule.module.css";
import Header from "../../components/header/Header";
import ScheduleUnit from "../../components/scheduleUnit/ScheduleUnit";
import {GET_CLASSROOMS} from "../../api/operations/queries/classrooms";
import {ACCESS_RIGHTS, ClassroomType} from "../../models/models";
import mainStyles from "../../styles/main.module.css";
import {useLocal} from "../../hooks/useLocal";
import Edit from "../../components/icons/edit/Edit";
import moment from "moment";
import {client} from "../../api/client";
import {WORKING_DAY_END, WORKING_DAY_START} from "../../helpers/constants";

const timePeriods = {
  from: WORKING_DAY_START,
  to: WORKING_DAY_END - 1,
}

// @ts-ignore
timePeriods[Symbol.iterator] = function() {
  return {
    current: this.from,
    last: this.to,
    next() {
      if (this.current <= this.last) {
        return { done: false, value: `${this.current++}:00` }
      } else {
        return { done: true }
      }
    }
  }
}

const Schedule = () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [classrooms, setClassrooms] = useState([]);
  const { data: {accessRights}} = useLocal('accessRights');
  const [userNameSearch, setUserNameSearch] = useState('');

  const getClassrooms = () => {
    setClassrooms(null);
    client.query({
      query: GET_CLASSROOMS,
      fetchPolicy: 'network-only'
    }).then(data => {
      const sortedClassrooms = data.data.classrooms.slice().sort(sort);
      setClassrooms(sortedClassrooms);
    });
  }

  useEffect(() => {
   getClassrooms();
  }, []);

  useEffect(() => {
    getClassrooms();
  }, [date]);

  const handleChangeDate = (e: any) => {
    setDate(moment(e.target.value).format('YYYY-MM-DD'));
  };

  const handleChangeSearch = (e: any) => {
    setUserNameSearch(e.target.value);
  };

  const sort = (a: ClassroomType, b: ClassroomType) => a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});

  return (
    <div>
      <Header>
        <h1>Розклад</h1>
        <input
          type="date"
          value={date}
          onChange={handleChangeDate}
          className={mainStyles.headerDateInput}
        />
        <input
          type="text"
          placeholder='Пошук викладачів'
          value={userNameSearch}
          onChange={handleChangeSearch}
          className={mainStyles.headerDateInput}
        />
        {accessRights === ACCESS_RIGHTS.ADMIN && <Edit path='/adminSchedule'/>}
      </Header>
      <div className={styles.wrapper}>
        <div className={styles.scheduleHeader}>
          <span className={styles.space}/>
          <div className={styles.timeline}>
            {/*@ts-ignore*/}
            {[...timePeriods].map(el => <span>{el}</span>)}
          </div>
        </div>
        <div className={styles.scheduleUnits}>
        {classrooms?.map((classroom: ClassroomType) => <div className={styles.row}>
            <ScheduleUnit
              classroomName={classroom.name}
              userNameSearch={userNameSearch}
              date={date}
              color={classroom.color}
            />
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
