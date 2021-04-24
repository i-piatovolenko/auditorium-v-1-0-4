import React from 'react';
import {useHistory} from "react-router-dom";
import editIcon from "../../../assets/images/edit.svg";
import styles from "./edit.module.css";

interface PropTypes {
  path?: string;
  onClick?: (value?: any) => void;
  dark?: boolean;
}

const Edit: React.FC<PropTypes> = ({
   path,
   onClick,
   dark = false
}) => {
  const history = useHistory();

  return (
    <img
      src={editIcon}
      className={[styles.editIcon, dark ? styles.dark : styles.light].join(' ')}
      onClick={path ? (e) => {
        e.stopPropagation();
        history.push(path)
      } : (e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    />
  );
}

export default Edit;