import React from 'react';
import styles from './dispatcherSettings.module.css';

type PropTypes = {
  title: string
}

const SectionTitle: React.FC<PropTypes> = ({title}) => {
  return (
    <div className={styles.sectionTitle}>
      {title}
    </div>
  );
}

export default SectionTitle;