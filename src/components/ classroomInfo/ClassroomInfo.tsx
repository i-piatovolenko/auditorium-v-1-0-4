import React, {useEffect} from "react";
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
  dispatch: (value: any) => void;
  isPassed: boolean;
}

const ClassroomInfo: React.FC<PropTypes> = ({classroom, dispatchNotification, dispatch,
  isPassed
}) => {
  const { name, instruments, description, chair, occupied, id } = classroom;
  const occupiedInfo = (
    <>
      <OccupantInfo occupied={occupied} />
    </>
  );

  return (
    <div>
      <p className={styles.description}>
        {chair ? chair.name + ". " + description : description}
      </p>
      <Title title="Розклад на сьогодні" />
      <ScheduleUnit classroomName={name} />
      {instruments.length > 0 && (
        <>
          <Title title="Інструменти" />
          <Instruments expanded instruments={instruments} />
        </>
      )}
      {occupied && !isPassed ? (
        occupiedInfo
      ) : (
        <>
          <Title title="Запис в аудиторію" />
          <OccupantRegistration
            dispatchNotification={dispatchNotification}
            classroomId={id}
            classroomName={name}
            dispatch={dispatch}
          />
        </>
      )}
    </div>
  );
};

export default ClassroomInfo;
