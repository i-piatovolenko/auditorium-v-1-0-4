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
import {useMutation, useQuery} from "@apollo/client";
import {VERIFY_USER} from "../../api/operations/mutations/verifyUser";
import {useNotification} from "../../components/notification/NotificationProvider";
import CountUp from "react-countup";
import {client} from "../../api/client";
import {GET_USER_BY_ID, GET_USERS} from "../../api/operations/queries/users";
import HeaderCheckbox from "../../components/headerCheckBox/HeaderCheckbox";
import Loader from "../../components/loader/Loader";
import VerifyButton from "../admin/users/verifyButton/VerifyButton";

const categories: CategoryType[] = [
  {
    value: 'ALL',
    label: 'Всі',
  },
  {
    value: UserTypes.TEACHER,
    label: 'Викладачі',
  },
  {
    value: UserTypes.STUDENT,
    label: 'Студенти',
  },
  {
    value: UserTypes.POST_GRADUATE,
    label: 'Аситенти/Аспіранти',
  },
  {
    value: UserTypes.CONCERTMASTER,
    label: 'Концертмейстери',
  },
  {
    value: UserTypes.ILLUSTRATOR,
    label: 'Ілюстратори',
  }
];

const listHeader = ['ID', 'П.І.Б.', 'Статус'];

const Users = () => {
  const {data, loading, error} = useQuery(GET_USERS);
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [unverifiedOnly, setUnverifiedOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const {data: {accessRights}} = useLocal('accessRights');
  const [verifyUser] = useMutation(VERIFY_USER);

  const handleClick = (user: User) => {
    dispatchPopupWindow({
      header: <h1>{fullName(user)}</h1>,
      body: <BrowseUserPopupBody user={user}/>,
      footer: !checkVerified(user) && <VerifyButton verify={() => verify(user.id)}/>
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
        } catch (e: any) {
          showNotification(dispatchNotification, ['Помилка!', e.message.slice(0, 100), 'alert']);
        }
      }
    } catch (e: any) {
      showNotification(dispatchNotification, ['Помилка!', e.message.slice(0, 100), 'alert']);
    }
  };

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value.toLowerCase());
  };

  const handleSelectCategory = (e: any) => {
    setCategoryFilter(e.value);
  };

  const user = (user: User) => (
    <>
      <span className={styles.centerText}>{user.id}</span>
      <span onClick={() => handleClick(user)}>
        {fullName(user)}
        {!checkVerified(user) && <span className={styles.unverified}>Не верифіковано</span>}
    </span>
      <span className={styles.userType} style={{backgroundColor: UserTypeColors[user.type as UserTypes]}}>
        {UserTypesUa[user.type as UserTypes]}
      </span>
    </>
  );

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
          options={categories}
          onChange={handleSelectCategory}/>
        <HeaderCheckbox
          label='Тільки неверифіковані'
          checked={unverifiedOnly}
          setChecked={() => setUnverifiedOnly(prevState => !prevState)}
        />
        {accessRights === ACCESS_RIGHTS.ADMIN && <Edit path='/adminUsers'/>}
      </Header>
      {loading ? <Loader/> : data?.users.length ? (
        <DataList header={listHeader} data={data.users
          .filter((user: User) => !user.nameTemp && isAvailableAccess(accessRights, user))
          .filter((user: User) => (fullName(user) + user.id).toLowerCase()
            .includes(searchValue))
          .filter((user: User) => (fullName(user).toLowerCase() + user.id).includes(searchValue.toLowerCase()))
          .filter((user: User) => categoryFilter === 'ALL' ? true : user.type === categoryFilter)
          .filter((user: User) => unverifiedOnly ? user.studentInfo?.accountStatus === StudentAccountStatus.UNVERIFIED : true)
          .map((item: User) => user(item))} gridTemplateColumns={'auto 3fr 200px'}
                  isSearching={isSearching}
        />
      ) : (
        <p>Користувачів не знайдено</p>
      )}
    </>
  );
};

export default Users;

