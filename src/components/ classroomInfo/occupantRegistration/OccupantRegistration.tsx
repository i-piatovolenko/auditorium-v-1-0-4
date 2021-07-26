import React, {FormEvent, useEffect, useRef, useState,} from "react";
import styles from "./occupantRegistration.module.css";
import {useMutation, useQuery} from "@apollo/client";
import {GET_USERS} from "../../../api/operations/queries/users";
import {fullName} from "../../../helpers/helpers";
import Title from "../../title/Title";
import Select from 'react-select';
import {User, UserTypesUa, UserTypes} from "../../../models/models";
import {OCCUPY_CLASSROOM} from "../../../api/operations/mutations/occupyClassroom";
import {isButtonDisabledVar} from "../../../api/client";

interface PropTypes {
  dispatchNotification: (value: any) => void;
  classroomId: number;
  classroomName: string;
  dispatch: (value: any) => void;
}

const OccupantRegistration: React.FC<PropTypes> = ({dispatchNotification, classroomId,
   classroomName, dispatch
}) => {
  const [value, setValue] = useState<string>();
  const [existingUserValue, setExistingUserValue] = useState(null);
  const [chosenUserId, setChosenUserId] = useState(-1);
  const [chosenUserName, setChosenUserName] = useState('');
  const {data, loading, error} = useQuery(GET_USERS);
  const [occupyClassroom] = useMutation(OCCUPY_CLASSROOM);
  const [users, setUsers] = useState();
  const newUserTypes: any = [
    {value: UserTypes.STUDENT, label: UserTypesUa.STUDENT},
    {value: UserTypes.POST_GRADUATE, label: UserTypesUa.POST_GRADUATE},
    {value: UserTypes.TEACHER, label: UserTypesUa.TEACHER},
    {value: UserTypes.ILLUSTRATOR, label: UserTypesUa.ILLUSTRATOR},
    {value: UserTypes.CONCERTMASTER, label: UserTypesUa.CONCERTMASTER},
    {value: UserTypes.PIANO_TUNER, label: UserTypesUa.PIANO_TUNER},
    {value: UserTypes.STAFF, label: UserTypesUa.STAFF},
    {value: UserTypes.OTHER, label: UserTypesUa.OTHER},
  ];
  const [chosenUserType, setChosenUserType] = useState(newUserTypes[0]);
  const existingUserInput = useRef(null);

  //@ts-ignore
  useEffect(() => existingUserInput.current.focus(),[]);

  useEffect(() => {
    if (!loading && !error) {
      setUsers(data.users.map((user: User) => ({label: user.id + ": " + fullName(user), value: user.id})));
    }
  }, [data]);

  const handleReset = () => {
    setExistingUserValue(null);
  };

  const handleExistingUser = (e: any) => {
    const chosenUser = (data.users as unknown as Array<User>)?.find(user => user.id === e.value);

    setChosenUserId(e.value);
    setChosenUserName(fullName(chosenUser as User));
    setChosenUserType({value: (chosenUser as User).type, label: UserTypesUa[(chosenUser?.type as UserTypes)]});
    setValue('');
    setExistingUserValue(e);
  };

  const handleNewUser = (e: any) => {
    if (e.target.value.length === 1) {
      setChosenUserType(newUserTypes[0]);
    }

    setChosenUserId(-1);
    setValue(e.target.value);
    setChosenUserName(e.target.value);
    setExistingUserValue(null);
  }

  const handleTypeSelect = (e: any) => {
    setChosenUserType(e);
  };

  const handleOccupy = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const existingUser = {
      userId: chosenUserId,
    };
    const newUser = {
      userId: -1,
      tempUser: {
        name: chosenUserName,
        type: chosenUserType.value
      }
    };
    const occupant = chosenUserId === -1 ? newUser : existingUser;

    if(chosenUserName !== "") {
      isButtonDisabledVar(true);
      occupyClassroom({
        variables: {
          input: {
            classroomName: classroomName.toString(),
            until: new Date(),
            ...occupant
          }
        }
      }).then(() => {
        dispatch({
          type: "POP_POPUP_WINDOW",
        });
        dispatchNotification({
          header: "Успішно!",
          message: `Аудиторія ${classroomName} зайнята.`,
          type: "ok",
        });
        isButtonDisabledVar(false);
      });
    } else {
      dispatchNotification({
        header: "Помилка",
        message: `Виберіть користувача.`,
        type: "alert",
      });
      isButtonDisabledVar(false);
    }
  };

  return (
    <div>
      <form
        id="userSearchForm"
        className={styles.userSearch}
        onSubmit={handleOccupy}
      >
          <Select
            placeholder="Існуючі користувачі"
            options={users}
            value={existingUserValue}
            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
            menuPortalTarget={document.body}
            onChange={handleExistingUser}
            onFocus={handleReset}
            ref={existingUserInput}
          />
        <div>
            <input
              type="text"
              value={value}
              onChange={handleNewUser}
              name="tempUsersInput"
              id="tempUsersInput"
              placeholder="Новий користувач"
              className={styles.createUserInput}
              autoComplete="off"
            />
          {value && <Select
            options={newUserTypes}
            value={chosenUserType}
            placeholder={UserTypesUa.STUDENT}
            onChange={handleTypeSelect}
            menuPortalTarget={document.body}
            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
          />}
        </div>
      </form>
      <Title title="Вибраний користувач"/>
      <p>П.І.Б.: {chosenUserName}</p>
      {/*@ts-ignore*/}
      <p>Статус: { chosenUserType && chosenUserName?.length !== 0 && UserTypesUa[chosenUserType.value]}</p>
    </div>
  );
};

export default OccupantRegistration;