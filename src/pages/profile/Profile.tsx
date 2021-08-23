import React, {useState} from "react";
import styles from "./profile.module.css";
import Header from "../../components/header/Header";
import useUsers from "../../hooks/useUsers";
import {StudentAccountStatus, User, UserTypes, UserTypesUa} from "../../models/models";
import {fullName} from "../../helpers/helpers";
import Button from "../../components/button/Button";
import {isLoggedVar} from "../../api/client";
import {useHistory} from "react-router-dom";
import {useMe} from "../../hooks/useMe";
import Edit from "../../components/icons/edit/Edit";

const Profile = () => {
  const me = useMe();
  const history = useHistory();
  const [editMode, setEditMode] = useState(false);

  const handleLogout = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Ви бажаете вийти?')) {
      isLoggedVar(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      history.push('/');
    }
  };

  const handleEdit = () => {

  };

  return (
    <div>
      <Header>
        <h1>Мій профіль</h1>
        <Button color='red' onClick={handleLogout}>Вийти</Button>
        {!editMode && <Edit onClick={handleEdit}/>}
      </Header>
      <div className={styles.wrapper}>
        {me && <div className={styles.profileData}>
            <div><span>П.І.Б.:</span><span>{fullName(me)}</span></div>
            <div><span>ID:</span><span>{me.id}</span></div>
          {me.studentInfo.accountStatus === StudentAccountStatus.UNVERIFIED && <div><span>Верифіковано:</span><span>Ні</span></div>}
            <div><span>Тип:</span><span>{UserTypesUa[me.type as UserTypes]}</span></div>
          {me.department && <div><span>Кафедра:</span><span>{me.department.name}</span></div>}
            <div><span>Тел.:</span><span>{me.phoneNumber}</span></div>
          {me.extraPhoneNumbers && <div><span>Інші тел.:</span><span>
                <ul>
                  {JSON.parse(me.extraPhoneNumbers as string).map((item: string) => (<li>{item}</li>))}
                </ul>
            </span></div>}
            <div><span>Дата закінчення</span><span>{me.expireDate}</span></div>
            <div><span>Email:</span><span>{me.email}</span></div>
        </div>}
      </div>
    </div>
  );
};

export default Profile;
