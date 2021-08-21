import React, {useState} from "react";
import Button from "../button/Button";
import styles from "../classroom/classroom.module.css";
import {client, isButtonDisabledVar, isPassedVar} from "../../api/client";
import {gql, useMutation, useQuery} from "@apollo/client";
import {FREE_CLASSROOM} from "../../api/operations/mutations/freeClassroom";
import {DisabledInfo, DisabledState, OccupiedInfo, OccupiedState} from "../../models/models";
import spinner from './../../assets/images/spinner.svg';
import DisableClassroom from "../DisableClassroom";
import {DISABLE_CLASSROOM} from "../../api/operations/mutations/disableClassroom";
import {ENABLE_CLASSROOM} from "../../api/operations/mutations/enableClassroom";
import {fullName, isClassroomNotFree} from "../../helpers/helpers";
import ConfirmFooter from "./ConfirmFooter";
import moment from "moment";

interface PropTypes {
  classroomName: string;
  occupied: OccupiedInfo;
  disabled?: DisabledInfo;
  dispatchNotification: (value: any) => void;
  dispatchPopupWindow?: (value: any) => void;
  classroomId?: number;
  isOverdue?: boolean;
}

const Footer: React.FC<PropTypes> = ({
                                       classroomName, occupied, dispatchNotification,
                                       dispatchPopupWindow,
                                       disabled: disabledClassroom,
                                       classroomId, isOverdue, ...props
                                     }) => {
    const [confirmSanctions, setConfirmSanction] = useState(false);
    const [freeClassroom] = useMutation(FREE_CLASSROOM, {
      variables: {
        input: {
          classroomName: String(classroomName),
          applySanction: isOverdue ? confirmSanctions : false
        },
      },
    });
    const [enableClassroom] = useMutation(ENABLE_CLASSROOM, {
      variables: {
        input: {
          classroomName: String(classroomName)
        }
      }
    });
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

    const handleFreeClassroom = () => {
      isButtonDisabledVar(true);
      try {
        freeClassroom().then(() => {
          dispatchNotification({
            header: "Успішно!",
            message: `Аудиторія ${classroomName} звільнена.`,
            type: "ok",
          });
          isButtonDisabledVar(false);
          // @ts-ignore
          props.dispatch({
            type: "POP_POPUP_WINDOW",
          });
        });
      } catch (e: any) {
        dispatchNotification({
          header: "Помилка!",
          message: e.message,
          type: "alert",
        });
        isButtonDisabledVar(false);
      }
    };

    const handlePassClassroom = () => {
      isPassedVar(true);
    };

    const submitDisable = async (comment: string, until: string) => {
      if (comment && until) {
        try {
          await client.mutate({
            mutation: DISABLE_CLASSROOM,
            variables: {
              input: {
                classroomName: String(classroomName),
                comment,
                until: moment(until).toISOString()
              }
            },
          });
          dispatchNotification({
            header: "Успішно!",
            message: `Аудиторія ${classroomName} заблокована.`,
            type: "ok",
          });
          //@ts-ignore
          props.dispatch({
            type: "POP_POPUP_WINDOW",
          });
          //@ts-ignore
          props.dispatch({
            type: "POP_POPUP_WINDOW",
          });
        } catch (e) {
          dispatchNotification({
            header: "Помилка!",
            message: e.message,
            type: "alert",
          });
        }
      } else {
        dispatchNotification({
          header: "Помилка!",
          message: "Заповніть всі поля.",
          type: "alert",
        });
      }
    };

    const handleDisableClassroom = () => {
      dispatchPopupWindow && dispatchPopupWindow({
        header: <h1>Заблокувати аудиторію</h1>,
        body: (
          <DisableClassroom onSubmit={submitDisable}/>
        ),
        footer: (
          <>
            <input form='disableClassroomForm' type='submit' value='Заблокувати'/>
          </>
        )
      });
    };

    const handleEnableClassroom = async () => {
      try {
        await enableClassroom();
        dispatchNotification({
          header: "Успішно!",
          message: `Аудиторія ${classroomName} разблокована.`,
          type: "ok",
        });
        //@ts-ignore
        props.dispatch({
          type: "POP_POPUP_WINDOW",
        });
      } catch (e) {
        dispatchNotification({
          header: "Помилка!",
          message: e.message,
          type: "alert",
        });
      }
    }

    const confirmGiveOutKey = () => {
      dispatchPopupWindow({
        header: <h1>Увага!</h1>,
        body: <span>{`Підтвердіть видачу ключа для ${fullName(occupied.user, true)}`}</span>,
        footer: <ConfirmFooter onOk={handleGiveOutKey}/>,
        isConfirm: true
      });
    }

    const confirmFreeClassroom = () => {
      dispatchPopupWindow({
        header: <h1>Увага!</h1>,
        body: <span>Підтвердіть звільнення аудиторії</span>,
        footer: <ConfirmFooter onOk={handleFreeClassroom}/>,
        isConfirm: true
      });
    }

    const handleGiveOutKey = async () => {
      isButtonDisabledVar(true);
      try {
        //TODO give out key mutation (RESERVED to OCCUPIED state changing)
        dispatchNotification({
          header: "Операція успішна!",
          message: "Ключ видано",
          type: "ok",
        });
        //@ts-ignore
        props.dispatch({
          type: "POP_POPUP_WINDOW",
        });
        isButtonDisabledVar(false);
      } catch (e) {
        dispatchNotification({
          header: "Помилка!",
          message: e.message,
          type: "alert",
        });
        isButtonDisabledVar(false);
      }
    }

    const DisabledButton = () => disabledClassroom?.state === DisabledState.DISABLED ? (
      <span className={styles.disableButton}>
              <Button color="red" onClick={handleEnableClassroom}>Разблокувати</Button>
            </span>
    ) : (
      <span className={styles.disableButton}>
              <Button color="red" onClick={handleDisableClassroom}>Заблокувати</Button>
            </span>
    );

    return (
      <div className={styles.footer}>
        {isOverdue && <span className={styles.sanctions}>
                <label>З застосуванням санкцій</label>
                <input type='checkbox' checked={confirmSanctions}
                       onChange={e => setConfirmSanction(e.target.checked)}
                />
            </span>}
        {isClassroomNotFree(occupied) && !isPassed ? (
          <>
            <DisabledButton/>
            <Button onClick={handlePassClassroom}>
              Передати {confirmSanctions ? '(з санкціями)' : ''}
            </Button>
            {disabled && <img className={styles.spinner} src={spinner} alt="wait"/>}
            <Button onClick={confirmFreeClassroom} disabled={disabled}>
              Звільнити {confirmSanctions ? '(з санкціями)' : ''}
            </Button>
            {occupied.state === OccupiedState.RESERVED && (
              <>
                {disabled && <img className={styles.spinner} src={spinner} alt="wait"/>}
                <Button onClick={confirmGiveOutKey} disabled={disabled}>
                  Видати ключ
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <DisabledButton/>
            {disabled && <img className={styles.spinner} src={spinner} alt="wait"/>}
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
