import React, {FC} from "react";
import styles from "./occupantInfo.module.css";
import {OccupiedInfo, OccupiedState, OccupiedStateUa, User, UserTypes, UserTypesUa,} from "../../../models/models";
import Title from "../../title/Title";
import {fullName, typeStyle} from "../../../helpers/helpers";
import {usePopupWindow} from "../../popupWindow/PopupWindowProvider";
import UserProfile from "../../userProfile/UserProfile";
import Button from "../../button/Button";
import {FREE_CLASSROOM} from "../../../api/operations/mutations/freeClassroom";
import {client} from "../../../api/client";
import handleOperation from "../../../helpers/handleOperation";
import {RELEASE_KEY_HOLDER} from "../../../api/operations/mutations/releaseKeyHolder";

type PropTypes = {
  occupied: OccupiedInfo;
  classroomName: string;
  dispatchNotification: (config: any) => void;
  dispatch: (value: any) => void;
}

type UserCardPropTypes = {
  user: User;
  isKeyHolder?: boolean;
}

const OccupantInfo: FC<PropTypes> = ({occupied, classroomName, dispatchNotification, dispatch}) => {
  const dispatchPopupWindow = usePopupWindow();

  const onClick = (user: User) => {
    dispatchPopupWindow({
      header: <h1>{fullName(user)}</h1>,
      body: <UserProfile userId={user.id}/>,
    });
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

  const freeClassroom = async () => {
    try {
      const result = await client.mutate({
        mutation: FREE_CLASSROOM,
        variables: {
          input: {
            classroomName: String(classroomName)
          }
        }
      });
      handleOperation(result, 'freeClassroom', dispatchNotification, dispatch,
        `Аудиторія ${classroomName} звільнена.`);
    } catch (e: any) {
      dispatchNotification({
        header: "Помилка",
        message: e.message,
        type: "alert",
      });
    }
  };

  const UserCard: FC<UserCardPropTypes> = ({user, isKeyHolder = false}) => (
    <div onClick={() => onClick(user)} className={styles.occupantCard}>
      <div>
        <div className={styles.occupantName}>
          <div className={styles.icon}/>
          <p>{fullName(user)}</p>
        </div>
        <p style={typeStyle(user)} className={styles.occupantType}>
          {UserTypesUa[user.type as UserTypes]}
        </p>
        <p className={styles.state}>
          Статус: {isKeyHolder ? 'власник ключа' : OccupiedStateUa[occupied.state].toLowerCase()}
        </p>
      </div>
      {isKeyHolder ? (
        <div className={styles.controlButtons}>
          <Button onClick={releaseKeyHolder} color="red">
            Звільнити (здає ключ)
          </Button>
        </div>
      ) : (occupied.state === OccupiedState.RESERVED ||
        occupied.state === OccupiedState.PENDING) && occupied.keyHolder && (
        <div className={styles.controlButtons}>
          <Button onClick={freeClassroom} color="red">
            Звільнити
          </Button>
          <Button onClick={freeClassroom}>
            Видати ключ
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Title title="Ким зайнято"/>
      <div className={styles.cards}>
        {!!occupied.keyHolder && (occupied.state === OccupiedState.RESERVED ||
          occupied.state === OccupiedState.PENDING) && (
          <UserCard user={occupied.keyHolder} isKeyHolder/>
        )}
        {!!occupied.user && (
          <UserCard user={occupied.user}/>
        )}
      </div>
    </>
  );
};

export default OccupantInfo;
