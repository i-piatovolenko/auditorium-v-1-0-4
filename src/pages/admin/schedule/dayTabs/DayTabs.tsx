import React, {FC} from 'react';
import styles from './dayTabs.module.css';
import moment from "moment";

type PropTypes = {
  chosenDay: number,
  onChange: (dayIndex: number) => void;
  days: string[];
}

const DayTabs: FC<PropTypes> = ({chosenDay, onChange, days}) => {
  return (
    <ul className={styles.wrapper}>
      {days.map((day, index) => (
        <li
          key={day}
          onClick={() => onChange(index)}
          className={chosenDay === index && styles.selected}
        >
          {day}
        </li>
      ))}
    </ul>
  );
};

export default DayTabs;
