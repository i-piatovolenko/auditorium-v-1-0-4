import React, {useEffect, useState} from 'react';
import Header from '../../../components/header/Header';
import styles from './adminUsers.module.css';
import {User, UserTypes, UserTypesUa} from "../../../models/models";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import {useNotification} from "../../../components/notification/NotificationProvider";
import {useMutation, useQuery} from "@apollo/client";
import {GET_USERS} from "../../../api/operations/queries/users";
import {fullName, showNotification} from "../../../helpers/helpers";
import mainStyles from "../../../styles/main.module.css";
import Select from "react-select";
import {CategoryType, selectStyles} from "../../../styles/selectStyles";
import {useHistory} from "react-router-dom";
import UserProfile from "../../../components/userProfile/UserProfile";
import Add from "../../../components/icons/add/Add";
import Edit from "../../../components/icons/edit/Edit";
import Delete from "../../../components/icons/delete/Delete";
import DataList from "../../../components/dataList/DataList";
import BrowseUserPopupBody from "./browseUserPopupBody/BrowseUserPopupBody";
import Button from "../../../components/button/Button";
import EditUserPopupBody from "../admin/editUserPopupBody/EditUserPopupBody";
import {VERIFY_USER} from "../../../api/operations/mutations/verifyUser";

const categories: CategoryType[] = [
  {
    value: 'ALL',
    label: 'Всі',
  },
  {
    value: UserTypes.TEACHER,
    label: 'Викладачі'
  },
  {
    value: UserTypes.STUDENT,
    label: 'Студенти'
  },
  {
    value: UserTypes.POST_GRADUATE,
    label: 'Аистенти/Аспіранти'
  },
  {
    value: UserTypes.CONCERTMASTER,
    label: 'Концертмейстери'
  },
  {
    value: UserTypes.ILLUSTRATOR,
    label: 'Іллюстратори'
  }
];

const listHeader = ['ID', 'П.І.Б.', '', 'Статус']

const AdminUsers = () => {
  const {data, loading, error} = useQuery(GET_USERS);
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();
  const [searchValue, setSearchValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const history = useHistory();
  const [listData, setListData] = useState<any[]>([]);
  const [verifyUser] = useMutation(VERIFY_USER);
  const user = (item: User) => <>
    <span className={styles.alignText}>{item.id}</span>
    <span>{fullName(item)}</span>
    <span>{item.verified
      ? ''
      : <Button color='red' onClick={() => handleCreate(item)}>Верифікувати</Button>}
    </span>
    <span className={styles.alignText}>{UserTypesUa[item.type as UserTypes]}</span>
    <Edit dark onClick={() => handleCreate(item)}/>
    <Delete onClick={() => handleDelete()}/>
  </>;

  useEffect(() => {
    setFilteredUsers(data?.users)
  }, [data]);

  useEffect(() => {
    setListData(filteredUsers?.map(item => user(item)));
  }, [filteredUsers]);

  const handleClick = (user: User) => {
    dispatchPopupWindow({
      header: <h1>{fullName(user)}</h1>,
      body: <UserProfile userId={user.id as number}/>,
    });
  };

  const handleDelete = () => {

  };

  const handleCreate = (user: User) => {
    // dispatchPopupWindow({
    //   header: <h1>Створити нового користувача</h1>,
    //   //@ts-ignore
    //   body: <EditUserPopupBody user={user}/>,
    //   footer: ''
    // });
  };

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value);
    if (e.target.value) {
      const filter = data.users
        .filter((user: User) => (fullName(user).toLowerCase() + user.id)
          .includes(e.target.value.toLowerCase()));

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

  const verify = async (userId: number) => {
    try {
      const result = await verifyUser({variables: {input: {userId}}});
      showNotification(dispatchNotification, ['Успішно!', 'Користувача верифіковано', 'ok']);
    } catch (e) {
      showNotification(dispatchNotification, ['Помилка!', e.message.slice(0, 100), 'alert']);
    }
  };

  const handleItemClick = (id: number) => {
    const user = data.users?.find((item: User) => item.id === id);

    dispatchPopupWindow({
      header: <h1>{fullName(user)}</h1>,
      body: <BrowseUserPopupBody user={user}/>,
      footer: !user.verified && <Button onClick={() => verify(user.id)}>Верифікувати</Button>
    });
  };

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
      <DataList header={listHeader} data={listData} handleItemClick={handleItemClick}
                gridTemplateColumns='40px 1fr 100px 200px 40px 40px'/>
    </div>
  );
}

export default AdminUsers;