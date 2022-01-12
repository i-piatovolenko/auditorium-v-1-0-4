import React, {useEffect, useState} from 'react';
import Header from "../../../components/header/Header";
import {useParams} from "react-router-dom";
import DayTabs from "./dayTabs/DayTabs";
import {client} from "../../../api/client";
import styles from './scheduleAdmin.module.css';
import {GET_SCHEDULE_UNITS} from "../../../api/operations/queries/scheduleUnits";
import ScheduleUnitRow from "./scheduleUnitRow/ScheduleUnitRow";
import Add from "../../../components/icons/add/Add";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import ScheduleUnitPopup from './scheduleUnitPopup/ScheduleUnitPopup';

const DAY_OF_WEEKS = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];

const AdminScheduleClassroom = () => {
  const {classroomName}: any = useParams();
  const [schedule, setSchedule] = useState([]);
  const [chosenDay, setChosenDay] = useState(0);
  const days = new Array(24).fill(null);
  const dispatchPopupWindow = usePopupWindow();

  useEffect(() => {
    client.query({
      query: GET_SCHEDULE_UNITS,
      variables: {
        where: {
          classroom: {
            name: {
              equals: classroomName
            }
          },
          dayOfWeek: {
            equals: chosenDay
          },
        }
      }
    }).then(result => {
      setSchedule(result.data.scheduleUnits);
    });
  }, [chosenDay]);

  const handleCreateUnit = () => {
    dispatchPopupWindow({
      header: <ScheduleUnitPopup.Header title='Створити новий відрізок'/>,
      body: <ScheduleUnitPopup.Body dispatchPopupWindow={dispatchPopupWindow} allUnits={schedule}/>,
      footer: ''
    });
  };

  return (
    <div>
      <Header>
        <h1>Управління розкладом в аудиторії {classroomName}</h1>
        <Add onClick={handleCreateUnit}/>
      </Header>
      <DayTabs onChange={setChosenDay} chosenDay={chosenDay} days={DAY_OF_WEEKS}/>
      <div className={styles.days}>
        {days.map((_, index) => (
          <span>{index}</span>
        ))}
      </div>
      <div className={styles.wrapper}>
        <ScheduleUnitRow units={schedule}/>
      </div>
    </div>
  );
};

export default AdminScheduleClassroom;
