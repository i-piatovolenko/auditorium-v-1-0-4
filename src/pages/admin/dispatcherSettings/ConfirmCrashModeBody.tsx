import React, {useState} from 'react';
import Button from "../../../components/button/Button";
import moment from "moment";
import styles from "./dispatcherSettings.module.css"

type PropTypes = {
  handleCrashModeOn: (until: string, comment: string, dispatch: any) => void;
  dispatch?: any;
};

const ConfirmCrashModeBody: React.FC<PropTypes> = ({handleCrashModeOn, dispatch}) => {
  const [until, setUntil] = useState('');
  const [comment, setComment] = useState('');

  const handleOn = () => {
    handleCrashModeOn(until, comment, dispatch);
  }

  return (
    <>
      <p>Ви дійсно бажаєте увімкнути режим невідповідності даних?</p>
      <div className={styles.inputWrapper}>
        <p>До:</p>
        <input
          type="datetime-local"
          min={moment().format('YYYY-MM-DDTHH:mm')}
          value={until}
          onChange={(e) => setUntil(e.target.value)}
        />
      </div>
      <div className={styles.inputWrapper}>
        <p>Причина: *</p>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className={styles.buttonWrapper}>
        <Button disabled={!comment} onClick={handleOn}>Підтвердити</Button>
      </div>
    </>
  )
}

export default ConfirmCrashModeBody;