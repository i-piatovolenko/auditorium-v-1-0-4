import React, {useEffect, useState} from "react";
import Button from "../button/Button";
import styles from "../classroom/classroom.module.css";
import {isPassedVar} from "../../api/client";
import {gql, useQuery} from "@apollo/client";
import {DisabledInfo, DisabledState, OccupiedInfo, OccupiedState, UserTypes} from "../../models/models";
import {isClassroomNotFree, isStudent, isTimeout} from "../../helpers/helpers";
import {useClassroomActions} from "../../helpers/useClassroomActions";

interface PropTypes {
  classroomName: string;
  occupied: OccupiedInfo;
  disabled?: DisabledInfo;
  dispatchNotification: (value: any) => void;
  dispatchPopupWindow?: (value: any) => void;
  classroomId?: number;
  isOverdue?: boolean;
}

const Footer: React.FC<PropTypes> = (
    {
      classroomName, occupied, dispatchNotification,
      dispatchPopupWindow, disabled: disabledClassroom,
      classroomId, isOverdue, ...props
    }
  ) => {
    const {
      confirmGiveOutKey,
      confirmFree,
      enable,
      confirmDisable
    } = useClassroomActions(classroomName, dispatchNotification, dispatchPopupWindow, (props as any).dispatch);
    const [confirmSanctions, setConfirmSanction] = useState(false);
    const [isOccupiedOverdue, setIsOccupiedOverdue] = useState(false);
    const occupiedUser = occupied.state === OccupiedState.RESERVED ? occupied.user : occupied.keyHolder
      ? occupied.keyHolder : occupied.user;
    const {data: {isButtonDisabled: disabled}} = useQuery(gql`
    query isButtonDisabled {
      isButtonDisabled @client
    }
  `);
    const {data: {isPassed}} = useQuery(gql`
    query isPassed {
      isPassed @client
    }
  `);

    useEffect(() => {
      const isOverdueByStudent = occupied.state === OccupiedState.OCCUPIED &&
        isStudent(occupiedUser.type as UserTypes) && isTimeout(occupied.until);
      setIsOccupiedOverdue(isOverdueByStudent as boolean);
    }, [occupied.state, occupiedUser, occupied.until]);

    const handlePassClassroom = () => {
      isPassedVar(true);
    };

    const DisabledButton = () => disabledClassroom?.state === DisabledState.DISABLED ? (
      <Button
        color="red"
        onClick={enable}
      >
        Розблокувати
      </Button>
    ) : (
      <Button
        color="red"
        onClick={confirmDisable}
      >
        Заблокувати
      </Button>
    );

    return (
      <div className={styles.footer}>
        {/*{(isOverdue || isOccupiedOverdue) && <span className={styles.sanctions}>*/}
        {/*        <label>З застосуванням санкцій</label>*/}
        {/*        <input type='checkbox' checked={confirmSanctions}*/}
        {/*               onChange={e => setConfirmSanction(e.target.checked)}*/}
        {/*        />*/}
        {/*    </span>}*/}
        {isClassroomNotFree(occupied) && !isPassed ? (
          <>
            <DisabledButton/>
            <div>
              <Button onClick={handlePassClassroom}>
                Передати
              </Button>
              {!((occupied.state === OccupiedState.RESERVED || occupied.state === OccupiedState.PENDING)
                && occupied.keyHolder) && (
                <Button onClick={confirmFree} disabled={disabled} color='red'>
                  Звільнити {confirmSanctions ? '(з санкціями)' : ''}
                </Button>
              )}
              {occupied.state === OccupiedState.RESERVED && !(occupied.keyHolder) && (
                <Button
                  onClick={() => confirmGiveOutKey(occupiedUser)}
                  disabled={disabled}
                  style={{padding: '0 40px', height: '2.5rem'}}
                >
                  Видати ключ
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <DisabledButton/>
            <Button type="submit" form="userSearchForm" disabled={disabled}>
              Записати {confirmSanctions ? '(з санкціями для попереднього користувача)' : ''}
            </Button>
          </>
        )}
      </div>
    );
  }
;

export default Footer;
