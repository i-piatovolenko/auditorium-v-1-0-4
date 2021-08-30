import React, {useEffect, useState} from "react";
import styles from "./admin.module.css";
import Header from "../../../components/header/Header";
import {NavLink, useHistory} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_USERS} from "../../../api/operations/queries/users";
import {ACCESS_RIGHTS, StudentAccountStatus, User} from "../../../models/models";
import CountUp from "react-countup";
import {useLocal} from "../../../hooks/useLocal";
import Button from "../../../components/button/Button";
import {client, isLoggedVar} from "../../../api/client";
import {handleLogout} from "../../../helpers/logout";

const Admin = () => {
    const {data, loading, error} = useQuery(GET_USERS);
    const [unverifiedCounter, setUnverifiedCounter] = useState(0);
    const {data: {accessRights}} = useLocal('accessRights');
    const history = useHistory();

    useEffect(() => {
      setUnverifiedCounter(0);
      if (data) {
        data.users.forEach(({studentInfo}: User) => {
          studentInfo?.accountStatus === StudentAccountStatus.UNVERIFIED
          && setUnverifiedCounter(prevState => prevState + 1);
        });
      }
    }, [data]);

    return (
      <div>
        <Header><h1>Налаштування</h1></Header>
        <ul className={styles.list}>
          {accessRights === ACCESS_RIGHTS.ADMIN && <li><NavLink to='/adminClassrooms'>Аудиторії</NavLink>
          </li>}
          <li><NavLink to='/adminUsers'>Користувачі
            {unverifiedCounter !== 0 && <span className={styles.unverified} title="Неверифіковані">
            <CountUp end={unverifiedCounter} duration={1}/></span>}
          </NavLink></li>
          {accessRights === ACCESS_RIGHTS.ADMIN && <>
              <li><NavLink to='/adminInstruments'>Інструменти</NavLink></li>
              <li><NavLink to='/adminDepartments'>Кафедри</NavLink></li>
              <li><NavLink to='/adminFaculties'>Факультети</NavLink></li>
              <li><NavLink to='/adminDegrees'>Навчальні ступені</NavLink></li>
            {/*<li><NavLink to='/adminSchedule'>Розклад</NavLink></li>*/}
          </>}
        </ul>
        <div className={styles.settings}>
          <Button onClick={handleLogout}>Вийти з профілю</Button>
        </div>
      </div>
    );
  }
;

export default Admin;