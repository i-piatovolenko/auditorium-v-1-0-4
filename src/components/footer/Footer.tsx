import React from "react";
import Button from "../button/Button";
import styles from "../classroom/classroom.module.css";
import { gridUpdate } from "../../api/client";
import { useMutation } from "@apollo/client";
import { FREE_CLASSROOM } from "../../api/operations/mutations/freeClassroom";
import { OccupiedInfo } from "../../models/models";

interface PropTypes {
  classroomName: string;
  occupied: OccupiedInfo | null;
  dispatchNotification: (value: any) => void;
  setIsPassed: (value: boolean) => void;
  isPassed: boolean;
  disableOccupyButton: boolean;
}

const   Footer: React.FC<PropTypes> = ({classroomName, occupied, dispatchNotification,
  setIsPassed, isPassed, disableOccupyButton, ...props
}) => {
  const [freeClassroom] = useMutation(FREE_CLASSROOM, {
    variables: {
      input: {
        classroomName: String(classroomName),
      },
    },
  });

  const handleFreeClassroom = () => {

    freeClassroom().then(() => {
      dispatchNotification({
        header: "Успішно!",
        message: `Аудиторія ${classroomName} звільнена.`,
        type: "ok",
      });
      // @ts-ignore
      props.dispatch({
        type: "POP_POPUP_WINDOW",
      });
      gridUpdate(!gridUpdate());
    });
  };

  const handlePassClassroom = () => {
    setIsPassed(true);
    console.log(isPassed)
  };

  return (
    <div className={styles.footer}>
      {occupied || (occupied && isPassed) ? (
        <>
          <Button color="orange" onClick={handlePassClassroom}>Передати аудиторію</Button>
          <Button color="red" onClick={handleFreeClassroom}>
            Звільнити аудиторію
          </Button>
        </>
      ) : (
        <Button type="submit" form="userSearchForm" disabled={disableOccupyButton}>
          Записати в аудиторію
        </Button>
      )}
    </div>
  );
};

export default Footer;
