import React, {useEffect, useState} from "react";
import styles from "./users.module.css";
import mainStyles from "./../../styles/main.module.css";
import Header from "../../components/header/Header";
import {User, userTypeColors, userTypes, userTypesUa} from "../../models/models";
import {fullName} from "../../helpers/helpers";
import {usePopupWindow} from "../../components/popupWindow/PopupWindowProvider";
import UserProfile from "../../components/userProfile/UserProfile";
import {CategoryType} from "../../styles/selectStyles";
import Edit from "../../components/icons/edit/Edit";
import HeaderSelect from "../../components/headerSelect/HeaderSelect";
import DataList from "../../components/dataList/DataList";
import useUsers from "../../hooks/useUsers";

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

const listHeader = ['ID', 'П.І.Б.', 'Статус'];

const Users = () => {
  const users = useUsers();
  const dispatchPopupWindow = usePopupWindow();
  const [searchValue, setSearchValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleClick = (user: User) => {
    dispatchPopupWindow({
      header: <h1>{fullName(user)}</h1>,
      body: <UserProfile userId={user.id as number}/>,
    });
  };

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value);
    if (e.target.value) {
      const filter = users
        .filter((user: User) => (fullName(user) + user.id).includes(e.target.value));

      setFilteredUsers(filter);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleSelectCategory = (e: any) => {
    const filter = users.filter((user: User) => user.type === e.value);
    if (e.value !== 'ALL') {
      setFilteredUsers(filter);
    } else {
      setFilteredUsers(users);
    }
  };

  const listData = filteredUsers?.map((user: User) => <>
      <span>{user.id}</span>
      <span onClick={() => handleClick(user)}>{fullName(user)}</span>
      <span className={styles.userType} style={{backgroundColor: userTypeColors[user.type as userTypes]}}>
        {userTypesUa[user.type as userTypes]}
      </span>
    </>);

  return (
    <>
      <Header>
        <h1>Користувачі</h1>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Пошук за П.І.Б або ID"
          className={mainStyles.headerInput}
        />
        <HeaderSelect options={categories} onChange={handleSelectCategory}/>
        <Edit path='/adminUsers'/>
      </Header>
      <DataList header={listHeader} data={listData} gridTemplateColumns={'20px 3fr 200px'}/>
    </>
  );
};

export default Users;
