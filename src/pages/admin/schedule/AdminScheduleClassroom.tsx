import React, {useEffect, useState} from 'react';
import Header from "../../../components/header/Header";
import {useParams} from "react-router-dom";
import DayTabs from "./dayTabs/DayTabs";
import styles from './scheduleAdmin.module.css';
import {GET_SCHEDULE_UNITS} from "../../../api/operations/queries/scheduleUnits";
import ScheduleUnitRow from "./scheduleUnitRow/ScheduleUnitRow";
import Add from "../../../components/icons/add/Add";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import ScheduleUnitPopup from './scheduleUnitPopup/ScheduleUnitPopup';
import {useNotification} from "../../../components/notification/NotificationProvider";
import {useQuery} from "@apollo/client";

const DAY_OF_WEEKS = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];

const AdminScheduleClassroom = () => {
  const {classroomName}: any = useParams();
  const [chosenDay, setChosenDay] = useState(0);
  const days = new Array(24).fill(null);
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();
  const {data, refetch} = useQuery(GET_SCHEDULE_UNITS, {
    fetchPolicy: 'network-only',
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
  });

  const refetchScheduleUnits = async () => {
    try {
      await refetch({
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
      });
    } catch (e: any) {
      dispatchNotification({
        header: "Упс! Сталася помилка",
        message: e?.message,
        type: "alert",
      });
    }
  }

  useEffect(() => {
    refetchScheduleUnits();
  }, [chosenDay]);

  const handleCreateUnit = () => {
    dispatchPopupWindow({
      header: <ScheduleUnitPopup.Header title='Створити новий відрізок'/>,
      body: (
        <ScheduleUnitPopup.Body
          dispatchPopupWindow={dispatchPopupWindow}
          dispatchNotification={dispatchNotification}
          allUnits={data?.scheduleUnits}
          selectedDay={chosenDay}
          classroomName={classroomName}
          refetch={refetch}
        />
      ),
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
        <ScheduleUnitRow
          units={data?.scheduleUnits || []}
          selectedDay={chosenDay}
          classroomName={classroomName}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default AdminScheduleClassroom;
