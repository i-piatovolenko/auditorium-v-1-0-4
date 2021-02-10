import React from "react";
import Header from "../../components/header/Header";
import { ClassroomType } from "../../models/models";
import Classroom from "../../components/classroom/Classroom";
import styles from "./classrooms.module.css";
import Caviar from "../../components/caviar/Caviar";
import { useNotification } from "../../components/notification/NotificationProvider";

type PropTypes = {
  classrooms: Array<ClassroomType> | undefined;
};

const Classrooms: React.FC<PropTypes> = ({ classrooms }) => {
  const dispatch = useNotification();
  const dispatchNotification = (value: string) => {
    dispatch({
      message: value
    });
  };
  return (
    <div className={styles.classroomsPage}>
      <Header>Аудиторії</Header>
      <Caviar
        dispatchNotification={dispatchNotification}
        classrooms={classrooms as Array<ClassroomType>}
      />
      <ul className={styles.classroomsList}>
        {(classrooms as Array<ClassroomType>) !== undefined &&
          (classrooms as Array<ClassroomType>).map((classroom) => (
            <Classroom
              dispatchNotification={dispatchNotification}
              key={classroom.id}
              classroom={classroom}
            />
          ))}
      </ul>
    </div>
  );
};

export default Classrooms;
