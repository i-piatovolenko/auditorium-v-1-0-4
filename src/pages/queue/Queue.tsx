import React, {FormEvent, useEffect, useState} from "react";
import styles from "./queue.module.css";
import Header from "../../components/header/Header";
import Select from "react-select";
import {QueueState, QueueType, User} from "../../models/models";
import {fullName} from "../../helpers/helpers";
import Button from "../../components/button/Button";
import {client} from "../../api/client";
import {GET_USERS_FOR_QUEUE} from "../../api/operations/queries/usersQueue";
import {REMOVE_USERS_FROM_QUEUE} from "../../api/operations/mutations/removeUsersFromQueue";
import {useNotification} from "../../components/notification/NotificationProvider";
import useClassrooms from "../../hooks/useClassrooms";
import {ADD_USERS_TO_QUEUE} from "../../api/operations/mutations/addUsersToQueue";

const Queue = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [disabled, setDisabled] = useState(false);
  const classrooms = useClassrooms();
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

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
      mutation: REMOVE_USERS_FROM_QUEUE,
      variables: {
        where: {
          userId: {
            equals: chosenUser.value
          }
        }
      }
    });
      dispatchNotification({
        header: "Успішно!",
        message: `Користувача видалено з черги.`,
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
        header: "Помилка",
        message: `Користувача не видалено з черги.`,
        type: "alert",
      });
      setDisabled(false);
    }
  };

  const getInLine = async () => {
    setDisabled(true);
    const data = classrooms
      .filter(classroom => withInstrument ? classroom.instruments.length : true)
      .map(({id}) => ({
      userId: chosenUser.value,
      classroomId: id,
      state: QueueState.ACTIVE,
      type: QueueType.MINIMAL
    }));

    try {
    await client.mutate({mutation: ADD_USERS_TO_QUEUE, variables: {
        input: data
      }});
      dispatchNotification({
        header: "Успішно!",
        message: `Користувача записано в чергу.`,
        type: "ok",
      });
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
        header: "Помилка",
        message: `Користувача не записано в чергу.`,
        type: "alert",
      });
      setDisabled(false);
    }
  };

  return (
    <div>
      <Header>
        <h1>Черга</h1>
      </Header>
      <div className={styles.wrapper}>
        <form
          id="userQueueForm"
          className={styles.userSearch}
          onSubmit={handleSubmit}
        >
          <p>Виберіть користувача, щоб додати або видалити з черги:</p>
          <Select
            placeholder="Користувачі"
            options={users.map((user: User) => ({
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
            З фортепіано
          </label>)
          }
          {chosenUser.queueLength !== -1 && (
            <Button onClick={chosenUser.queueLength > 0 ? removeFromLine : getInLine}
                    disabled={disabled}
            >
              {chosenUser.queueLength > 0 ? 'Видалити з черги' : 'Поставити в чергу'}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Queue;
