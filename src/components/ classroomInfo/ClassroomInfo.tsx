import React, {useEffect, useState} from "react";
import styles from "./classroomInfo.module.css";
import {ClassroomType} from "../../models/models";
import Instruments from "../instruments/Instruments";
import Title from "../title/Title";
import OccupantInfo from "./occupantInfo/OccupantInfo";
import OccupantRegistration from "./occupantRegistration/OccupantRegistration";
import {gql, useQuery} from "@apollo/client";
import {isClassroomNotFree} from "../../helpers/helpers";
import {client} from "../../api/client";
import {GET_CLASSROOM} from "../../api/operations/queries/classroom";

interface PropTypes {
  classroom: ClassroomType;
  dispatchNotification: (value: string) => void;
  dispatchPopupWindow: (value: any) => void;
  dispatch: (value: any) => void;
}

const ClassroomInfo: React.FC<PropTypes> = ({classroom, dispatchNotification, dispatch,
                                              dispatchPopupWindow
}) => {
  const { name, instruments, description, chair, occupied, id } = classroom;
  const [queueSize, setQueueSize] = useState(0);
  const { data: {isPassed} } = useQuery(gql`
    query isPassed {
      isPassed @client
    }
  `);
  useEffect(() => {
    try {
    client.query({
      query: GET_CLASSROOM,
      variables: {
        where: {
          id
        }
      },
      fetchPolicy: 'network-only'
    }).then(res => {
      setQueueSize(res.data.classroom.queue?.length);
    });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div>
      <p className={styles.description}>
        {chair ? chair.name + ". " + description : description}
      </p>
      <p>Черга за цією аудиторію: {queueSize ? `${queueSize} люд.` : 'відсутня'}</p>
      {/*<Title title="Розклад на сьогодні" />*/}
      {/*<ScheduleUnit classroomName={name} />*/}
      {instruments?.length > 0 && (
        <>
          <Title title="Інструменти" />
          <Instruments expanded instruments={instruments} />
        </>
      )}
      {isClassroomNotFree(occupied) && !isPassed ? (
        <OccupantInfo occupied={occupied} />
      ) : (
        <>
          <Title title="Запис в аудиторію" />
          <OccupantRegistration
          dispatchNotification={dispatchNotification}
          dispatchPopupWindow={dispatchPopupWindow}
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