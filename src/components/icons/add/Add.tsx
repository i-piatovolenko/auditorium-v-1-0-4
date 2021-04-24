import React from 'react';
import addIcon from "../../../assets/images/add.svg";
import styles from "./add.module.css";

interface PropTypes {
  onClick: (value?: any) => void;
}

const Add: React.FC<PropTypes> = ({onClick}) => {

  return (
    <img src={addIcon} className={styles.addIcon} onClick={onClick}/>
  );
}

export default Add;