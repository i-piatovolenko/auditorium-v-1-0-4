import React, {useEffect, useState} from "react";
import styles from "./login.module.css";
import Logo from "../../components/logo/Logo";
import CustomInput from "../../components/customInput/CustomInput";
import Button from "../../components/button/Button";
import {useNotification} from "../../components/notification/NotificationProvider";
import {useMutation} from "@apollo/client";
import {LOGIN} from "../../api/operations/mutations/login";
import {ErrorCodes, ErrorCodesUa, UserTypes} from "../../models/models";
import {isLoggedVar} from "../../api/client";
import {useHistory} from "react-router-dom";
import {setAccessRights} from "../../helpers/helpers";

const Login = () => {
  const dispatchNotification = useNotification();
  const [login] = useMutation(LOGIN);
  const [disabled, setDisabled] = useState(true);
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (loginValue.length && passwordValue.length) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [loginValue, passwordValue]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let result: any;

    if (e.target.login.value && e.target.password.value) {
      try {
        result = await login({
          variables: {
            input: {
              email: e.target.login.value,
              password: e.target.password.value
            }
          }
        });
        if (result?.data.login.userErrors?.length) {
          localStorage.removeItem('token')
          dispatchNotification({
            header: 'Помилка!',
            message: ErrorCodesUa[result?.data.login.userErrors[0].code as ErrorCodes],
            type: 'alert'
          });
        } else {
          const user = result?.data.login.user;
          const token = result?.data.login.token;

          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          dispatchNotification({
            header: 'Вітаємо!',
            message: 'Авторизація успішна!',
            type: 'ok'
          });
          isLoggedVar(true);
          setAccessRights(user);
          if (user.type === UserTypes.ADMIN || user.type === UserTypes.DISPATCHER) {
            history.push('/classrooms');
          }
          else {
            history.push('/dashboard')
          }
        }
      } catch (e) {
        dispatchNotification({
          header: 'Помилка!',
          message: e.message,
          type: 'alert'
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'login') {
      setLoginValue(e.target.value);
    } else {
      setPasswordValue(e.target.value);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <Logo
          title="Auditorium"
          description="Система управління видачею аудиторій"
        />
        <div>
          <p className={styles.loginTip}>
            Увійдіть в систему або зареєструйтесь
          </p>
          <form className={styles.loginForm} onSubmit={handleSubmit} id="loginForm">
            <CustomInput
              label="Логін:"
              name="login"
              id="login"
              placeholder="Наприклад: aud1@knmau.ua"
              value={loginValue}
              onChange={handleChange}
            />
            <CustomInput
              label="Пароль:"
              name="password"
              id="password"
              withEyeSwitcher
              value={passwordValue}
              onChange={handleChange}
            />
            <Button type={"submit"} disabled={disabled} form='loginForm' color="blue"
                    style={{marginTop: 32, height: 42}}
            >
              Увійти
            </Button>
          </form>
        </div>
        <footer className={styles.loginFooter}>
          <a href="#">
            Національна Музична Академія України ім. П. і. Чайковського
          </a>
          <p>
            Auditorium &copy; 2021 | v 1.4.2 Ivan Piatovolenko & Vladislav
            Nazarenko
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
