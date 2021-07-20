import React from "react";
import styles from "./content.module.css";
import Home from "../../../pages/home/Home";
import { Route, Switch } from "react-router-dom";
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

interface PropTypes {
  isLogged: boolean;
}

const Content: React.FC<PropTypes> = ({isLogged}) => {

  return (
    <div className={styles.content}>
      {!isLogged
      ? <Switch>
          <Route path="/" component={Login} />
        </Switch>
      : <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/classrooms/:classroomName?" component={Classrooms} />
        <Route path="/registry/:userId?" component={Registry} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/users:userId?" component={Users} />
        <Route path="/profile" component={Profile} />
        <Route path="/admin" component={Admin} />
        <Route path="/adminClassrooms" component={AdminClassrooms} />
        <Route path="/adminUsers" component={AdminUsers} />
        <Route path="/adminInstruments" component={AdminInstruments} />
        <Route path="/adminDepartments" component={AdminDepartments} />
        <Route path="/adminFaculties" component={AdminFaculties} />
        <Route path="/adminDegrees" component={AdminDegrees} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
      }
    </div>
  );
};

export default Content;
