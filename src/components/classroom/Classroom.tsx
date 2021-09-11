import React, {useEffect, useRef, useState} from "react";
import styles from "./classroom.module.css";
import {
  ClassroomType,
  DisabledState,
  OccupiedInfo,
  OccupiedState,
  OccupiedStateUa,
  QueuePolicyTypes,
  User,
  UserTypes,
  UserTypesUa,
} from "../../models/models";
import {fullName, isClassroomNotFree, typeStyle} from "../../helpers/helpers";
import Instruments from "../instruments/Instruments";
import {usePopupWindow} from "../popupWindow/PopupWindowProvider";
import ClassroomInfo from "../ classroomInfo/ClassroomInfo";
import Tag from "../tag/Tag";
import Footer from "../footer/Footer";
import specialPiano from "../../assets/images/specialPiano.svg";
import moment from "moment";

interface PropTypes {
  classroom: ClassroomType;
  dispatchNotification: (value: any) => void;
  index: number;
}

const Classroom: React.FC<PropTypes> = ({classroom, dispatchNotification, index}) => {
  const {
    id, name, occupied, instruments, isWing, isOperaStudio, special, schedule, chair,
    isHidden, disabled, queueInfo: {queuePolicy: {policy, queueAllowedDepartments}}
  } = classroom;
  const userFullName = fullName(occupied.user as User, true);
  const dispatchPopupWindow = usePopupWindow();
  const [isOverdue, setIsOverDue] = useState(false);
  // const occupiedOnSchedule = isOccupiedOnSchedule(schedule);
  let timeout = useRef(null);

  const header = (
    <>
      <h1>{`Аудиторія ${name}`}</h1>
      {isWing && <Tag body="Флігель"/>}
      {isOperaStudio && <Tag body="Оперна студія"/>}
    </>
  );

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

  useEffect(() => {
    if (classroom.occupied.state === OccupiedState.RESERVED) {
      const untilString: string = classroom.occupied.until as unknown as string;
      const diffInMs = moment(untilString).diff(moment());

      if (diffInMs >= 0 && !timeout.current) {
        timeout.current = setTimeout(() => setIsOverDue(true), diffInMs);
      } else if (diffInMs <= 0) {
        setIsOverDue(true);
      } else {
        setIsOverDue(false);
      }
    } else {
      setIsOverDue(false);
    }
    if (occupied.state !== OccupiedState.RESERVED && timeout.current) clearTimeout(timeout.current);
    defineStyle();
    defineStatus();
    defineStatusStiles();
  }, [classroom]);

  const defineStyle = () => {
    const occupiedStyle = {
      background: "#fff",
      transition: "all .3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      border: isOverdue ? '4px solid red' : 'none'
    };
    const vacantStyle = {
      background: "#76e286",
      transition: "all .3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    };
    const disableStyle = {
      background: "#b1b1b1",
      transition: "all .3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      border: isOverdue ? '4px solid red' : 'none'
    };

    if (disabled?.state === DisabledState.DISABLED
      || (classroom.queueInfo.queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS
        && !classroom.queueInfo.queuePolicy.queueAllowedDepartments.length)) return disableStyle;
    if (isClassroomNotFree(occupied)) return occupiedStyle;
    return vacantStyle;
  };

  const defineStatusStiles = () => {
    if (isOverdue) return styles.overdue;
    if (!isOverdue && occupied.state === OccupiedState.RESERVED) return styles.reserved;
    else return ''
  };

  const defineStatus = () => {
    if (classroom.queueInfo.queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS
      && !classroom.queueInfo.queuePolicy.queueAllowedDepartments.length) {
      return 'Обмежений доступ';
    }
    if (isOverdue) return 'Резервація прострочена!';
    if (disabled?.state === DisabledState.DISABLED) {
      return disabled?.comment + ' до ' + moment(disabled.until).format('DD-MM-YYYY HH:mm');
    }
    if (isClassroomNotFree(occupied)) return OccupiedStateUa[occupied?.state as OccupiedState];
    return "Вільно";
  }

  const handleClick = () => {
    dispatchPopupWindow({
      header: header,
      //@ts-ignore
      body: <ClassroomInfo
        classroom={classroom}
        dispatchNotification={dispatchNotification}
        dispatchPopupWindow={dispatchPopupWindow}
      />,
      footer: <Footer
        classroomName={name}
        classroomId={id}
        disabled={disabled}
        occupied={occupied}
        dispatchNotification={dispatchNotification}
        dispatchPopupWindow={dispatchPopupWindow}
        isOverdue={isOverdue}
      />,
    });
  };

  return (
    <>
      <li
        key={id}
        className={styles.classroomsListItem}
        style={{...defineStyle(), opacity: isHidden ? .5 : 1}}
        onClick={handleClick}
        tabIndex={index}
      >
        <div className={styles.header}>
          {special === 'PIANO' && <img className={styles.special} src={specialPiano} alt="Special Piano"/>}
          <h1 className={(policy === QueuePolicyTypes.SELECTED_DEPARTMENTS &&
            queueAllowedDepartments.length) ? styles.isDepartment : ''}>{name}</h1>
          {isClassroomNotFree(occupied) && (
            <div className={styles.occupantInfo}>
              <p className={styles.occupantName} title={userFullName}>{userFullName}</p>
              <p style={typeStyle(occupied as OccupiedInfo)} className={styles.occupantType}>
                {UserTypesUa[occupied.user?.type as UserTypes]}
              </p>
            </div>
          )}
        </div>
        <div className={styles.occupationInfo}>
          <p className={defineStatusStiles()}
          >
            {defineStatus()}
          </p>
        </div>
        <Instruments instruments={instruments}/>
      </li>
    </>
  );
};

export default Classroom;