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
import {GIVE_OUT_CLASSROOM_KEY} from "../../api/operations/mutations/giveOutClassroomKey";

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

    const handleFreeClassroom = async () => {
      isButtonDisabledVar(true);
      try {
        const result = await freeClassroom();
        if (result.data.freeClassroom.userErrors.length) {
          result.data.freeClassroom.userErrors.forEach(({message}: any) => {
            dispatchNotification({
              header: "??????????????",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "??????????????!",
            message: `?????????????????? ${classroomName} ??????????????????.`,
            type: "ok",
          });
          isButtonDisabledVar(false);
          // @ts-ignore
          props.dispatch({
            type: "POP_POPUP_WINDOW",
          });
        }
      } catch (e: any) {
        dispatchNotification({
          header: "??????????????!",
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
                header: "??????????????",
                message,
                type: "alert",
              });
            })
          } else {
            dispatchNotification({
              header: "??????????????!",
              message: `?????????????????? ${classroomName} ??????????????????????.`,
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
        } catch (e) {
          dispatchNotification({
            header: "??????????????!",
            message: e.message,
            type: "alert",
          });
        }
      } else {
        dispatchNotification({
          header: "??????????????!",
          message: "?????????????????? ?????? ????????.",
          type: "alert",
        });
      }
    };

    const handleDisableClassroom = () => {
      dispatchPopupWindow && dispatchPopupWindow({
        header: <h1>?????????????????????? ??????????????????</h1>,
        body: (
          <DisableClassroom onSubmit={submitDisable}/>
        ),
        footer: (
          <>
            <input form='disableClassroomForm' type='submit' value='??????????????????????'/>
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
              header: "??????????????",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "??????????????!",
            message: `?????????????????? ${classroomName} ????????????????????????.`,
            type: "ok",
          });
        }
        //@ts-ignore
        props.dispatch({
          type: "POP_POPUP_WINDOW",
        });
      } catch (e) {
        dispatchNotification({
          header: "??????????????!",
          message: e.message,
          type: "alert",
        });
      }
    }

    const confirmGiveOutKey = () => {
      dispatchPopupWindow({
        header: <h1>??????????!</h1>,
        body: <span>{`?????????????????????? ???????????? ?????????? ?????? ${fullName(occupied.user, true)}`}</span>,
        footer: <ConfirmFooter onOk={handleGiveOutKey}/>,
        isConfirm: true
      });
    }

    const confirmFreeClassroom = () => {
      dispatchPopupWindow({
        header: <h1>??????????!</h1>,
        body: <span>?????????????????????? ???????????????????? ??????????????????</span>,
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
              header: "??????????????",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "???????????????? ??????????????!",
            message: "???????? ????????????",
            type: "ok",
          });
        }
        //@ts-ignore
        props.dispatch({
          type: "POP_POPUP_WINDOW",
        });
        isButtonDisabledVar(false);
      } catch (e) {
        dispatchNotification({
          header: "??????????????!",
          message: e.message,
          type: "alert",
        });
        isButtonDisabledVar(false);
      }
    }

    const DisabledButton = () => disabledClassroom?.state === DisabledState.DISABLED ? (
      <span className={styles.disableButton}>
              <Button color="red" onClick={handleEnableClassroom}>????????????????????????</Button>
            </span>
    ) : (
      <span className={styles.disableButton}>
              <Button color="red" onClick={handleDisableClassroom}>??????????????????????</Button>
            </span>
    );

    return (
      <div className={styles.footer}>
        {isOverdue && <span className={styles.sanctions}>
                <label>?? ?????????????????????????? ??????????????</label>
                <input type='checkbox' checked={confirmSanctions}
                       onChange={e => setConfirmSanction(e.target.checked)}
                />
            </span>}
        {isClassroomNotFree(occupied) && !isPassed ? (
          <>
            <DisabledButton/>
            <Button onClick={handlePassClassroom}>
              ???????????????? {confirmSanctions ? '(?? ??????????????????)' : ''}
            </Button>
            {disabled && <img className={styles.spinner} src={spinner} alt="wait"/>}
            <Button onClick={confirmFreeClassroom} disabled={disabled} color='red'>
              ?????????????????? {confirmSanctions ? '(?? ??????????????????)' : ''}
            </Button>
            {occupied.state === OccupiedState.RESERVED && (
              <>
                {disabled && <img className={styles.spinner} src={spinner} alt="wait"/>}
                <Button onClick={confirmGiveOutKey} disabled={disabled}
                        style={{padding: '0 40px', height: '2.5rem'}}>
                  ???????????? ????????
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <DisabledButton/>
            {disabled && <img className={styles.spinner} src={spinner} alt="wait"/>}
            <Button type="submit" form="userSearchForm" disabled={disabled}>
              ???????????????? {confirmSanctions ? '(?? ?????????????????? ?????? ???????????????????????? ??????????????????????)' : ''}
            </Button>
          </>
        )}
      </div>
    );
  }
;

export default Footer;
