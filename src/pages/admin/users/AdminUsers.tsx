import React, {useEffect, useState} from 'react';
import Header from '../../../components/header/Header';
import styles from './adminUsers.module.css';
import {ACCESS_RIGHTS, StudentAccountStatus, User, UserTypes, UserTypesUa} from "../../../models/models";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import {useNotification} from "../../../components/notification/NotificationProvider";
import {useMutation, useQuery} from "@apollo/client";
import {GET_USERS} from "../../../api/operations/queries/users";
import {checkVerified, fullName, showNotification} from "../../../helpers/helpers";
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
import {VERIFY_USER} from "../../../api/operations/mutations/verifyUser";
import {useLocal} from "../../../hooks/useLocal";
import EditUserPopupBody from "./editUserPopupBody/EditUserPopupBody";
import {client} from "../../../api/client";
import {DELETE_USER} from "../../../api/operations/mutations/deleteUser";

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
  const [listData, setListData] = useState<any[]>([]);
  const [verifyUser] = useMutation(VERIFY_USER);
  const {data: {accessRights}} = useLocal('accessRights');
  const user = (user: User) => <>
    <span className={styles.alignText}>{user.id}</span>
    <span>{fullName(user)}</span>
    <span>{user.studentInfo?.accountStatus === StudentAccountStatus.UNVERIFIED && (
      <Button color='red' onClick={() => verify(user.id)}>Верифікувати</Button>
    )}
    </span>
    <span className={styles.alignText}>{UserTypesUa[user.type as UserTypes]}</span>
    {accessRights === ACCESS_RIGHTS.ADMIN && <Delete onClick={() => handleDelete(user.id)}/>}
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

  const handleErrorDetails = (e: any) => {
    dispatchPopupWindow({
      header: <h1>{e.name}</h1>,
      body: <>
        <p>{e.message}</p>
        <p>{e.extraInfo}</p>
        <pre>{e.stack}</pre>
      </>,
      footer: ''
    });
  };

  const handleDelete = async (userId: number) => {
    const confirmDelete = window.confirm('Ви дійсно бажаєте видалити всі дані про користувача?')
    if (confirmDelete) {
      try {
        const result = await client.mutate({
          mutation: DELETE_USER,
          variables: {
            where: {
              id: userId
            }
          }
        });
        dispatchNotification({
          header: "Успішно!",
          message: `Користувача видалено.`,
          type: "ok",
        });
      } catch (e) {
        console.log(e);
        dispatchNotification({
          header: "Помилка!",
          message: <><span>Щось пішло не так.</span><br/>
            <span style={{color: '#2b5dff', cursor: 'pointer', textDecoration: 'underline'}}
                  onClick={() => handleErrorDetails && handleErrorDetails(e)}>Деталі</span></>,
          type: "alert",
        });
      }
    }
  };

  const handleCreate = (user: User) => {
    dispatchPopupWindow({
      header: <h1>Створити новий аккаунт співробітника</h1>,
      //@ts-ignore
      body: <EditUserPopupBody user={user} dispatchNotification={dispatchNotification}
                               dispatchPopupWindow={dispatchPopupWindow}/>,
      footer: null
    });
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
      if (result.data.verifyUser.userErrors.length) {
        result.data.verifyUser.userErrors.forEach(({message}: any) => {
          showNotification(dispatchNotification, ['Помилка!', message, 'alert']);
        })
      } else {
        showNotification(dispatchNotification, ['Успішно!', 'Користувача верифіковано', 'ok']);
      }

    } catch (e) {
      showNotification(dispatchNotification, ['Помилка!', e.message.slice(0, 100), 'alert']);
    }
  };

  const handleItemClick = (id: number) => {
    const user = data.users?.find((item: User) => item.id === id);

    dispatchPopupWindow({
      header: <h1>{fullName(user)}</h1>,
      body: <BrowseUserPopupBody user={user}/>,
      footer: !checkVerified(user) && <Button onClick={() => verify(user.id)}>Верифікувати</Button>
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
        {accessRights === ACCESS_RIGHTS.ADMIN && <Add onClick={handleCreate}/>}
      </Header>
      <DataList header={listHeader} data={listData} handleItemClick={handleItemClick}
                gridTemplateColumns='40px 1fr 100px 200px 40px 40px'/>
    </div>
  );
}

export default AdminUsers;