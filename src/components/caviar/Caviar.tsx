import React from "react";
import styles from "./caviar.module.css";
import {ClassroomType} from "../../models/models";
import CaviarItem from "./CaviarItem";

interface PropTypes {
  classrooms: Array<ClassroomType>;
  dispatchNotification: (value: string) => void;
}

const Caviar: React.FC<PropTypes> = ({classrooms, dispatchNotification}) => {

  return (
    <ul className={styles.caviar}>
      {classrooms.map((classroom) => (
        <CaviarItem classroom={classroom} dispatchNotification={dispatchNotification} />
      ))}
    </ul>
  );
};

export default Caviar;
