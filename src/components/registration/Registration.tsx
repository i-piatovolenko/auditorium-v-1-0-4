import React, {useState} from "react";
import styles from "./registration.module.css";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import eyeIcon from './../../assets/images/eye.svg';
import {useMutation} from "@apollo/client";
import {SIGN_UP} from "../../api/operations/mutations/signUp";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object().shape({
  lastName: yup.string().required(),
  firstName: yup.string().required(),
  patronymic: yup.string().required(),
  password: yup.string().required(),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  email: yup.string().email().required(),
  phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  type: yup.string().required(),
  department: yup.string().required(),
  degree: yup.string().required(),
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

  const handleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const onSubmit = (e: any) => {
    signup({ variables: {

      }})
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
    </form>
  );
};

export default Registration;
