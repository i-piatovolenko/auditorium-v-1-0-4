import React, {useEffect, useState} from "react";
import styles from "./sidebar.module.css";
import Logo from "../../logo/Logo";
import { NavLink, Route, Switch } from "react-router-dom";
import menuIcon from "../../../assets/images/menu.svg";
import homeIcon from "../../../assets/images/home.svg";
import classroomsIcon from "../../../assets/images/classrooms.svg";
import registryIcon from "../../../assets/images/registry.svg";
import scheduleIcon from "../../../assets/images/schedule.svg";
import profileIcon from "../../../assets/images/profile.svg";
import usersIcon from "../../../assets/images/users.svg";
import controlIcon from "../../../assets/images/settings.svg";
import {useQuery} from "@apollo/client";
import {GET_USERS} from "../../../api/operations/queries/users";
import {User} from "../../../models/models";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {data} = useQuery(GET_USERS);
  const [unverifiedCounter, setUnverifiedCounter] = useState(0);

  useEffect(() => {
    setUnverifiedCounter(0);
    if (data) {
      data.users.forEach((user: User) => {
        !user.verified && setUnverifiedCounter(prevState => prevState+1);
      });
    }
  }, [data]);

  const onMenuClick = () => setCollapsed((prevState) => !prevState);

  const onClick = () => {
    const screenWidth = window.screen.width;

    setCollapsed((prevState) => {
      if (screenWidth < 1024) {
        return !prevState;
      } else {
        return prevState;
      }
    });
  }

  return (
    <div
      className={[styles[collapsed.toString()], styles.navigation].join(" ")}
    >
      <div onClick={onMenuClick} className={styles.logoWrapper}>
        <Logo
          title={collapsed ? "Au" : "Auditorium"}
          description="Система управління видачею аудиторій"
          size="small"
        />
      </div>
      <img
        onClick={onMenuClick}
        className={styles.menuIcon}
        src={menuIcon}
        alt="menu"
      />
      <p className={styles.currentPageName}>
        <Switch>
          <Route exact path="/">
            Головна
          </Route>
          <Route exact path="/classrooms">
            Аудиторії
          </Route>
          <Route exact path="/registry">
            Журнал
          </Route>
          <Route exact path="/schedule">
            Розклад
          </Route>
          <Route exact path="/users">
            Користувачі
          </Route>
          <Route exact path="/profile">
            Профіль
          </Route>
          <Route exact path="/admin">
            Налаштування
          </Route>
        </Switch>
      </p>
      <ul>
        <li>
          <NavLink
            activeClassName={styles.linkActive}
            exact
            className={styles.link}
            onClick={onClick}
            to="/"
          >
            <img className={styles.icon} src={homeIcon} alt="home" />
            Головна
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/classrooms"
          >
            <img className={styles.icon} src={classroomsIcon} alt="classrooms" />
            Аудиторії
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/registry"
          >
            <img className={styles.icon} src={registryIcon} alt="registry" />
            Журнал
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/schedule"
          >
            <img className={styles.icon} src={scheduleIcon} alt="schedule" />
            Розклад
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/users"
          >
            <img className={styles.icon} src={usersIcon} alt="users" />
            Користувачі
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/profile"
          >
            <img className={styles.icon} src={profileIcon} alt="profile" />
            Профіль
          </NavLink>
        </li>
        <li>
          {unverifiedCounter !== 0 && <span className={styles.alert}>!</span>}
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/admin"
          >
            <img className={[styles.icon, styles.settings].join(' ')} src={controlIcon} alt="control" />
            Налаштування
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
