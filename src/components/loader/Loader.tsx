import React from 'react';
import styles from './loader.module.css';
import loader from './../../assets/images/loader.svg';

const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <img className={styles.loader} src={loader} alt="Loading..."/>
      <p>Завантаження...</p>
    </div>
  );
}

export default Loader;