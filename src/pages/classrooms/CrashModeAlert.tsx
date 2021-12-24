import React from 'react';
import styles from "./classrooms.module.css";
import Button from "../../components/button/Button";
import {useHistory} from "react-router-dom";

type PropTypes = {
  comment: string;
  until: string
}

const CrashModeAlert: React.FC<PropTypes> = ({comment, until}) =>  {
  const history = useHistory();
  const handleClick = () => {
    history.push('/dispatcherSettings');
  };

  return (
    <div className={styles.crashModeWrapper}>
      <h1>Увага! Працює режим невідповідності даних!</h1>
      <p>До: {until || 'не визначено'}</p>
      <p>Причина: {comment || 'не визначено'}</p>
      <p>
        Внесіть зміни в сітку аудиторій до повної відповідності з реальною ситуацією з аудиторіями в навчальному закладі та вимкніть режим невідповідності в налаштуваннях.
      </p>
      <Button onClick={handleClick}>
        Перейти в налаштування
      </Button>
    </div>
  );
}

export default CrashModeAlert;