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

const EditUserPopupBody: React.FC<PropTypes> = ({user}) => {
  const {data, loading, error} = useQuery(GET_DEPARTMENTS);
  const [departmentsData, setDepartmentsData] = useState([{value: -1, label: ''}]);
  const [selectedDepartment, setSelectedDepartment] = useState(departmentsData[0]);
  const [selectedUserType, setSelectedUserType] = useState(userTypesData[0]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [expireDate, setExpireDate] = useState(moment().toISOString());
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
            // expireDate,
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
            }
          }
        }
      });
    } catch (e) {
      console.log(e);
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
          <Button onClick={handleSignUpEmployee} style={{marginTop: 16, height: 40}}>
            Створити новий аккаунт
          </Button>
        </form>
      </div>
    </div>
  );
}

export default EditUserPopupBody;