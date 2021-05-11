import React, {useEffect, useState} from "react";
import styles from "./registration.module.css";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import eyeIcon from './../../assets/images/eye.svg';
import {useMutation} from "@apollo/client";
import {SIGN_UP} from "../../api/operations/mutations/signUp";
import {selectLightStyles, selectSignupStyles} from "../../styles/selectStyles";
import Select from "react-select";
import {UserTypes, UserTypesUa} from "../../models/models";
import {SelectData} from "../../pages/admin/instruments/models";
import useDepartments from "../../hooks/useDepartments";
import useDegrees from "../../hooks/useDegrees";
import moment from "moment";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object().shape({
  lastName: yup.string().required(),
  firstName: yup.string().required(),
  patronymic: yup.string().required(),
  password: yup.string().required(),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  email: yup.string().email().required(),
  phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  // type: yup.string().required(),
  // department: yup.string().required(),
  // degree: yup.string().required(),
  startYear: yup.number().required(),
});

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {register, handleSubmit, watch, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  });
  const [signup] = useMutation(SIGN_UP)
  const Eye = () => <img className={styles.eye} src={eyeIcon} alt="show" onClick={handleShowPassword}
                   style={{opacity: showPassword ? 1 : .2}}/>;
  const typeOptions = [
    {value: UserTypes.STUDENT, label: UserTypesUa.STUDENT},
    {value: UserTypes.POST_GRADUATE, label: UserTypesUa.POST_GRADUATE},
  ];
  const [selectedType, setSelectedType] = useState<SelectData>(typeOptions[0]);
  const [selectedDepartment, setSelectedDepartment] = useState<SelectData | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<SelectData | null>(null);
  const [departmentsOptions, setDepartmentsOptions] = useState<any>(null);
  const [degreesOptions, setDegreesOptions] = useState<any>(null);
  const departments = useDepartments(true);
  const degrees = useDegrees(true);

  useEffect(() => {
      setDepartmentsOptions(departments.map(item => ({value: item.id, label: item.name})));
  }, [departments]);

  useEffect(() => {
    setDegreesOptions(degrees.map(item => ({value: item.id, label: item.name})));
  }, [degrees]);

  useEffect(() => {
    setSelectedDepartment(departmentsOptions?.[0]);
  }, [departmentsOptions]);

  useEffect(() => {
    setSelectedDegree(degreesOptions?.[0]);
  }, [degreesOptions])

  const handleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const onSubmit = async (e: any) => {
    try {
    await signup({ variables: {
      input: {
          lastName: e.lastName,
          firstName: e.firstName,
          patronymic: e.patronymic,
          password: e.password,
          email: e.email,
          phoneNumber: e.phoneNumber,
          type: selectedType.value,
          departmentId: 1,
          // selectedDepartment?.label,
          // degree: {id: 1},
          // selectedDegree?.label,
          startYear: e.startYear,
        }}});
    } catch (e) {

    }
  }

  return (
    <form className={styles.registration} onSubmit={handleSubmit(onSubmit)} id="signupForm">
      <div className={styles.inputGroup}>
        <label>Прізвище<input
          className={styles.customInput}
          id="lastName"
          {...register("lastName")}
        /></label>
        {errors.lastName && <div className={styles.inputError}><p>{errors.lastName.message}</p></div>}
      </div>
      <div className={styles.inputGroup}>
        <label>Ім'я<input
          className={styles.customInput}
          id="firstName"
          {...register("firstName")}
        /></label>
        {errors.firstName && <div className={styles.inputError}><p>{errors.firstName.message}</p></div>}
      </div>
      <div className={styles.inputGroup}>
        <label>По-батькові<input
          className={styles.customInput}
          id="patronymic"
          {...register("patronymic")}
        /></label>
        {errors.patronymic && <div className={styles.inputError}><p>{errors.patronymic.message}</p></div>}
      </div>
      <div></div>
      <div className={styles.inputGroup}>
        <label>Пароль<input
          type={showPassword ? 'text' : 'password'}
          className={styles.customInput}
          id="password"
          {...register("password")}
        /></label><Eye/>
        {errors.password && <div className={styles.inputError}><p>{errors.password.message}</p></div>}
      </div>
      <div className={styles.inputGroup}>
        <label>Повторіть пароль<input
          type={showPassword ? 'text' : 'password'}
          className={styles.customInput}
          id="confirmPassword"
          {...register("confirmPassword")}
        /></label><Eye/>
        {errors.confirmPassword && <div className={styles.inputError}><p>{errors.confirmPassword.message}</p></div>}
      </div>
      <div className={styles.inputGroup}>
        <label>E-mail<input
          className={styles.customInput}
          id="email"
          {...register("email")}
        /></label>
        {errors.email && <div className={styles.inputError}><p>{errors.email.message}</p></div>}
      </div>
      <div className={styles.inputGroup}>
        <label>Телефон<input
          className={styles.customInput}
          id="phoneNumber"
          {...register("phoneNumber")}
        /></label>
        {errors.phoneNumber && <div className={styles.inputError}><p>{errors.phoneNumber.message}</p></div>}
      </div>
      <div className={styles.inputGroup}>
        <label>Статус
          <Select options={typeOptions} styles={selectSignupStyles} menuPortalTarget={document.body}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e as SelectData)}
          />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label>Кафедра
          <Select options={departmentsOptions} styles={selectSignupStyles} menuPortalTarget={document.body}
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e as SelectData)}
          />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label>Навч. ступінь
          <Select options={degreesOptions} styles={selectSignupStyles} menuPortalTarget={document.body}
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e as SelectData)}
          />
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label>Рік початку<input
          className={styles.customInput}
          id="startYear"
          type="number"
          min={+(moment().format('YYYY'))-5}
          max={+moment().format('YYYY')}
          defaultValue={+moment().format('YYYY')}
          {...register("startYear")}
        /></label>
        {errors.startYear && <div className={styles.inputError}><p>{errors.startYear.message}</p></div>}
      </div>
    </form>
  );
};

export default Registration;
