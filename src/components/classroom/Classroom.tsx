import React from "react";
import styles from "./classroom.module.css";
import {
  ACCESS_RIGHTS,
  ClassroomType,
  OccupiedInfo,
  OccupiedState,
  OccupiedStateUa,
  UserTypes,
  UserTypesUa,
} from "../../models/models";
import {fullName, isOccupiedOnSchedule, typeStyle} from "../../helpers/helpers";
import Instruments from "../instruments/Instruments";
import {usePopupWindow} from "../popupWindow/PopupWindowProvider";
import ClassroomInfo from "../ classroomInfo/ClassroomInfo";
import Tag from "../tag/Tag";
import Footer from "../footer/Footer";
import specialPiano from "../../assets/images/specialPiano.svg";
import {useLocal} from "../../hooks/useLocal";

interface PropTypes {
  classroom: ClassroomType;
  dispatchNotification: (value: any) => void;
}

const Classroom: React.FC<PropTypes> = ({classroom, dispatchNotification}) => {
  const { id, name, occupied, instruments, isWing, isOperaStudio, special, schedule, chair,
  hidden } = classroom;
  const userFullName = occupied?.user.nameTemp === null ? fullName(occupied?.user, true) :
    occupied?.user.nameTemp;
  const dispatchPopupWindow = usePopupWindow();
  const { data: {accessRights}} = useLocal('accessRights');
  const occupiedOnSchedule = isOccupiedOnSchedule(schedule);
  const occupiedStyle = {
    background: "#fff",
    transition: "all .3s cubic-bezier(0.25, 0.8, 0.25, 1)"
  };
  const vacantStyle = {
    background: "#4bfd63",
    transition: "all .3s cubic-bezier(0.25, 0.8, 0.25, 1)"
  };
  const occupationInfo = occupied ? OccupiedStateUa[occupied?.state as OccupiedState]
    : occupiedOnSchedule ? "Зайнято за розкдадом" : "Вільно";
  const header = (
    <>
      <h1>{`Аудиторія ${name}`}</h1>
      {isWing && <Tag body="Флігель"/>}
      {isOperaStudio && <Tag body="Оперна студія"/>}
    </>
  );

  const handleClick = () => {
    dispatchPopupWindow({
      header: header,
      //@ts-ignore
      body: <ClassroomInfo
        classroom={classroom}
        dispatchNotification={dispatchNotification}
      />,
      footer: accessRights >= ACCESS_RIGHTS.DISPATCHER && <Footer
      classroomName={name}
      occupied={occupied}
      dispatchNotification={dispatchNotification}
    />,
    });
  };

  return (
    <>
      <li
        key={id}
        className={styles.classroomsListItem}
        style={{...(occupied ? occupiedStyle : vacantStyle), opacity: hidden ? .5 : 1}}
        onClick={handleClick}
      >
        <div className={styles.header}>
          {special === 'PIANO' && <img className={styles.special} src={specialPiano} alt="Special Piano"/>}
          <h1 className={chair ? styles.isDepartment : ''}>{name}</h1>
          <div className={styles.occupantInfo}>
            <p className={styles.occupantName} title={userFullName}>{userFullName}</p>
            <p
              style={typeStyle(occupied as OccupiedInfo)}
              className={styles.occupantType}
            >
              {UserTypesUa[occupied?.user.type as UserTypes]}
            </p>
          </div>
        </div>
        <div className={styles.occupationInfo}>
          <p className={occupied?.state === OccupiedState.RESERVED ? styles.reserved : ''}>
            {occupationInfo}
          </p>
        </div>
        <Instruments instruments={instruments}/>
      </li>
    </>
  );
};

export default Classroom;