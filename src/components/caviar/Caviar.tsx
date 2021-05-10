import React from "react";
import styles from "./caviar.module.css";
import { ClassroomType } from "../../models/models";
import { usePopupWindow } from "../popupWindow/PopupWindowProvider";
import ClassroomInfo from "../ classroomInfo/ClassroomInfo";
import Tag from "../tag/Tag";
import Footer from "../footer/Footer";

interface PropTypes {
  classrooms: Array<ClassroomType>;
  dispatchNotification: (value: string) => void;
}

const Caviar: React.FC<PropTypes> = ({ classrooms, dispatchNotification }) => {
  const dispatchPopupWindow = usePopupWindow();
  const occupiedStyle = {
    background: "#fff",
  };
  const vacantStyle = {
    background: "#4bfd63",
  };

  function handleClick(classroom: ClassroomType) {
    const {name, occupied} = classroom;
    dispatchPopupWindow({
      header: (
        <>
          <h1>{`Аудиторія ${classroom.name}`}</h1>
          {classroom.isWing && <Tag body="Флігель" />}
          {classroom.isOperaStudio && <Tag body="Оперна студія" />}
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
          style={classroom.occupied ? occupiedStyle : vacantStyle}
        >
          {classroom.name}
        </li>
      ))}
    </ul>
  );
};

export default Caviar;
