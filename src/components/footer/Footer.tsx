import React from "react";
import Button from "../button/Button";
import styles from "../classroom/classroom.module.css";
import {client, gridUpdate, isButtonDisabledVar, isPassedVar} from "../../api/client";
import {gql, useMutation, useQuery} from "@apollo/client";
import {FREE_CLASSROOM} from "../../api/operations/mutations/freeClassroom";
import {DisabledInfo, OccupiedInfo} from "../../models/models";
import spinner from './../../assets/images/spinner.svg';
import DisableClassroom from "../DisableClassroom";
import {DISABLE_CLASSROOM} from "../../api/operations/mutations/disableClassroom";
import {ENABLE_CLASSROOM} from "../../api/operations/mutations/enableClassroom";

interface PropTypes {
  classroomName: string;
  occupied: OccupiedInfo | null;
  disabled?: DisabledInfo | null;
  dispatchNotification: (value: any) => void;
  dispatchPopupWindow?: (value: any) => void;
  classroomId?: number;
}

const Footer: React.FC<PropTypes> = ({
                                       classroomName, occupied, dispatchNotification,
                                       dispatchPopupWindow,
                                       disabled: disabledClassroom,
                                       classroomId, ...props
                                     }) => {
  const [freeClassroom] = useMutation(FREE_CLASSROOM, {
    variables: {
      input: {
        classroomName: String(classroomName),
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
        gridUpdate(!gridUpdate());
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
              until: until + ':00Z'
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
        <DisableClassroom onSubmit={submitDisable} />
      ),
      footer: (
        <>
          <input form='disableClassroomForm' type='submit' value='Заблокувати' />
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

  const DisabledButton = () => disabledClassroom ? (
    <span className={styles.disableButton}>
              <Button color="red" onClick={handleEnableClassroom}>Разблокувати аудиторію</Button>
            </span>
  ) : (
    <span className={styles.disableButton}>
              <Button color="red" onClick={handleDisableClassroom}>Заблокувати аудиторію</Button>
            </span>
  );

  return (
    <div className={styles.footer}>
      {occupied && !isPassed ? (
        <>
          <DisabledButton/>
          <Button color="orange" onClick={handlePassClassroom}>Передати аудиторію</Button>
          {disabled && <img className={styles.spinner} src={spinner} alt="wait"/>}
          <Button color="red" onClick={handleFreeClassroom} disabled={disabled}>
            Звільнити аудиторію
          </Button>
        </>
      ) : (
        <>
          <DisabledButton/>
          {disabled && <img className={styles.spinner} src={spinner} alt="wait"/>}
          <Button type="submit" form="userSearchForm" disabled={disabled}>
            Записати в аудиторію
          </Button>
        </>
      )}
    </div>
  );
};

export default Footer;
