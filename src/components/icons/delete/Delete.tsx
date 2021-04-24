import React from 'react';
import deleteIcon from "../../../assets/images/delete.svg";
import styles from "./delete.module.css";

interface PropTypes {
  onClick?: (value?: any) => void;
}

const Delete: React.FC<PropTypes> = ({onClick}) => {

  return (
    <img src={deleteIcon} className={styles.deleteIcon} onClick={(e) => {
      e.stopPropagation();
      onClick && onClick();
    }}/>
  );
}

export default Delete;