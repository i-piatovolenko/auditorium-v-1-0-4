import React, {FormEvent, useEffect, useRef, useState,} from "react";
import styles from "./occupantRegistration.module.css";
import {useMutation, useQuery} from "@apollo/client";
import {GET_USER_OCCUPIED_CLASSROOMS_BY_USER_ID, GET_USERS} from "../../../api/operations/queries/users";
import {formatTempName, fullName, isStudent} from "../../../helpers/helpers";
import Title from "../../title/Title";
import Select from 'react-select';
import {
  EmployeeAccountStatus,
  OccupiedState, ScheduleUnitType,
  StudentAccountStatus,
  User,
  UserTypes,
  UserTypesUa
} from "../../../models/models";
import {OCCUPY_CLASSROOM} from "../../../api/operations/mutations/occupyClassroom";
import {client, isButtonDisabledVar} from "../../../api/client";
import ConfirmFooter from "../../footer/ConfirmFooter";
import moment from "moment";
import {GET_SCHEDULE_UNIT} from "../../../api/operations/queries/schedule";
import Button from "../../button/Button";
import clockIcon from "../../../assets/images/clock.svg";
import ChooseTime from "./chooseTime/ChooseTime";

interface PropTypes {
  dispatchNotification: (value: any) => void;
  dispatchPopupWindow: (value: any) => void;
  classroomId: number;
  classroomName: string;
  dispatch: (value: any) => void;
}

const OccupantRegistration: React.FC<PropTypes> = ({
                                                     dispatchNotification, classroomId,
                                                     classroomName, dispatch, dispatchPopupWindow
                                                   }) => {
  const [value, setValue] = useState<string>();
  const [existingUserValue, setExistingUserValue] = useState(null);
  const [chosenUserId, setChosenUserId] = useState(-1);
  const [chosenUserName, setChosenUserName] = useState('');
  const {data, loading, error} = useQuery(GET_USERS);
  const [occupyClassroom] = useMutation(OCCUPY_CLASSROOM);
  const [users, setUsers] = useState();
  const [scheduleUsers, setScheduleUsers] = useState([]);
  const [scheduleUnits, setScheduleUnits] = useState<ScheduleUnitType[]>([]);
  const [until, setUntil] = useState(3);
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
  const [chosenUserType, setChosenUserType] = useState(newUserTypes[7]);
  const existingUserInput = useRef(null);

  //@ts-ignore
  useEffect(() => {
    client.query({
      query: GET_SCHEDULE_UNIT,
      variables: {
        classroomName,
        date: moment().endOf('day').toISOString(),
      }
    }).then(({data: schedule}) => {
      setScheduleUnits(schedule);
      setScheduleUsers(schedule.schedule.filter((unit: ScheduleUnitType) => {
        const date = moment().format('YYYY-MM-DD');
        const diff = moment(date + ' ' + unit.to).diff(moment());
        return diff > 0;
      })
        .map((unit: ScheduleUnitType) => {
          return ({name: fullName(unit.user, true), id: unit.user.id});
        }));
    });
    existingUserInput.current.focus();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      setUsers(data.users.slice()
        .sort((a: User, b: User) => a.id - b.id)
        .filter(({studentInfo, employeeInfo, nameTemp}: User) => {
          return (studentInfo && studentInfo.accountStatus === StudentAccountStatus.ACTIVE) ||
            (employeeInfo && employeeInfo.accountStatus === EmployeeAccountStatus.ACTIVE) &&
            !nameTemp
        })
        .map((user: User) => ({label: user.id + ": " + fullName(user), value: user.id})));
    }
  }, [data, error, loading]);

  const handleTimeSettingsModalShow = () => {
    dispatchPopupWindow({
      header: <ChooseTime.Header/>,
      body: <ChooseTime.Body until={until} setUntil={setUntil}/>,
      footer: <ChooseTime.Footer/>,
      isConfirm: true
    });
  };

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
      setChosenUserType(newUserTypes[7]);
    }

    setChosenUserId(-1);
    setValue(e.target.value);
    setChosenUserName(e.target.value);
    setExistingUserValue(null);
  }

  const handleTypeSelect = (e: any) => {
    setChosenUserType(e);
  };

  const confirmOccupyAnotherClassroom = (oldClassroomName: string) => {
    dispatchPopupWindow({
      header: <h1>Увага!</h1>,
      body: <span>Користувач знаходиться в аудиторії {oldClassroomName}. Після підтвердження користувача буде виписано з аудиторіЇ {oldClassroomName} і записано до аудиторії {classroomName}.</span>,
      footer: <ConfirmFooter onOk={handleOccupy}/>,
      isConfirm: true
    });
  }

  const checkChosenUserIsOccupiedPreviously = async () => {
    if (chosenUserId === -1) return await handleOccupy();
    try {
      const chosenUserOccupiedInfo = await client.query({
        query: GET_USER_OCCUPIED_CLASSROOMS_BY_USER_ID,
        variables: {
          where: {
            id: chosenUserId,
          }
        },
        fetchPolicy: 'network-only'
      });
      const occupiedClassrooms = chosenUserOccupiedInfo.data.user.occupiedClassrooms;
      if (occupiedClassrooms?.length) {
        const occupiedOrReservedClassrooms = occupiedClassrooms.filter((classroom: any) => {
          return classroom.state === OccupiedState.RESERVED || classroom.state === OccupiedState.OCCUPIED
        });
        if (occupiedOrReservedClassrooms.length) {
          confirmOccupyAnotherClassroom(occupiedOrReservedClassrooms[0].classroom.name);
        } else {
          await handleOccupy();
        }
      } else {
        await handleOccupy();
      }
    } catch (e) {
      console.log(e);
    }
  }

  const onOccupyClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await checkChosenUserIsOccupiedPreviously();
  };

  const handleOccupy = async () => {
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
      const result = await occupyClassroom({
        variables: {
          input: {
            classroomName: classroomName.toString(),
            until: !isStudent(chosenUserType.value) || until === -1
              ? moment().set('hours', 23).set('minutes', 59).set('seconds', 59).toISOString()
              : moment().add(until, 'hours').toISOString(),
            ...occupant
          }
        }
      })
      if (result.data.occupyClassroom.userErrors.length) {
        result.data.occupyClassroom.userErrors.forEach(({message}: any) => {
          dispatchNotification({
            header: "Помилка",
            message,
            type: "alert",
          });
        })
      } else {
        dispatchNotification({
          header: "Успішно!",
          message: `Аудиторія ${classroomName} зайнята.`,
          type: "ok",
        });
      }
      dispatch({
        type: "POP_POPUP_WINDOW",
      });
      isButtonDisabledVar(false);
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
        onSubmit={onOccupyClick}
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
            placeholder="Тимчасовий користувач"
            className={styles.createUserInput}
            autoComplete="off"
          />
          {value && <Select
              options={newUserTypes}
              value={chosenUserType}
              placeholder={UserTypesUa.OTHER}
              onChange={handleTypeSelect}
              menuPortalTarget={document.body}
              styles={{menuPortal: base => ({...base, zIndex: 9999})}}
          />}
        </div>
      </form>
      <div>
        {scheduleUsers.map((user: any) => {
          const data = {value: user.id, label: user.name}
          return (
            <Button style={{height: 30, marginRight: 5}} onClick={() => handleExistingUser(data)}>
              {user.name}
            </Button>
          );
        })}
      </div>
      <Title title="Вибраний користувач"/>
      <p>П.І.Б.: {chosenUserName}</p>
      {/*@ts-ignore*/}
      <p>Статус: {chosenUserType && chosenUserName?.length !== 0 && UserTypesUa[chosenUserType.value]}</p>
      <div className={styles.time} onClick={handleTimeSettingsModalShow}>
        {isStudent(chosenUserType.value) && (
          <>
            <img src={clockIcon} width={24} height={24} alt='time'/>
            <span>До {until !== -1
              ? moment().add(until, 'hours').format('HH:mm')
              : 'кінця дня'}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OccupantRegistration;
