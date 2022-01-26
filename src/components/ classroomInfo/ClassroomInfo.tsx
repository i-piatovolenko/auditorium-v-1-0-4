import React, {useEffect, useState} from "react";
import styles from "./classroomInfo.module.css";
import {
  ClassroomType,
  DisabledState,
  OccupiedState,
  QueuePolicyTypes, QueueRecord,
  QueueState, QueueType,
  UserTypes
} from "../../models/models";
import Instruments from "../instruments/Instruments";
import Title from "../title/Title";
import OccupantInfo from "./occupantInfo/OccupantInfo";
import OccupantRegistration from "./occupantRegistration/OccupantRegistration";
import {gql, useQuery} from "@apollo/client";
import {isClassroomNotFree, isStudent, isTimeout} from "../../helpers/helpers";
import {client} from "../../api/client";
import {GET_CLASSROOM} from "../../api/operations/queries/classroom";
import moment from "moment";
import {FREE_CLASSROOM} from "../../api/operations/mutations/freeClassroom";
import ClassroomSchedule from "../classroomSchedule/ClassroomSchedule";

interface PropTypes {
  classroom: ClassroomType;
  dispatchNotification: (value: string) => void;
  dispatchPopupWindow: (value: any) => void;
  dispatch: (value: any) => void;
}

const ClassroomInfo: React.FC<PropTypes> = ({
                                              classroom, dispatchNotification, dispatch,
                                              dispatchPopupWindow
                                            }) => {
  const {name, instruments, description, chair, occupied, id} = classroom;
  const [queueSize, setQueueSize] = useState(0);
  const [isOccupiedOverdue, setIsOccupiedOverdue] = useState(false);
  const [date, setDate] = useState(moment().endOf('day').toISOString());
  const {data: {isPassed}} = useQuery(gql`
    query isPassed {
      isPassed @client
    }
  `);

  useEffect(() => {
    const isOverdueByStudent = occupied.state === OccupiedState.OCCUPIED &&
      isStudent(occupied.user.type as UserTypes) && isTimeout(occupied.until);
    setIsOccupiedOverdue(isOverdueByStudent as boolean);
  }, [occupied.state, occupied.user, occupied.until]);

  useEffect(() => {
    if (occupied.state !== OccupiedState.FREE && !occupied.user) {
      try {
        client.mutate({
          mutation: FREE_CLASSROOM,
          variables: {
            input: {
              classroomName: String(name)
            }
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
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
        setQueueSize(res.data.classroom.queue?.map((unit:  QueueRecord) => unit.state === QueueState.ACTIVE).length);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const defineStatus = () => {
    const {isHidden, disabled, queueInfo: {queuePolicy}, occupied} = classroom;
    // if (isOccupiedOverdue) return <span className={styles.overdue}>
    //   {`Час занять в аудиторії прострочений на
    // ${((isTimeout(occupied.until, true) as number) / 1000 / 60)
    //     .toFixed(0)} хв.`}
    // </span>
    if (isHidden) return 'Аудиторія прихована';
    if (disabled.state === DisabledState.DISABLED) {
      return `Аудиторія відключена від черги до ${
        moment(disabled.until).format('DD.MM.YYYY HH:mm')}. Причина: ${
        disabled.comment
      }`;
    }
    if (queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS
      && queuePolicy.queueAllowedDepartments.length) {
      return <>
        <span>Тільки для студентів: </span>
        {queuePolicy.queueAllowedDepartments.map(({department: {name}}) => {
          return <span className={styles.specialChair}>{name}</span>
        })}
      </>

    }
    if (queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS
      && !queuePolicy.queueAllowedDepartments.length) {
      return 'Аудиторія відключена від черги'
    }
    if (occupied.state === OccupiedState.FREE) return 'Аудиторія вільна'
    if (occupied.state === OccupiedState.OCCUPIED) return 'Аудиторія зайнята'
    if (occupied.state === OccupiedState.PENDING) return 'Аудиторія очікує підтвердження'
    if (occupied.state === OccupiedState.RESERVED) return 'Аудиторія зарезервована'
  }

  return (
    <div>
      {!!queueSize && <p>Черга за цією аудиторію: {queueSize} люд.</p>}
      {defineStatus()}
      <Title title="Розклад на сьогодні"/>
      <ClassroomSchedule classroomName={classroom.name} dispatchPopupWindow={dispatchPopupWindow}/>
      {instruments?.length > 0 && (
        <>
          <Title title="Інструменти"/>
          <Instruments expanded instruments={instruments}/>
        </>
      )}
      {isClassroomNotFree(occupied) && !isPassed ? (
        <OccupantInfo occupied={occupied}/>
      ) : (
        <>
          <Title title="Запис в аудиторію"/>
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
