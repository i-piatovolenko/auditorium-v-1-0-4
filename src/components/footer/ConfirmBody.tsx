import React, {useEffect} from "react";
import Button from "../button/Button";
import styles from "../classroom/classroom.module.css";
import {disableClassroomBeforeFreeVar, disabledTimeVar} from "../../api/client";
import {useLocal} from "../../hooks/useLocal";

const ConfirmBody = () => {
    const {data: {disabledTime}} = useLocal('disabledTime');
    const {data: {disableClassroomBeforeFree}} = useLocal('disableClassroomBeforeFree');

    return (
      <div>
        <p className={styles.confirmText}>Підтвердіть звільнення аудиторії</p>
        <div onClick={() => disableClassroomBeforeFreeVar(!disableClassroomBeforeFree)}>
          <input type="checkbox" checked={disableClassroomBeforeFree}
                 onChange={() => disableClassroomBeforeFreeVar(!disableClassroomBeforeFree)}/>
          Заблокувати аудиторію {disableClassroomBeforeFree && (
            <span>на {disabledTime} хв.</span>
        )}
        </div>
        {disableClassroomBeforeFree && (
          <div className={styles.disableOptions}>
            <button onClick={() => disabledTimeVar(15)}
                    className={disabledTime === 15 ? styles.timeButtonActive : styles.timeButton}>
              15 хв.
            </button>
            <button onClick={() => disabledTimeVar(30)}
                    className={disabledTime === 30 ? styles.timeButtonActive : styles.timeButton}>
              30 хв.
            </button>
            <button onClick={() => disabledTimeVar(45)}
                    className={disabledTime === 45 ? styles.timeButtonActive : styles.timeButton}>
              45 хв.
            </button>
            <button onClick={() => disabledTimeVar(60)}
                    className={disabledTime === 60 ? styles.timeButtonActive : styles.timeButton}>
              1 год.
            </button>
            <button onClick={() => disabledTimeVar(90)}
                    className={disabledTime === 90 ? styles.timeButtonActive : styles.timeButton}>
              1 год. 30 хв.
            </button>
            <button onClick={() => disabledTimeVar(120)}
                    className={disabledTime === 120 ? styles.timeButtonActive : styles.timeButton}>
              2 год.
            </button>
            <div className={[15, 30, 45, 60, 90, 120].includes(disabledTime) ? styles.customTimeInput :
              styles.customTimeInputActive}>
              <input type="number" value={disabledTime} min={5} max={180} step={5}
                     onChange={(e) => {
                       disabledTimeVar(parseInt(e.target.value));
                     }}/>
              <span>хв.</span>
            </div>
          </div>
        )}
      </div>
    );
  }
;

export default ConfirmBody;
