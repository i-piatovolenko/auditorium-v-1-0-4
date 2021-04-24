import React, {useEffect, useState} from "react";
import styles from "./admin.module.css";
import mainStyles from '../../../styles/main.module.css';
import Header from "../../../components/header/Header";
import { NavLink } from "react-router-dom";
import Button from "../../../components/button/Button";

const Admin = () => {
  const serverURL = localStorage.getItem('serverURL');
  const [value, setValue] = useState('');

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
        <li><NavLink to='/adminUsers'>Користувачі</NavLink></li>
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