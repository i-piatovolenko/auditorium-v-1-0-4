import React from 'react';
import backIcon from "../../../assets/images/back.png";
import styles from "./back.module.css";
import {useHistory} from "react-router-dom";

interface PropTypes {
  onClick?: (value?: any) => void;
}

const Back: React.FC<PropTypes> = ({onClick: onClickProps}) => {
  const history = useHistory();

  const onClick = () => {
    history.goBack();
  };

  return <img src={backIcon} className={styles.backIcon} onClick={onClickProps || onClick}/>;
}

export default Back;
