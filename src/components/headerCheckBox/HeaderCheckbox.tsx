import React from 'react';
import styles from './headerCheckbox.module.css';

const HeaderCheckbox = ({label, checked, setChecked}: any) => {

  return <div className={styles.wrapper}>
    <label className={styles.container}>{label}
      <input type="checkbox" value={checked} onChange={setChecked}/>
      <span className={styles.checkmark}></span>
    </label>
  </div>
}

export default HeaderCheckbox;