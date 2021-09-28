import React, {useEffect, useState} from "react";
import Button from "../button/Button";
import styles from "../classroom/classroom.module.css";
import {
  client,
  disableClassroomBeforeFreeVar,
  disabledTimeVar,
  isButtonDisabledVar,
  isPassedVar
} from "../../api/client";
import {gql, useMutation, useQuery} from "@apollo/client";
import {FREE_CLASSROOM} from "../../api/operations/mutations/freeClassroom";
import {DisabledInfo, DisabledState, OccupiedInfo, OccupiedState, UserTypes} from "../../models/models";
import DisableClassroom from "../DisableClassroom";
import {DISABLE_CLASSROOM} from "../../api/operations/mutations/disableClassroom";
import {ENABLE_CLASSROOM} from "../../api/operations/mutations/enableClassroom";
import {fullName, isClassroomNotFree, isStudent, isTimeout} from "../../helpers/helpers";
import ConfirmFooter from "./ConfirmFooter";
import moment from "moment";
import {GIVE_OUT_CLASSROOM_KEY} from "../../api/operations/mutations/giveOutClassroomKey";
import ConfirmBody from "./ConfirmBody";
import {useLocal} from "../../hooks/useLocal";

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
    const {data: {disabledTime}} = useLocal('disabledTime');
    const [isOccupiedOverdue, setIsOccupiedOverdue] = useState(false);
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
    const [giveOutKey] = useMutation(GIVE_OUT_CLASSROOM_KEY, {
      variables: {
        input: {
          classroomName
        }
      }
    })
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
        isStudent(occupied.user.type as UserTypes) && isTimeout(occupied.until);
      setIsOccupiedOverdue(isOverdueByStudent as boolean);
    }, [occupied.state, occupied.user, occupied.until]);

    const handleFreeClassroom = async () => {
      try {
        if (disableClassroomBeforeFreeVar()) {
          const result = await client.mutate({
            mutation: DISABLE_CLASSROOM,
            variables: {
              input: {
                classroomName: String(classroomName),
                comment: 'За розкладом',
                until: moment().add(disabledTime, 'minutes').toISOString()
              }
            },
          });
          if (result.data.disableClassroom.userErrors.length) {
            result.data.disableClassroom.userErrors.forEach(({message}: any) => {
              dispatchNotification({
                header: "Помилка",
                message,
                type: "alert",
              });
            })
          } else {
            dispatchNotification({
              header: "Успішно!",
              message: `Аудиторія ${classroomName} заблокована.`,
              type: "ok",
            });
          }
        }
        const result = await freeClassroom();
        if (result.data.freeClassroom.userErrors.length) {
          result.data.freeClassroom.userErrors.forEach(({message}: any) => {
            dispatchNotification({
              header: "Помилка",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "Успішно!",
            message: `Аудиторія ${classroomName} звільнена.`,
            type: "ok",
          });
          isButtonDisabledVar(false);
          disabledTimeVar(15);
          disableClassroomBeforeFreeVar(false);
          // @ts-ignore
          props.dispatch({
            type: "POP_POPUP_WINDOW",
          });
        }
      } catch (e: any) {
        dispatchNotification({
          header: "Помилка!",
          message: e.message,
          type: "alert",
        });
        isButtonDisabledVar(false);
        disabledTimeVar(15);
        disableClassroomBeforeFreeVar(false);
      }
    };

    const handlePassClassroom = () => {
      isPassedVar(true);
    };

    const submitDisable = async (comment: string, until: string) => {
      if (comment && until) {
        try {
          const result = await client.mutate({
            mutation: DISABLE_CLASSROOM,
            variables: {
              input: {
                classroomName: String(classroomName),
                comment,
                until: moment(until).toISOString()
              }
            },
          });
          if (result.data.disableClassroom.userErrors.length) {
            result.data.disableClassroom.userErrors.forEach(({message}: any) => {
              dispatchNotification({
                header: "Помилка",
                message,
                type: "alert",
              });
            })
          } else {
            dispatchNotification({
              header: "Успішно!",
              message: `Аудиторія ${classroomName} заблокована.`,
              type: "ok",
            });
          }
          //@ts-ignore
          props.dispatch({
            type: "POP_POPUP_WINDOW",
          });
          //@ts-ignore
          props.dispatch({
            type: "POP_POPUP_WINDOW",
          });
        } catch (e: any) {
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
            <Button form='disableClassroomForm' type='submit' color='red'>Заблокувати</Button>
          </>
        )
      });
    };

    const handleEnableClassroom = async () => {
      try {
        const result = await enableClassroom();
        if (result.data.enableClassroom.userErrors.length) {
          result.data.enableClassroom.userErrors.forEach(({message}: any) => {
            dispatchNotification({
              header: "Помилка",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "Успішно!",
            message: `Аудиторія ${classroomName} розблокована.`,
            type: "ok",
          });
        }
        //@ts-ignore
        props.dispatch({
          type: "POP_POPUP_WINDOW",
        });
      } catch (e: any) {
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
        body: <ConfirmBody/>,
        footer: <ConfirmFooter onOk={handleFreeClassroom}/>,
        isConfirm: true
      });
    }

    const handleGiveOutKey = async () => {
      isButtonDisabledVar(true);
      try {
        const result = await giveOutKey();
        if (result.data.giveOutClassroomKey.userErrors.length) {
          result.data.giveOutClassroomKey.userErrors.forEach(({message}: any) => {
            dispatchNotification({
              header: "Помилка",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "Операція успішна!",
            message: "Ключ видано",
            type: "ok",
          });
        }
        //@ts-ignore
        props.dispatch({
          type: "POP_POPUP_WINDOW",
        });
        isButtonDisabledVar(false);
      } catch (e: any) {
        dispatchNotification({
          header: "Помилка!",
          message: (e as any).message,
          type: "alert",
        });
        isButtonDisabledVar(false);
      }
    }

    const DisabledButton = () => disabledClassroom?.state === DisabledState.DISABLED ? (
      <Button color="red" onClick={handleEnableClassroom}>Розблокувати</Button>
    ) : (
      <Button color="red" onClick={handleDisableClassroom}>Заблокувати</Button>
    );

    return (
      <div className={styles.footer}>
        {(isOverdue || isOccupiedOverdue) && <span className={styles.sanctions}>
                <label>З застосуванням санкцій</label>
                <input type='checkbox' checked={confirmSanctions}
                       onChange={e => setConfirmSanction(e.target.checked)}
                />
            </span>}
        {isClassroomNotFree(occupied) && !isPassed ? (
          <>
            <DisabledButton/>
            <div>
              <Button onClick={handlePassClassroom}>
                Передати
              </Button>
              <Button onClick={confirmFreeClassroom} disabled={disabled} color='red'>
                Звільнити {confirmSanctions ? '(з санкціями)' : ''}
              </Button>
              {occupied.state === OccupiedState.RESERVED && (
                <>
                  <Button onClick={confirmGiveOutKey} disabled={disabled}
                          style={{padding: '0 40px', height: '2.5rem'}}>
                    Видати ключ
                  </Button>

                </>
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
