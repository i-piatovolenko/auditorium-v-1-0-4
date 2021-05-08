import React, {useEffect, useState} from "react";
import styles from "./admin.module.css";
import mainStyles from '../../../styles/main.module.css';
import Header from "../../../components/header/Header";
import { NavLink } from "react-router-dom";
import Button from "../../../components/button/Button";
import {useQuery} from "@apollo/client";
import {GET_USERS} from "../../../api/operations/queries/users";
import {User} from "../../../models/models";
import CountUp from "react-countup";

const Admin = () => {
  const serverURL = localStorage.getItem('serverURL');
  const [value, setValue] = useState('');
  const {data, loading, error} = useQuery(GET_USERS);
  const [unverifiedCounter, setUnverifiedCounter] = useState(0);

  useEffect(() => {
    setUnverifiedCounter(0);
    if (data) {
      data.users.forEach((user: User) => {
        !user.verified && setUnverifiedCounter(prevState => prevState+1);
      });
    }
  }, [data]);

  useEffect(() => {
    if (serverURL) {
      setValue(serverURL);
    } else {
      setValue('http://localhost:4000/');
      localStorage.setItem('serverURL', value);
    }
  }, [serverURL]);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    localStorage.setItem('serverURL', value);
  };

  return (
    <div>
      <Header><h1>Налаштування</h1></Header>
      <ul className={styles.list}>
        <li><NavLink to='/adminClassrooms'>Аудиторії</NavLink></li>
        <li><NavLink to='/adminUsers'>Користувачі
          {unverifiedCounter !== 0 && <span className={styles.unverified} title="Неверифіковані">
            <CountUp end={unverifiedCounter} duration={1}/></span>}
        </NavLink></li>
        <li><NavLink to='/adminInstruments'>Інструменти</NavLink></li>
        <li><NavLink to='/adminDepartments'>Кафедри</NavLink></li>
        <li><NavLink to='/adminFaculties'>Факультети</NavLink></li>
        <li><NavLink to='/adminDegrees'>Навчальні ступені</NavLink></li>
        <li><NavLink to='/adminSchedule'>Розклад</NavLink></li>
      </ul>
      <div className={styles.settings}>
      <label className={styles.serverURL}>
        Server URL:
        <input type="text" className={mainStyles.input} value={value as string} onChange={handleChange}/>
      </label>
      <Button onClick={handleSubmit}>Змінити</Button>
      </div>
    </div>
  );
};

export default Admin;