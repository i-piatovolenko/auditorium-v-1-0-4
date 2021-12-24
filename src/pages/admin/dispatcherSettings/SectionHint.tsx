import React from 'react';
import styles from './dispatcherSettings.module.css';

type PropTypes = {
  text: string
}

const SectionTitle: React.FC<PropTypes> = ({text}) => {
  return (
    <div className={styles.hintText}>
      {text}
    </div>
  );
}

export default SectionTitle;