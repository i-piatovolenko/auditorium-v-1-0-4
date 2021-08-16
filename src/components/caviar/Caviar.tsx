import React, {CSSProperties} from "react";
import styles from "./caviar.module.css";
import {ClassroomType, DisabledState, OccupiedState} from "../../models/models";
import {usePopupWindow} from "../popupWindow/PopupWindowProvider";
import ClassroomInfo from "../ classroomInfo/ClassroomInfo";
import Tag from "../tag/Tag";
import Footer from "../footer/Footer";

interface PropTypes {
  classrooms: Array<ClassroomType>;
  dispatchNotification: (value: string) => void;
}

const Caviar: React.FC<PropTypes> = ({classrooms, dispatchNotification}) => {
  const dispatchPopupWindow = usePopupWindow();

  const calcStyle = (classroom: ClassroomType) => {
    const resStyles: CSSProperties = {};

    if (classroom.isHidden) resStyles.opacity = .5;
    if (classroom.disabled.state === DisabledState.DISABLED) {
      resStyles.background = '#b1b1b1';
    } else {
      classroom.occupied.state === OccupiedState.FREE ?
        resStyles.background = '#4bfd63' : resStyles.background = '#fff'
    }
    return resStyles
  };

  function handleClick(classroom: ClassroomType) {
    const {name, occupied} = classroom;
    dispatchPopupWindow({
      header: (
        <>
          <h1>{`Аудиторія ${classroom.name}`}</h1>
          {classroom.isWing && <Tag body="Флігель"/>}
          {classroom.isOperaStudio && <Tag body="Оперна студія"/>}
        </>
      ),
      body: (
        //@ts-ignore
        <ClassroomInfo
          dispatchNotification={dispatchNotification}
          classroom={classroom}
        />
      ),
      footer: <Footer
        classroomName={name}
        occupied={occupied}
        dispatchNotification={dispatchNotification}
      />,
    });
  }

  return (
    <ul className={styles.caviar}>
      {classrooms.map((classroom) => (
        <li
          onClick={() => handleClick(classroom)}
          style={calcStyle(classroom)}
        >
          {classroom.name}
        </li>
      ))}
    </ul>
  );
};

export default Caviar;
