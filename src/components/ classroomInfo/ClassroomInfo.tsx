import React, {useEffect} from "react";
import styles from "./classroomInfo.module.css";
import {ACCESS_RIGHTS, ClassroomType} from "../../models/models";
import Instruments from "../instruments/Instruments";
import ScheduleUnit from "../scheduleUnit/ScheduleUnit";
import Title from "../title/Title";
import OccupantInfo from "./occupantInfo/OccupantInfo";
import OccupantRegistration from "./occupantRegistration/OccupantRegistration";
import {gql, useQuery} from "@apollo/client";
import {useLocal} from "../../hooks/useLocal";

interface PropTypes {
  classroom: ClassroomType;
  dispatchNotification: (value: string) => void;
  dispatch: (value: any) => void;
}

const ClassroomInfo: React.FC<PropTypes> = ({classroom, dispatchNotification, dispatch
}) => {
  const { name, instruments, description, chair, occupied, id } = classroom;
  const { data: {accessRights}} = useLocal('accessRights');
  const occupiedInfo = (
    <>
      <OccupantInfo occupied={occupied} />
    </>
  );
  const { data: {isPassed} } = useQuery(gql`
    query isPassed {
      isPassed @client
    }
  `);

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
        accessRights >= ACCESS_RIGHTS.DISPATCHER && <>
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
