import React from "react";
import styles from "./classroomInfo.module.css";
import { ClassroomType } from "../../models/models";
import Instruments from "../instruments/Instruments";
import ScheduleUnit from "../scheduleUnit/ScheduleUnit";
import Title from "../title/Title";
import OccupantInfo from "./occupantInfo/OccupantInfo";
import OccupantRegistration from "./occupantRegistration/OccupantRegistration";

interface PropTypes {
  classroom: ClassroomType;
  dispatchNotification: (value: string) => void;
}

const ClassroomInfo: React.FC<PropTypes> = ({
  classroom,
  dispatchNotification,
}) => {
  const { name, instruments, description, chair, occupied } = classroom;
  const occupiedInfo = (
    <>
      <OccupantInfo occupied={occupied} />
    </>
  );

  return (
    <>
      <p className={styles.description}>
        {chair ? chair + ". " + description : description}
      </p>
      <Title title="Розклад на сьогодні" />
      <ScheduleUnit classroomName={name} />
      {instruments.length > 0 && (
        <>
          <Title title="Інструменти" />
          <Instruments expanded instruments={instruments} />
        </>
      )}
      {occupied ? (
        occupiedInfo
      ) : (
        <>
          <Title title="Запис в аудиторію" />
          <OccupantRegistration dispatchNotification={dispatchNotification} />
        </>
      )}
    </>
  );
};

export default ClassroomInfo;
