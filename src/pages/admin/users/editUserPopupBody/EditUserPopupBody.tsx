import React, {useState} from 'react';
import {User, UserTypes, UserTypesUa} from "../../../../models/models";
import styles from './../../classrooms/createClassroomPopupBody/createClassroomPopupBody.module.css';
import {client} from "../../../../api/client";
import {SIGNUP_EMPLOYEE} from "../../../../api/operations/mutations/signupEmployee";
import moment from "moment";
import {CREATE_USER} from "../../../../api/operations/mutations/createUser";
import {useForm} from "react-hook-form";
import useDepartments from "../../../../hooks/useDepartments";
import useInstruments from "../../../../hooks/useInstruments";
import Select from "react-select";
import {selectLightStyles} from "../../../../styles/selectStyles";
import mainStyles from "../../../../styles/main.module.css";
import Button from "../../../../components/button/Button";

interface PropTypes {
  user: User;
}

const userTypesData = [
  {value: UserTypes.STAFF, label: UserTypesUa.STAFF},
  {value: UserTypes.ILLUSTRATOR, label: UserTypesUa.ILLUSTRATOR},
  {value: UserTypes.CONCERTMASTER, label: UserTypesUa.CONCERTMASTER},
  {value: UserTypes.TEACHER, label: UserTypesUa.TEACHER},
  {value: UserTypes.PIANO_TUNER, label: UserTypesUa.PIANO_TUNER},
  {value: UserTypes.POST_GRADUATE, label: UserTypesUa.POST_GRADUATE},
  {value: UserTypes.STUDENT, label: UserTypesUa.STUDENT},
  {value: UserTypes.OTHER, label: UserTypesUa.OTHER},
  {value: UserTypes.ADMIN, label: UserTypesUa.ADMIN},
];

const EditUserPopupBody: React.FC<PropTypes> = ({user}) => {
  const departmentsData = useDepartments(true);
  const instrumentsData = useInstruments(true);
  const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm();
  const [selectedUserType, setSelectedUserType] = useState(userTypesData[0]);

  const handleSignUpEmployee = async () => {
    try {
      const result = await client.mutate({
        mutation: SIGNUP_EMPLOYEE,
        variables: {
          input: {
            firstName: 'first',
            patronymic: 'patr',
            lastName: 'last',
            type: 'STUDENT',
            expireDate: moment().add(12, 'months').toISOString(),
            department: {
              connect: {
                id: 1
              }
            },
            employeeInfo: undefined
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreateUser = async (data: any) => {
    const {firstName, lastName, patronymic, email, password, phoneNumber, extraPhoneNumbers} = data;
    try {
      const result = await client.mutate({
        mutation: CREATE_USER,
        variables: {
          data: {
            firstName,
            lastName,
            patronymic,
            type: selectedUserType.value,
            email,
            phoneNumber,
            extraPhoneNumbers,
            password
          }
        }
      });
    } catch (e) {

    }
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <form className={styles.container} onSubmit={handleSignUpEmployee}
              id='signUpEmployee'>
          {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
          <label>Прізвище
            <input
              placeholder="Прізвище"
              onChange={(e) => setValue('lastName', e.target.value)}
              {...register("lastName", {required: true})}
            />
          </label>
          <label>Ім'я
            <input
              placeholder="Ім'я"
              onChange={(e) => setValue('firstName', e.target.value)}
              {...register("firstName", {required: true})}
            />
          </label>
          <label>По-батькові
            <input
              placeholder="По-батькові"
              onChange={(e) => setValue('patronymic', e.target.value)}
              {...register("patronymic", {required: true})}
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
          <label>E-mail
            <input
              placeholder="E-mail"
              onChange={(e) => setValue('email', e.target.value)}
              {...register("email", {required: true})}
            />
          </label>
          <label>Password
            <input
              disabled={true}
              placeholder="password"
              defaultValue="password12345"
              {...register("password", {required: true})}
            />
          </label>
          <label>Телефон
            <input
              placeholder="Телефон"
              onChange={(e) => setValue('phoneNumber', e.target.value)}
              {...register("phoneNumber", {required: true})}
            />
          </label>
          <label>Телефон-2
            <input
              placeholder="Телефон-2"
              onChange={(e) => setValue('extraPhoneNumbers', e.target.value)}
              {...register("extraPhoneNumbers", {required: true})}
            />
          </label>
          <Button type='submit' form='signUpEmployee'>Створити співробітника</Button>
        </form>
      </div>
    </div>
  );
}

export default EditUserPopupBody;