import React, {useEffect, useState} from "react";
import styles from "./sidebar.module.css";
import Logo from "../../logo/Logo";
import {NavLink, Route, Switch} from "react-router-dom";
import menuIcon from "../../../assets/images/menu.svg";
import classroomsIcon from "../../../assets/images/classrooms.svg";
import registryIcon from "../../../assets/images/registry.svg";
import usersIcon from "../../../assets/images/users.svg";
import controlIcon from "../../../assets/images/settings.svg";
import queueIcon from "../../../assets/images/queue.png";
import {useQuery} from "@apollo/client";
import {GET_USERS} from "../../../api/operations/queries/users";
import {StudentAccountStatus, User, UserTypes} from "../../../models/models";
import Button from "../../button/Button";
import {usePopupWindow} from "../../popupWindow/PopupWindowProvider";
import {client} from "../../../api/client";
import {DISABLE_DISPATCHER} from "../../../api/operations/mutations/disableDispatcher";
import {useNotification} from "../../notification/NotificationProvider";
import {DISPATCHER_STATUS} from "../../../api/operations/queries/dispatcherActive";
import {handleLogout} from "../../../helpers/logout";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();
  const [isDispatcher, setIsDispatcher] = useState(false);
  const {data} = useQuery(GET_USERS);
  const [unverifiedCounter, setUnverifiedCounter] = useState(0);
  const {data: dispatcherActive, loading, error} = useQuery(DISPATCHER_STATUS);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsDispatcher(user.type === UserTypes.DISPATCHER);
    }
  }, []);

  useEffect(() => {
    if (isDispatcher && !loading && !error) {
      setIsActive(dispatcherActive.dispatcherActive);
    }
  }, [data, loading, error, isDispatcher]);

  useEffect(() => {
    setUnverifiedCounter(0);
    if (data) {
      data.users.forEach(({studentInfo}: User) => {
        studentInfo?.accountStatus === StudentAccountStatus.UNVERIFIED
        && setUnverifiedCounter(prevState => prevState + 1);
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

  const FinishFooter = ({dispatch}: any) => {
    const handleCancel = () => dispatch({type: "POP_POPUP_WINDOW"});
    const handleOk = async () => {
      try {
        const result = await client.mutate({
          mutation: DISABLE_DISPATCHER
        });
        if (result.data.disableDispatcher.userErrors.length) {
          result.data.disableDispatcher.userErrors.forEach(({message}: any) => {
            dispatchNotification({
              header: "Помилка",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "Успішно!",
            message: `Робочий день закінчено`,
            type: "ok",
          });
          dispatch({type: "POP_POPUP_WINDOW"});
          setIsActive(false);
        }
      } catch (e: any) {
        dispatchNotification({
          header: "Помилка",
          message: JSON.stringify(e),
          type: "alert",
        });
      }
    };

    return (
      <>
        <Button
          color='blue'
          style={{marginRight: 8, height: 40}}
          onClick={handleCancel}
        >
          Відміна
        </Button>
        <Button
          color='red'
          onClick={handleOk}
        >
          Завершити роботу
        </Button>
      </>
    )
  }

  const handleFinishClick = () => {
    dispatchPopupWindow({
      header: <h1>Ви дійсно бажаєте завершити роботу?</h1>,
      body: <p>Цю дію неможливо буде відмінити</p>,
      footer: <FinishFooter/>
    });
  }

  return (
    <div
      className={[styles[collapsed.toString()], styles.navigation].join(" ")}
    >
      {isDispatcher && !isActive && (
        <div className={styles.dispatcherInactive}>
          <h1 className={styles.dayFinishedTitle}>Робочий день закінчено</h1>
          <Button color='red' onClick={handleLogout}>Вийти з аккаунту</Button>
        </div>
      )}
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
          <Route exact path="/classrooms">
            Аудиторії
          </Route>
          <Route exact path="/queue">
            Черга
          </Route>
          <Route exact path="/registry">
            Журнал
          </Route>
          {/*<Route exact path="/schedule">*/}
          {/*  Розклад*/}
          {/*</Route>*/}
          <Route exact path="/users">
            Користувачі
          </Route>
          <Route exact path="/profile">
            Мій профіль
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
            className={styles.link}
            onClick={onClick}
            to="/classrooms"
          >
            <img className={styles.icon} src={classroomsIcon} alt="classrooms"/>
            Аудиторії
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/queue"
          >
            {/*TODO change PNG icon to SVG*/}
            <img className={styles.icon} src={queueIcon} alt="queue"/>
            Черга
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/registry"
          >
            <img className={styles.icon} src={registryIcon} alt="registry"/>
            Журнал
          </NavLink>
        </li>
        {/*<li>*/}
        {/*  <NavLink*/}
        {/*    activeClassName={styles.linkActive}*/}
        {/*    className={styles.link}*/}
        {/*    onClick={onClick}*/}
        {/*    to="/schedule"*/}
        {/*  >*/}
        {/*    <img className={styles.icon} src={scheduleIcon} alt="schedule" />*/}
        {/*    Розклад*/}
        {/*  </NavLink>*/}
        {/*</li>*/}
        <li>
          {unverifiedCounter !== 0 && <span className={styles.alert}>!</span>}
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/users"
          >
            <img className={styles.icon} src={usersIcon} alt="users"/>
            Користувачі
          </NavLink>
        </li>
        {/*<li>*/}
        {/*  <NavLink*/}
        {/*    activeClassName={styles.linkActive}*/}
        {/*    className={styles.link}*/}
        {/*    onClick={onClick}*/}
        {/*    to="/profile"*/}
        {/*  >*/}
        {/*    <img className={styles.icon} src={profileIcon} alt="profile" />*/}
        {/*    Мій профіль*/}
        {/*  </NavLink>*/}
        {/*</li>*/}
        <li>
          <NavLink
            activeClassName={styles.linkActive}
            className={styles.link}
            onClick={onClick}
            to="/admin"
          >
            <img className={[styles.icon, styles.settings].join(' ')} src={controlIcon} alt="control"/>
            Налаштування
          </NavLink>
        </li>
      </ul>
      {isDispatcher && (
        <div
          className={collapsed ? styles.finishButtonWrapperCollapsed : styles.finishButtonWrapper}
          title='Закінчити роботу'
        >
          <Button onClick={handleFinishClick}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" fill='#fff'
                 x="0px" y="0px"
                 viewBox="0 0 32 32">
              <path d="M30.9,13.6c-0.1-0.1-0.1-0.2-0.2-0.3l-4-4c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l2.3,2.3H22v-3V3c0-0.6-0.4-1-1-1H4
              c0,0,0,0,0,0C3.9,2,3.7,2,3.6,2.1c0,0,0,0-0.1,0c0,0-0.1,0-0.1,0.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0,0,0C3.2,2.4,3.1,2.5,3.1,2.6
              c0,0,0,0,0,0.1C3,2.8,3,2.9,3,3v22c0,0.4,0.2,0.8,0.6,0.9l9,4C12.7,30,12.9,30,13,30c0.2,0,0.4-0.1,0.5-0.2c0.3-0.2,0.5-0.5,0.5-0.8
              v-3h7c0.6,0,1-0.4,1-1V15h5.6l-2.3,2.3c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l4-4c0.1-0.1,0.2-0.2,0.2-0.3
              C31,14.1,31,13.9,30.9,13.6z M10,21c0,0.6-0.4,1-1,1s-1-0.4-1-1v-4c0-0.6,0.4-1,1-1s1,0.4,1,1V21z M20,10v14h-6V7
              c0-0.4-0.2-0.8-0.6-0.9L8.7,4H20V10z"/>
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
