import React, {useEffect, useState} from 'react';
import Header from '../../../components/header/Header';
import styles from './adminUsers.module.css';
import {User, userTypes, userTypesUa} from "../../../models/models";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import {useNotification} from "../../../components/notification/NotificationProvider";
import {useQuery} from "@apollo/client";
import {GET_USERS} from "../../../api/operations/queries/users";
import {fullName} from "../../../helpers/helpers";
import mainStyles from "../../../styles/main.module.css";
import Select from "react-select";
import {CategoryType, selectStyles} from "../../../styles/selectStyles";
import {useHistory} from "react-router-dom";
import UserProfile from "../../../components/userProfile/UserProfile";
import Add from "../../../components/icons/add/Add";
import Edit from "../../../components/icons/edit/Edit";
import Delete from "../../../components/icons/delete/Delete";

const categories: CategoryType[] = [
  {
    value: 'ALL',
    label: 'Всі',
  },
  {
    value: userTypes.TEACHER,
    label: 'Викладачі'
  },
  {
    value: userTypes.STUDENT,
    label: 'Студенти'
  },
  {
    value: userTypes.POST_GRADUATE,
    label: 'Аистенти/Аспіранти'
  },
  {
    value: userTypes.CONCERTMASTER,
    label: 'Концертмейстери'
  },
  {
    value: userTypes.ILLUSTRATOR,
    label: 'Іллюстратори'
  }
];

const AdminUsers = () => {
  const {data, loading, error} = useQuery(GET_USERS);
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();
  const [searchValue, setSearchValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const history = useHistory();

  const handleCreate = () => {
    dispatchPopupWindow({
      header: <h1>Створити нового користувача</h1>,
      //@ts-ignore
      body: 'test',
      footer: ''
    });
  };

  useEffect(() => {
    setFilteredUsers(data?.users)
  }, [data])

  const handleClick = (user: User) => {
    dispatchPopupWindow({
      header: <h1>{fullName(user)}</h1>,
      body: <UserProfile userId={user.id as number}/>,
    });
  };

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value);
    if (e.target.value) {
      const filter = data.users
        .filter((user: User) => (fullName(user) + user.id).includes(e.target.value));

      setFilteredUsers(filter);
    } else {
      setFilteredUsers(data.users);
    }
  };

  const handleSelectCategory = (e: any) => {
    const filter = data.users.filter((user: User) => user.type === e.value);
    if (e.value !== 'ALL') {
      setFilteredUsers(filter);
    } else {
      setFilteredUsers(data.users);
    }
  }

  return (
    <div>
      <Header>
        <h1>Управління користувачами</h1>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Пошук за П.І.Б або ID"
          className={mainStyles.headerInput}
        />
        <Select
          options={categories}
          defaultValue={categories[0]}
          onChange={handleSelectCategory}
          styles={selectStyles}/>
        <Add onClick={handleCreate}/>
      </Header>
      <div className={styles.wrapper}>
        <ul className={styles.list}>
          <li className={styles.listHeader}>
            <p>ID</p>
            <p>П.І.Б.</p>
            <p>Статус</p>
          </li>
          {filteredUsers && filteredUsers.map((user: User) => <li>
            <p>{user.id}</p>
            <p>{fullName(user)}</p>
            <p>{userTypesUa[user.type as userTypes]}</p>
            <Edit dark/>
            <Delete/>
          </li>)}
        </ul>
      </div>
    </div>
  );
}

export default AdminUsers;