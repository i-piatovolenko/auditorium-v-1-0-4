import React, {useEffect, useState} from "react";
import styles from "./users.module.css";
import mainStyles from "./../../styles/main.module.css";
import Header from "../../components/header/Header";
import {ACCESS_RIGHTS, StudentAccountStatus, User, UserTypeColors, UserTypes, UserTypesUa} from "../../models/models";
import {checkVerified, fullName, showNotification} from "../../helpers/helpers";
import {usePopupWindow} from "../../components/popupWindow/PopupWindowProvider";
import {CategoryType} from "../../styles/selectStyles";
import Edit from "../../components/icons/edit/Edit";
import HeaderSelect from "../../components/headerSelect/HeaderSelect";
import DataList from "../../components/dataList/DataList";
import useUsers from "../../hooks/useUsers";
import {useLocal} from "../../hooks/useLocal";
import {isAvailableAccess} from "./helpers/helpers";
import BrowseUserPopupBody from "../admin/users/browseUserPopupBody/BrowseUserPopupBody";
import Button from "../../components/button/Button";
import {useMutation} from "@apollo/client";
import {VERIFY_USER} from "../../api/operations/mutations/verifyUser";
import {useNotification} from "../../components/notification/NotificationProvider";
import CountUp from "react-countup";
import {client} from "../../api/client";
import {GET_USER_BY_ID, GET_USERS} from "../../api/operations/queries/users";

const categories: CategoryType[] = [
  {
    value: 'ALL',
    label: 'Всі',
    accessRights: ACCESS_RIGHTS.USER
  },
  {
    value: UserTypes.TEACHER,
    label: 'Викладачі',
    accessRights: ACCESS_RIGHTS.USER
  },
  {
    value: UserTypes.STUDENT,
    label: 'Студенти',
    accessRights: ACCESS_RIGHTS.DISPATCHER
  },
  {
    value: UserTypes.POST_GRADUATE,
    label: 'Аситенти/Аспіранти',
    accessRights: ACCESS_RIGHTS.DISPATCHER
  },
  {
    value: UserTypes.CONCERTMASTER,
    label: 'Концертмейстери',
    accessRights: ACCESS_RIGHTS.USER
  },
  {
    value: UserTypes.ILLUSTRATOR,
    label: 'Ілюстратори',
    accessRights: ACCESS_RIGHTS.USER
  }
];

const listHeader = ['ID', 'П.І.Б.', 'Статус'];

const Users = () => {
  const users = useUsers();
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();
  const [searchValue, setSearchValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [isSearching, setIsSearching] = useState(false);
  const {data: {accessRights}} = useLocal('accessRights');
  const [verifyUser] = useMutation(VERIFY_USER);

  useEffect(() => {
    const onlyExisting = users.filter(user => !user.nameTemp && isAvailableAccess(accessRights, user));
    setFilteredUsers(onlyExisting.slice().sort((a: User, b: User) => a.id - b.id));
  }, [users]);

  const handleClick = (user: User) => {
    dispatchPopupWindow({
      header: <h1>{fullName(user)}</h1>,
      body: <BrowseUserPopupBody user={user}/>,
      footer: !checkVerified(user) && <Button onClick={() => verify(user.id)}>Верифікувати</Button>
    });
  };

  const verify = async (userId: number) => {
    try {
      const result = await verifyUser({variables: {input: {userId}}});
      if (result.data.verifyUser.userErrors.length) {
        result.data.verifyUser.userErrors.forEach(({message}: any) => {
          showNotification(dispatchNotification, ['Помилка!', message, 'alert']);
        })
      } else {
        showNotification(dispatchNotification, ['Успішно!', 'Користувача верифіковано', 'ok']);
        try {
          await client.query({
            query: GET_USERS,
            fetchPolicy: 'network-only'
          })
        } catch (e) {
          showNotification(dispatchNotification, ['Помилка!', e.message.slice(0, 100), 'alert']);
        }
      }
    } catch (e) {
      showNotification(dispatchNotification, ['Помилка!', e.message.slice(0, 100), 'alert']);
    }
  };

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value.toLowerCase());
    if (e.target.value) {
      const filter = users.filter(user => !user.nameTemp && isAvailableAccess(accessRights, user))
        .filter((user: User) => (fullName(user) + user.id).toLowerCase()
          .includes(e.target.value.toLowerCase()));

      setFilteredUsers(filter);
      setIsSearching(true);
    } else {
      setFilteredUsers(users.filter((user: User) => isAvailableAccess(accessRights, user)));
      setIsSearching(false);
    }
  };

  const handleSelectCategory = (e: any) => {
    const filter = users.filter((user: User) => user.type === e.value
      && isAvailableAccess(accessRights, user));
    if (e.value !== 'ALL') {
      setFilteredUsers(filter);
    } else {
      setFilteredUsers(users.filter((user: User) => isAvailableAccess(accessRights, user)));
    }
  };

  const listData = filteredUsers?.map((user: User) => <>
    <span className={styles.centerText}>{user.id}</span>
    <span onClick={() => handleClick(user)}>
        {fullName(user)}
      {!checkVerified(user) && <span className={styles.unverified}>Не верифіковано</span>}
    </span>
    <span className={styles.userType} style={{backgroundColor: UserTypeColors[user.type as UserTypes]}}>
        {UserTypesUa[user.type as UserTypes]}
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
        <HeaderSelect
          options={categories
            .filter((item) => (item.accessRights as ACCESS_RIGHTS) <= accessRights)}
          onChange={handleSelectCategory}/>
        {accessRights === ACCESS_RIGHTS.ADMIN && <Edit path='/adminUsers'/>}
      </Header>
      <DataList header={listHeader} data={listData} gridTemplateColumns={'auto 3fr 200px'}
                isSearching={isSearching}/>
    </>
  );
};

export default Users;
function useDispatch() {
    throw new Error("Function not implemented.");
}

