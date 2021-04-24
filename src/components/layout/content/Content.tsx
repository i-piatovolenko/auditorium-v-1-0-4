import React from "react";
import styles from "./content.module.css";
import Home from "../../../pages/home/Home";
import { Route, Switch } from "react-router-dom";
import Registry from "../../../pages/registry/Registry";
import Schedule from "../../../pages/schedule/Schedule";
import Users from "../../../pages/users/Users";
import Profile from "../../../pages/profile/Profile";
import AdminClassrooms from "../../../admin/pages/classrooms/AdminClassrooms";
import AdminUsers from "../../../admin/pages/users/AdminUsers";
import Admin from "../../../admin/pages/admin/Admin";
import Classrooms from "../../../pages/classrooms/Classrooms";
import AdminInstruments from "../../../admin/pages/instruments/AdminInstruments";
import AdminDepartments from "../../../admin/pages/departments/AdminDepartments";
import AdminFaculties from "../../../admin/pages/faculties/AdminFaculties";
import AdminDegrees from "../../../admin/pages/degrees/AdminDegrees";

const Content = () => {
  return (
    <div className={styles.content}>
      <Switch>
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
      </Switch>
    </div>
  );
};

export default Content;
