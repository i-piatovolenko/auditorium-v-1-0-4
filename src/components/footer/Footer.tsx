import React from "react";
import Button from "../button/Button";
import styles from "../classroom/classroom.module.css";
import {gridUpdate, isButtonDisabled} from "../../api/client";
import {gql, useMutation, useQuery} from "@apollo/client";
import { FREE_CLASSROOM } from "../../api/operations/mutations/freeClassroom";
import { OccupiedInfo } from "../../models/models";
import spinner from './../../assets/images/spinner.svg';

interface PropTypes {
  classroomName: string;
  occupied: OccupiedInfo | null;
  dispatchNotification: (value: any) => void;
  setIsPassed: (value: boolean) => void;
  isPassed: boolean;
}

const   Footer: React.FC<PropTypes> = ({classroomName, occupied, dispatchNotification,
  setIsPassed, isPassed, ...props
}) => {
  const [freeClassroom] = useMutation(FREE_CLASSROOM, {
    variables: {
      input: {
        classroomName: String(classroomName),
      },
    },
  });
  const { data: {isButtonDisabled: disabled} } = useQuery(gql`
    query isButtonDisabled {
      isButtonDisabled @client
    }
  `);

  const handleFreeClassroom = () => {
    isButtonDisabled(true);
    try {
      freeClassroom().then(() => {
        dispatchNotification({
          header: "Успішно!",
          message: `Аудиторія ${classroomName} звільнена.`,
          type: "ok",
        });
        isButtonDisabled(false);
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
      isButtonDisabled(false);
    }
  };

  const handlePassClassroom = () => {
    setIsPassed(true);
  };

  return (
    <div className={styles.footer}>
      {occupied || (occupied && isPassed) ? (
        <>
          <Button color="orange" onClick={handlePassClassroom}>Передати аудиторію</Button>
          {disabled && <img className={styles.spinner}src={spinner} alt="wait"/>}
          <Button color="red" onClick={handleFreeClassroom} disabled={disabled}>
            Звільнити аудиторію
          </Button>
        </>
      ) : (
        <>
          {disabled && <img className={styles.spinner}src={spinner} alt="wait"/>}
          <Button type="submit" form="userSearchForm" disabled={disabled}>
            Записати в аудиторію
          </Button>
        </>
      )}
    </div>
  );
};

export default Footer;
