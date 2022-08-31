import React, {useEffect, useState} from 'react';
import Header from "../../../components/header/Header";
import DataList from "../../../components/dataList/DataList";
import useClassrooms from "../../../hooks/useClassrooms";
import {ClassroomType} from "../../../models/models";
import {useHistory} from "react-router-dom";
import Back from "../../../components/icons/back/Back";
import styles from './scheduleAdmin.module.css';

const listHeader = ['Виберіть аудиторію', ''];

const AdminSchedule = () => {
  const [classrooms] = useClassrooms();
  const history = useHistory();
  const [listData, setListData] = useState([]);

  const listDataItem = (item: ClassroomType) => (
    <>
      <div className={styles.classroomListItemContainer}>
        <div className={styles.classroomListItemMark} style={{backgroundColor: item.color}}/>
        <span
          key={item.id}
          onClick={() => navToChosenClassroom(item.name)}
          className={styles.classroomListItem}
        >
        Аудиторія {item.name}
      </span>
      </div>
      <span/>
    </>
  );

  const navToChosenClassroom = (classroomName: string) => {
    history.push(`/adminSchedule/classroom/${classroomName}`);
  };

  useEffect(() => {
    if (!!classrooms.length) {
      const data = classrooms.map(classroom => listDataItem(classroom));
      setListData(data);
    }
  }, [classrooms]);

  return (
    <div>
      <Header>
        <Back/>
        <h1>Управління розкладом</h1>
      </Header>
      <DataList header={listHeader} data={listData} gridTemplateColumns=' 200px 1fr'/>
    </div>
  );
};

export default AdminSchedule;
