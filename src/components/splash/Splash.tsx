import React, {FC} from 'react';
import styles from './splash.module.css';
import logo from '../../assets/images/au_logo.png';

type PropTypes = {
  show: boolean;
  currentTime: string;
};

const Splash: FC<PropTypes> = ({show, currentTime}) => {
  return show && (
    <div className={styles.wrapper}>
      <img src={logo} alt="logo" className={styles.logo}/>
      <h2>{currentTime}</h2>
    </div>
  );
};

export default Splash;
