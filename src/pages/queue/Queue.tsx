import React, {useEffect, useState} from "react";
import styles from "./queue.module.css";
import Header from "../../components/header/Header";
import Select from "react-select";
import {
  ClassroomType,
  DisabledState,
  EnqueuedBy,
  QueueType,
  StudentAccountStatus,
  User,
  UserTypes
} from "../../models/models";
import {fullName} from "../../helpers/helpers";
import Button from "../../components/button/Button";
import {client} from "../../api/client";
import {GET_USERS_FOR_QUEUE} from "../../api/operations/queries/usersQueue";
import {REMOVE_USER_FROM_QUEUE} from "../../api/operations/mutations/removeUserFromQueue";
import {useNotification} from "../../components/notification/NotificationProvider";
import useClassrooms from "../../hooks/useClassrooms";
import {ADD_USER_TO_QUEUE} from "../../api/operations/mutations/addUserToQueue";
import moment from "moment";

const Queue = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [classrooms, subscribeToMore]: [ClassroomType[], any] = useClassrooms();
  const [withInstrument, setWithInstrument] = useState(false);
  const [chosenUser, setChosenUser] = useState({label: '', value: -1, queueLength: -1});
  const dispatchNotification = useNotification();

  useEffect(() => {
    client.query({
      query: GET_USERS_FOR_QUEUE
    }).then(data => {
      setUsers(data.data.users);
    });
  }, []);

  const handleChose = (e: any) => {
    const chosenUser = (users as unknown as Array<User>)?.find(user => user.id === e.value);

    setChosenUser({
      label: chosenUser?.id as number + ": " + fullName(chosenUser),
      value: chosenUser?.id as number,
      queueLength: chosenUser?.queue.length as number
    });
  };

  const removeFromLine = async () => {
    setDisabled(true);
    try {
      await client.mutate({
        mutation: REMOVE_USER_FROM_QUEUE,
        variables: {
          input: {
            userId: chosenUser.value
          }
        }
      });
      dispatchNotification({
        header: "??????????????!",
        message: `?????????????????????? ???????????????? ?? ??????????.`,
        type: "ok",
      });
      client.query({
        query: GET_USERS_FOR_QUEUE,
        fetchPolicy: 'network-only'
      }).then(data => {
        setUsers(data.data.users);
        setChosenUser(prevState => ({...prevState, queueLength: 0}));
        setDisabled(false);
      });
    } catch (e) {
      dispatchNotification({
        header: "??????????????",
        message: `?????????????????????? ???? ???????????????? ?? ??????????.`,
        type: "alert",
      });
      setDisabled(false);
    }
  };

  const getInLine = async () => {
    setDisabled(true);
    const data = classrooms
      .filter(classroom => !classroom.isHidden && classroom.disabled.state === DisabledState.NOT_DISABLED)
      .filter(classroom => withInstrument ? classroom.instruments.length : true)
      .map(({id}) => ({
        classroomId: id,
        type: QueueType.MINIMAL,
      }));

    try {
      const result = await client.mutate({
        mutation: ADD_USER_TO_QUEUE, variables: {
          input: {
            userId: chosenUser.value,
            data,
            enqueuedBy: EnqueuedBy.DISPATCHER
          }
        }
      });
      if (result.data.addUserToQueue.userErrors.length) {
        result.data.addUserToQueue.userErrors.forEach(({message}: any) => {
          dispatchNotification({
            header: "??????????????",
            message,
            type: "alert",
          });
        })
      } else {
        dispatchNotification({
          header: "??????????????!",
          message: `?????????????????????? ???????????????? ?? ??????????.`,
          type: "ok",
        });
      }
      client.query({
        query: GET_USERS_FOR_QUEUE,
        fetchPolicy: 'network-only'
      }).then(data => {
        setUsers(data.data.users);
        setChosenUser(prevState => ({...prevState, queueLength: 1}));
        setDisabled(false);
      });
    } catch (e) {
      dispatchNotification({
        header: "??????????????",
        message: `?????????????????????? ???? ???????????????? ?? ??????????.`,
        type: "alert",
      });
      setDisabled(false);
    }
  };

  const sanctions = chosenUser.value !== -1 && users
    .find(({id}) => chosenUser.value === id).queueInfo.sanctionedUntil;

  const renderSanction = () => {
    if (sanctions) return (
      <>
        <p className={styles.sanctions}>
          {`?????????????????? ?????????????????? ?? ??????????. ???????????????????? ?????????????????????? ?????? ?????????????????? ???? ${
            moment(sanctions).format('DD-MM-YYYY HH:mm')}`}
        </p>
      </>
    );
    return null;
  };

  return (
    <div>
      <Header>
        <h1>??????????</h1>
      </Header>
      <div className={styles.wrapper}>
        <form
          id="userQueueForm"
          className={styles.userSearch}
        >
          <p>???????????????? ????????????????, ?????? ???????????? ?????? ???????????????? ?? ??????????:</p>
          <Select
            placeholder="??????????????????????"
            options={users.filter(user => {
              return !user.occupiedClassrooms.length
                && (user.type === UserTypes.POST_GRADUATE || user.type === UserTypes.STUDENT) &&
                user.studentInfo.accountStatus === StudentAccountStatus.ACTIVE
            }).map((user: User) => ({
                label: user.id + ": " + fullName(user),
                value: user.id as number,
                queueLength: user?.queue.length as number
              })
            )}
            value={chosenUser}
            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
            menuPortalTarget={document.body}
            onChange={handleChose}
            isDisabled={disabled}
          />
          {chosenUser.queueLength === 0 && (
            <label htmlFor="instrumentCheckbox" className={styles.checkboxInstrument}>
              <input type='checkbox' name='instrument' id='instrumentCheckbox' checked={withInstrument}
                     onChange={(e) => setWithInstrument(e.target.checked)}
                     disabled={disabled}
              />
              ?? ????????????????????
            </label>)
          }
          {chosenUser.queueLength !== -1 && (
            <Button onClick={chosenUser.queueLength > 0 ? removeFromLine : getInLine}
                    disabled={disabled || (chosenUser.queueLength === 0 && !!sanctions)}
            >
              {chosenUser.queueLength > 0 ? '???????????????? ?? ??????????' : '?????????????????? ?? ??????????'}
            </Button>
          )}
        </form>
        {renderSanction()}
      </div>
    </div>
  );
};

export default Queue;
