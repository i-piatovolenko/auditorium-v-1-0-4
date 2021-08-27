import React, {useEffect, useState} from 'react';
import {
  Department,
  EmployeeAccountStatus,
  EmploymentTypes,
  EmploymentTypesUa,
  User,
  UserTypes,
  UserTypesUa
} from "../../../../models/models";
import styles from './../../classrooms/createClassroomPopupBody/createClassroomPopupBody.module.css';
import {client} from "../../../../api/client";
import {SIGNUP_EMPLOYEE} from "../../../../api/operations/mutations/signupEmployee";
import moment from "moment";
import Select from "react-select";
import {selectLightStyles} from "../../../../styles/selectStyles";
import Button from "../../../../components/button/Button";
import {useQuery} from "@apollo/client";
import {GET_DEPARTMENTS} from "../../../../api/operations/queries/departments";
import {GET_USERS} from "../../../../api/operations/queries/users";

interface PropTypes {
  user: User;
}

const userTypesData = [
  {value: UserTypes.STAFF, label: UserTypesUa.STAFF},
  {value: UserTypes.ILLUSTRATOR, label: UserTypesUa.ILLUSTRATOR},
  {value: UserTypes.CONCERTMASTER, label: UserTypesUa.CONCERTMASTER},
  {value: UserTypes.TEACHER, label: UserTypesUa.TEACHER},
  {value: UserTypes.PIANO_TUNER, label: UserTypesUa.PIANO_TUNER},
  {value: UserTypes.OTHER, label: UserTypesUa.OTHER},
  {value: UserTypes.ADMIN, label: UserTypesUa.ADMIN},
];

const employmentTypesData = [
  {value: EmploymentTypes.FULL_TIME, label: EmploymentTypesUa.FULL_TIME},
  {value: EmploymentTypes.PART_TIME, label: EmploymentTypesUa.PART_TIME},
  {value: EmploymentTypes.HOURLY, label: EmploymentTypesUa.HOURLY},
];

const EditUserPopupBody: React.FC<PropTypes> = ({
                                                  user, dispatch, dispatchNotification,
                                                  dispatchPopupWindow
                                                }: any) => {
  const {data, loading, error} = useQuery(GET_DEPARTMENTS);
  const [departmentsData, setDepartmentsData] = useState([{value: -1, label: ''}]);
  const [selectedDepartment, setSelectedDepartment] = useState(departmentsData[0]);
  const [selectedUserType, setSelectedUserType] = useState(userTypesData[0]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [withDateLimit, setWithDateLimit] = useState(true);
  const [expireDate, setExpireDate] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(employmentTypesData[0]);

  useEffect(() => {
    if (!loading && !error) {
      const mappedDepartments = data.departments.map((department: Department) => {
        return ({value: department.id, label: department.name});
      });
      setDepartmentsData(mappedDepartments);
      setSelectedDepartment(mappedDepartments[0]);
    }
  }, [data]);

  const handleErrorDetails = (e: any) => {
    dispatchPopupWindow({
      header: <h1>{e.name}</h1>,
      body: (
        <>
          <p>{e.message}</p>
          <p>{e.extraInfo}</p>
          <pre>{e.stack}</pre>
        </>
      ),
      footer: ''
    });
  };

  const handleSignUpEmployee = async (e: any) => {
    e.preventDefault();
    try {
      const result = await client.mutate({
        mutation: SIGNUP_EMPLOYEE,
        variables: {
          input: {
            firstName,
            patronymic,
            lastName,
            type: selectedUserType.value,
            department: (
              selectedUserType.value === UserTypes.TEACHER
              || selectedUserType.value === UserTypes.CONCERTMASTER
              || selectedUserType.value === UserTypes.ILLUSTRATOR
            ) ? {
              connect: {
                id: selectedDepartment.value
              }
            } : undefined,
            employeeInfo: {
              create: {
                employmentType: selectedEmploymentType.value,
                accountStatus: EmployeeAccountStatus.ACTIVE
              }
            },
            expireDate: !withDateLimit ? moment(expireDate).toISOString() : undefined
          }
        }
      });
      if (result.data.signupEmployee.userErrors?.length) {
        result.data.signupEmployee.userErrors.forEach(({message}: any) => {
          dispatchNotification({
            header: "Помилка",
            message,
            type: "alert",
          });
        })
      } else {
        await client.query({
          query: GET_USERS,
          fetchPolicy: 'network-only'
        })
        dispatchNotification({
          header: "Успішно!",
          message: `Новий аккаунт співробітника створено.`,
          type: "ok",
        });
        dispatch({
          type: "POP_POPUP_WINDOW",
        });
      }
    } catch (e) {
      console.log(e);
      dispatchNotification({
        header: "Помилка!",
        message: <><span>Щось пішло не так.</span><br/>
          <span style={{color: '#2b5dff', cursor: 'pointer', textDecoration: 'underline'}}
                onClick={() => handleErrorDetails && handleErrorDetails(e)}>Деталі</span></>,
        type: "alert",
      });
    }
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <form className={styles.container}>
          <label>Прізвище
            <input
              placeholder="Прізвище"
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>Ім'я
            <input
              placeholder="Ім'я"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>По-батькові
            <input
              placeholder="По-батькові"
              onChange={(e) => setPatronymic(e.target.value)}
            />
          </label>
          <label>Тип аккаунту
            <Select
              value={selectedUserType}
              onChange={e => setSelectedUserType(e)}
              options={userTypesData}
              //@ts-ignore
              styles={selectLightStyles}
              menuPortalTarget={document.body}
              isSearchable
              placeholder='Виберіть тип'
            />
          </label>
          <label>Тип занятості
            <Select
              value={selectedEmploymentType}
              onChange={e => setSelectedEmploymentType(e)}
              options={employmentTypesData}
              //@ts-ignore
              styles={selectLightStyles}
              menuPortalTarget={document.body}
              isSearchable
              placeholder='Виберіть тип зайнятість'
            />
          </label>
          <label>Безстроковий термін дії
            <input type="checkbox" checked={withDateLimit}
                   onChange={() => setWithDateLimit(prevState => !prevState)}
            />
          </label>
          {!withDateLimit && (
            <label>Термін дії
              <input type="date" value={expireDate}
                     onChange={e => setExpireDate(e.target.value)}
              />
            </label>
          )}
          {(selectedUserType.value === UserTypes.TEACHER
            || selectedUserType.value === UserTypes.CONCERTMASTER
            || selectedUserType.value === UserTypes.ILLUSTRATOR
          ) && (
            <label>Кафедра
              <Select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e)}
                options={departmentsData}
                //@ts-ignore
                styles={selectLightStyles}
                menuPortalTarget={document.body}
                isSearchable
                placeholder='Виберіть кафедру'
              />
            </label>
          )}
          <Button onClick={handleSignUpEmployee} style={{marginTop: 16, height: 40}}
                  disabled={!firstName || !lastName || !patronymic}>
            Створити новий аккаунт
          </Button>
        </form>
      </div>
    </div>
  );
}

export default EditUserPopupBody;