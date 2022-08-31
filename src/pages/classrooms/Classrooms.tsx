import React, {useEffect, useState} from "react";
import Header from "../../components/header/Header";
import {ACCESS_RIGHTS, ClassroomsFilterTypes, ClassroomType} from "../../models/models";
import Classroom from "../../components/classroom/Classroom";
import styles from "./classrooms.module.css";
import Caviar from "../../components/caviar/Caviar";
import {useNotification} from "../../components/notification/NotificationProvider";
import Edit from "../../components/icons/edit/Edit";
import HeaderSelect from "../../components/headerSelect/HeaderSelect";
import useClassrooms from "../../hooks/useClassrooms";
import {filterClassrooms} from "../../helpers/filterClassrooms";
import HeaderCheckbox from "../../components/headerCheckBox/HeaderCheckbox";
import Loader from "../../components/loader/Loader";
import {useLocal} from "../../hooks/useLocal";
import {FOLLOW_CLASSROOMS} from "../../api/operations/subscriptions/classrooms";

const filters = [
  {value: ClassroomsFilterTypes.ALL, label: 'Всі'},
  {value: ClassroomsFilterTypes.FREE, label: 'Вільні'},
  {value: ClassroomsFilterTypes.SPECIAL, label: 'Спеціалізовані'},
];

const Classrooms = () => {
  const [classrooms, subscribeToMore]: [ClassroomType[], any] = useClassrooms();
  const [filter, setFilter] = useState(filters[0].value);
  const [isNoWing, setIsNoWing] = useState(false);
  const [isOperaStudioOnly, setIsOperaStudioOnly] = useState(false);
  const dispatchNotification = useNotification();
  const {data: {accessRights}} = useLocal('accessRights');

  useEffect(() => {
    const unsubscribeClassrooms = subscribeToMore({
      document: FOLLOW_CLASSROOMS,
    });
    return () => unsubscribeClassrooms();
  });

  const handleFilterChange = (event: any) => {
    setFilter(event.value);
  };

  const handleToggleWing = () => {
    setIsNoWing(prevState => !prevState);
  };

  const handleToggleOperaStudio = () => {
    setIsOperaStudioOnly(prevState => !prevState);
  };

  return (
    <div className={styles.classroomsPage}>
      <Header>
        <h1>Аудиторії</h1>
        <HeaderSelect options={filters} onChange={handleFilterChange}/>
        <HeaderCheckbox label='Без флігеля' checked={isNoWing} setChecked={handleToggleWing}/>
        <HeaderCheckbox label='Тільки оперна студія' checked={isOperaStudioOnly}
                        setChecked={handleToggleOperaStudio}
        />
        {accessRights === ACCESS_RIGHTS.ADMIN && <Edit path='/adminClassrooms'/>}
      </Header>
      {!classrooms.length ? <Loader/> : (
        <>
          <Caviar dispatchNotification={dispatchNotification}
                  classrooms={filterClassrooms(classrooms, filter, isOperaStudioOnly, isNoWing)}
          />
          <ul className={styles.classroomsList}>
            {filterClassrooms(classrooms, filter, isOperaStudioOnly, isNoWing)
              .map((classroom: ClassroomType) => (
                <Classroom
                  dispatchNotification={dispatchNotification}
                  key={classroom.id}
                  classroom={classroom}
                />
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Classrooms;