import React from 'react';
import SectionTitle from "./SectionTitle";
import SectionHint from "./SectionHint";
import styles from "./dispatcherSettings.module.css";

type PropTypes = {
  title: string;
  hintText?: string;
}

const DispatcherSettingsSection: React.FC<PropTypes> = ({title, hintText, children}) => {
  return (
    <div>
      <SectionTitle title={title}/>
      <SectionHint text={hintText}/>
      <div className={styles.sectionWrapper}>
        {children}
      </div>
    </div>
  );
}

export default DispatcherSettingsSection;