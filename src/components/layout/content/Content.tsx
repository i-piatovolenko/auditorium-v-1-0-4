import React from "react";
import styles from "./content.module.css";
import {Redirect, Route, Switch} from "react-router-dom";
import Registry from "../../../pages/registry/Registry";
import Schedule from "../../../pages/schedule/Schedule";
import Users from "../../../pages/users/Users";
import Profile from "../../../pages/profile/Profile";
import AdminClassrooms from "../../../pages/admin/classrooms/AdminClassrooms";
import AdminUsers from "../../../pages/admin/users/AdminUsers";
import Admin from "../../../pages/admin/admin/Admin";
import Classrooms from "../../../pages/classrooms/Classrooms";
import AdminInstruments from "../../../pages/admin/instruments/AdminInstruments";
import AdminDepartments from "../../../pages/admin/departments/AdminDepartments";
import AdminFaculties from "../../../pages/admin/faculties/AdminFaculties";
import AdminDegrees from "../../../pages/admin/degrees/AdminDegrees";
import Login from "../../../pages/login/Login";
import Dashboard from "../../../pages/dashboard/Dashboard";
import Queue from "../../../pages/queue/Queue";
import {User, UserTypes} from "../../../models/models";
import DispatcherSettings from "../../../pages/admin/dispatcherSettings/DispatcherSettings";
import AdminSchedule from "../../../pages/admin/schedule/AdminSchedule";
import AdminScheduleClassroom from "../../../pages/admin/schedule/AdminScheduleClassroom";
import ErrorHandler from "../../errorHandler/ErrorHandler";

interface PropTypes {
  isLogged: boolean;
}

const Content: React.FC<PropTypes> = ({isLogged}) => {
  const user: User = JSON.parse(localStorage.getItem('user'));

  return (
    <div className={styles.content}>
      {!isLogged
        ? (
          <Switch>
            <ErrorHandler>
              <Route path="/" component={Login}/>
            </ErrorHandler>
          </Switch>
        )

        : user && (user.type === UserTypes.ADMIN || user.type === UserTypes.DISPATCHER) ? (
          <Switch>
            <ErrorHandler>
              <Route exact path="/" component={Classrooms}/>
              <Route path="/classrooms/:classroomName?" component={Classrooms}/>
              <Route path="/registry/:userId?" component={Registry}/>
              <Route path="/schedule" component={Schedule}/>
              <Route path="/users:userId?" component={Users}/>
              <Route path="/profile" component={Profile}/>
              <Route path="/admin" component={Admin}/>
              <Route path="/adminClassrooms" component={AdminClassrooms}/>
              <Route path="/adminUsers" component={AdminUsers}/>
              <Route path="/adminInstruments" component={AdminInstruments}/>
              <Route path="/adminDepartments" component={AdminDepartments}/>
              <Route path="/adminFaculties" component={AdminFaculties}/>
              <Route path="/adminDegrees" component={AdminDegrees}/>
              <Route exact path="/adminSchedule" component={AdminSchedule}/>
              <Route path="/adminSchedule/classroom/:classroomName?" component={AdminScheduleClassroom}/>
              <Route path="/dashboard" component={Dashboard}/>
              <Route path="/queue" component={Queue}/>
              <Route path="/dispatcherSettings" component={DispatcherSettings}/>
            </ErrorHandler>
          </Switch>
        ) : (
          <Switch>
            <Route path="/dashboard" component={Dashboard}/>
          </Switch>
        )}
    </div>
  );
};

export default Content;
