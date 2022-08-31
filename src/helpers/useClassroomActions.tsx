import React from 'react';
import {client, disableClassroomBeforeFreeVar, disabledTimeVar, isButtonDisabledVar} from "../api/client";
import {gql} from "@apollo/client";
import {DISABLE_CLASSROOM} from "../api/operations/mutations/disableClassroom";
import moment from "moment";
import {FREE_CLASSROOM} from "../api/operations/mutations/freeClassroom";
import {ClassroomType, OccupiedState, User} from "../models/models";
import {GIVE_OUT_CLASSROOM_KEY} from "../api/operations/mutations/giveOutClassroomKey";
import {GET_USER_OCCUPIED_CLASSROOMS_BY_USER_ID} from "../api/operations/queries/users";
import {formatTempName, fullName, isStudent} from "./helpers";
import ConfirmFooter from "../components/footer/ConfirmFooter";
import ConfirmBody from "../components/footer/ConfirmBody";
import {ENABLE_CLASSROOM} from "../api/operations/mutations/enableClassroom";
import DisableClassroom from "../components/DisableClassroom";
import Button from "../components/button/Button";
import {RELEASE_KEY_HOLDER} from "../api/operations/mutations/releaseKeyHolder";
import handleOperation from "./handleOperation";
import {OCCUPY_CLASSROOM} from "../api/operations/mutations/occupyClassroom";

export const useClassroomActions = (classroomName: string, dispatchNotification: any, dispatchPopupWindow: any, dispatch: any) => {
  const free = async (isOverdue: boolean, confirmSanctions: boolean, dispatch: any,
                      withoutDisable: boolean = true) => {
    const {data: {disabledTime}} = await client.query({
      query: gql`query disabledTime { disabledTime @client }`
    });

    try {
      if (disableClassroomBeforeFreeVar() && withoutDisable) {
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
      const result = await client.mutate({
        mutation: FREE_CLASSROOM,
        variables: {
          input: {
            classroomName: String(classroomName),
            applySanction: isOverdue ? confirmSanctions : false
          },
        },
      });
      handleOperation(result, 'freeClassroom', dispatchNotification, dispatch,
        `Аудиторія ${classroomName} звільнена.`);
    } catch (e: any) {
      dispatchNotification({
        header: "Помилка!",
        message: e.message,
        type: "alert",
      });
    } finally {
      isButtonDisabledVar(false);
      disabledTimeVar(15);
      disableClassroomBeforeFreeVar(false);
    }
  };

  const occupy = async (chosenUserId: number, chosenUserName: string, chosenUserType: any, until: string | -1) => {
    const existingUser = {
      userId: chosenUserId,
    };
    const newUser = {
      userId: chosenUserId,
      tempUser: {
        name: formatTempName(chosenUserName),
        type: chosenUserType.value
      }
    };
    const occupant = chosenUserId === -1 ? newUser : existingUser;

    if (chosenUserName !== "") {
      isButtonDisabledVar(true);
      try {
        const result = await client.mutate({
          mutation: OCCUPY_CLASSROOM,
          variables: {
            input: {
              classroomName: classroomName.toString(),
              // until: moment().add('seconds', 30).toISOString(),
              until: !isStudent(chosenUserType.value) || until === -1
                ? moment().set('hours', 23).set('minutes', 59).set('seconds', 59).toISOString()
                : moment().add(until, 'hours').toISOString(),
              ...occupant
            }
          }
        });
        handleOperation(result, 'occupyClassroom', dispatchNotification, dispatch,
          `Аудиторія ${classroomName} зайнята.`);
      } catch (e: any) {
        dispatchNotification({
          header: "Помилка",
          message: e.message,
          type: "alert",
        });
      } finally {
        isButtonDisabledVar(false);
      }
    } else {
      dispatchNotification({
        header: "Помилка",
        message: `Виберіть користувача.`,
        type: "alert",
      });
      isButtonDisabledVar(false);
    }
  };

  const disable = async (comment: string, until: string) => {
    try {
      const result = await client.mutate({
        mutation: DISABLE_CLASSROOM,
        variables: {
          input: {
            classroomName: String(classroomName),
            comment: comment || 'За розкладом',
            until: moment(until).toISOString()
          }
        },
      });
      handleOperation(result, 'disableClassroom', dispatchNotification, dispatch,
        `Аудиторія ${classroomName} заблокована.`);
    } catch (e: any) {
      dispatchNotification({
        header: "Помилка!",
        message: e.message,
        type: "alert",
      });
    }
  };

  const enable = async () => {
    try {
      const result = client.mutate({
        mutation: ENABLE_CLASSROOM,
        variables: {
          input: {
            classroomName: String(classroomName)
          }
        }
      });
      handleOperation(result, 'enableClassroom', dispatchNotification, dispatch, `Аудиторія ${classroomName} розблокована.`);
    } catch (e: any) {
      dispatchNotification({
        header: "Помилка!",
        message: e.message,
        type: "alert",
      });
    }
  };

  const releaseKeyHolder = async () => {
    try {
      const result = await client.mutate({
        mutation: RELEASE_KEY_HOLDER,
        variables: {
          input: {
            classroomName: String(classroomName)
          }
        }
      });
      handleOperation(result, 'ReleaseKeyHolder', dispatchNotification, dispatch,
        `Користувач віддав ключ.`);
    } catch (e: any) {
      dispatchNotification({
        header: "Помилка",
        message: e.message,
        type: "alert",
      });
    }
  };

  const giveOutKey = async (occupiedClassroom: { classroom: ClassroomType }, isOverdue: boolean,
                            confirmSanctions: boolean) => {
    isButtonDisabledVar(true);
    try {
      if (occupiedClassroom) {
        await free(isOverdue, confirmSanctions, true);
      }
      const result = await client.mutate({
        mutation: GIVE_OUT_CLASSROOM_KEY,
        variables: {
          input: {
            classroomName
          }
        }
      });
      handleOperation(result, 'giveOutClassroomKey', dispatchNotification, dispatch, "Ключ видано");
    } catch (e: any) {
      dispatchNotification({
        header: "Помилка!",
        message: (e as any).message,
        type: "alert",
      });
    } finally {
      isButtonDisabledVar(false);
    }
  };

  const confirmFree = (isOverdue: boolean = false, confirmSanctions: boolean = false) => {
    dispatchPopupWindow({
      header: <h1>Увага!</h1>,
      body: <ConfirmBody/>,
      footer: <ConfirmFooter onOk={() => free(isOverdue, confirmSanctions, dispatch)}/>,
      isConfirm: true
    });
  };

  const confirmGiveOutKey = async (occupiedUser: User, isOverdue: boolean = false,
                                   confirmSanctions: boolean = false) => {
    let occupiedClassroom: any;
    const result = await client.query({
      query: GET_USER_OCCUPIED_CLASSROOMS_BY_USER_ID,
      variables: {
        where: {
          id: occupiedUser.id
        }
      }
    })
    if (!result.data.user) {
      console.log('error');
    } else {
      occupiedClassroom = result.data.user.occupiedClassrooms.find(({state}: any) => state === OccupiedState.OCCUPIED)
    }
    dispatchPopupWindow({
      header: <h1>Увага!</h1>,
      body: occupiedClassroom ? (
          <>
            <p>{`В даний момент користувач займає аудиторію ${occupiedClassroom.classroom.name}, з якої він буде автоматично виписаний.`}</p>
            <p>{`Переконайтесь, що ключі від попередньої аудиторії (${occupiedClassroom.classroom.name}) були здані.`}</p>
          </>
        ) :
        (
          <span>{`Підтвердіть видачу ключа для ${fullName(occupiedUser, true)}`}</span>
        ),
      footer: <ConfirmFooter onOk={() => giveOutKey(occupiedClassroom, isOverdue, confirmSanctions)}/>,
      isConfirm: true
    });
  };

  const confirmDisable = () => {
    dispatchPopupWindow({
      header: <h1>Заблокувати аудиторію</h1>,
      body: (
        <DisableClassroom onSubmit={disable}/>
      ),
      footer: (
        <>
          <Button form='disableClassroomForm' type='submit' color='red'>Заблокувати</Button>
        </>
      )
    });
  }

  return {
    free,
    occupy,
    disable,
    enable,
    releaseKeyHolder,
    giveOutKey,
    confirmFree,
    confirmGiveOutKey,
    confirmDisable,
  };
};
