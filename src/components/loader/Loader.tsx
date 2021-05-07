import React from 'react';
import styles from './loader.module.css';
import loader from './../../assets/images/loader.svg';

const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <img src={loader} alt="Loading..."/>
    </div>
  );
}

export default Loader;