import React from "react";
import styles from "./classroom.module.css";
import {
  ClassroomType,
  OccupiedInfo,
  userTypes,
  userTypesUa,
} from "../../models/models";
import { fullName, typeStyle } from "../../helpers/helpers";
import Instruments from "../instruments/Instruments";
import { usePopupWindow } from "../popupWindow/PopupWindowProvider";
import ClassroomInfo from "../ classroomInfo/ClassroomInfo";
import Tag from "../tag/Tag";
import Button from "../button/Button";

interface PropTypes {
  classroom: ClassroomType;
  dispatchNotification: (value: string) => void;
}

const Classroom: React.FC<PropTypes> = ({
  classroom,
  dispatchNotification,
}) => {
  const { id, name, occupied, instruments, isWing, isOperaStudio } = classroom;
  const occupiedStyle = {
    background: "#fff",
  };
  const vacantStyle = {
    background: "#4bfd63",
  };
  const occupationInfo = occupied ? "Зайнято" : "Вільно";
  const header = (
    <>
      <h1>{`Аудиторія ${name}`}</h1>
      {isWing && <Tag body="Флігель" />}
      {isOperaStudio && <Tag body="Оперна студія" />}
    </>
  );
  const dispatchPopupWindow = usePopupWindow();

  const onClick = () => {
    dispatchPopupWindow({
      header: header,
      body: (
        <ClassroomInfo
          classroom={classroom}
          dispatchNotification={dispatchNotification}
        />
      ),
      footer: (
        <div>
          <Button type="submit" form="userSearchForm">
            Записати в аудиторію
          </Button>
        </div>
      ),
    });
  };

  return (
    <>
      <li
        key={id}
        className={styles.classroomsListItem}
        style={occupied ? occupiedStyle : vacantStyle}
        onClick={onClick}
      >
        <div className={styles.header}>
          <h1>{name}</h1>
          <div className={styles.occupantInfo}>
            <p className={styles.occupantName}>
              {fullName(occupied?.user, true)}
            </p>
            <p
              style={typeStyle(occupied as OccupiedInfo)}
              className={styles.occupantType}
            >
              {userTypesUa[occupied?.user.type as userTypes]}
            </p>
          </div>
        </div>
        <div className={styles.occupationInfo}>
          <p>{occupationInfo}</p>
        </div>
        <Instruments instruments={instruments} />
      </li>
    </>
  );
};

export default Classroom;
