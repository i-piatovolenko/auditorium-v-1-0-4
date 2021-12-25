import React, {useState} from "react";
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
import {useLocal} from "../../hooks/useLocal";
import {isAvailableAccess} from "./helpers/helpers";
import BrowseUserPopupBody from "../admin/users/browseUserPopupBody/BrowseUserPopupBody";
import Button from "../../components/button/Button";
import {useMutation, useQuery} from "@apollo/client";
import {VERIFY_USER} from "../../api/operations/mutations/verifyUser";
import {useNotification} from "../../components/notification/NotificationProvider";
import {client} from "../../api/client";
import {GET_USERS} from "../../api/operations/queries/users";
import HeaderCheckbox from "../../components/headerCheckBox/HeaderCheckbox";
import Loader from "../../components/loader/Loader";
import VerifyButton from "../admin/users/verifyButton/VerifyButton";
import CompleteEmployeeAccountPopupBody from "./completeEmployeeAccount/CompleteEmployeeAccountPopupBody";
import moment from "moment";
import {UPDATE_USER} from "../../api/operations/mutations/updateUser";
import handleOperation from "../../helpers/handleOperation";

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
  const [cancelSanctionsMutation] = useMutation(UPDATE_USER);

  const handleComplete = (userId: number) => {
    dispatchPopupWindow({
      header: <h1>Видати акаунт співробітнику</h1>,
      body: <CompleteEmployeeAccountPopupBody dispatchNotification={dispatchNotification} userId={userId} />,
      footer: (
        <Button
          form='completeEmployeeAccount'
          type='submit'
        >
          Підтвердити
        </Button>
      ),
    });
  };

  const CancelSanctionsFooter = ({dispatch, userId}: any) => (
    <div className={styles.cancelSanctionFooter}>
      <Button color='red' onClick={() => dispatch({type: 'POP_POPUP_WINDOW'})}>Ні</Button>
      <Button onClick={() => confirmCancelSanctions(dispatch, userId)}>Так</Button>
    </div>
  )

  const cancelSanctions = (userId: number) => {
    dispatchPopupWindow({
      header: <h1>Ви дійсно бажаєте зняти санкції?</h1>,
      body: <></>,
      footer: <CancelSanctionsFooter userId={userId}/>
    })
  };

  const confirmCancelSanctions = async (dispatch: any, userId: number) => {
    try {
      const result = cancelSanctionsMutation({
        variables: {
          where: {
            id: userId
          },
          data: {
            queueInfo: {
              update: {
                sanctionedUntil: {
                  set: null
                }
              }
            }
          }
        },
      });
      handleOperation(result, 'updateOneUser', dispatchNotification, dispatch, 'Санкції успішно знято!');
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = (user: User) => {
    dispatchPopupWindow({
      header: <h1>{fullName(user)}</h1>,
      body: <BrowseUserPopupBody user={user}/>,
      footer: !!user.queueInfo.sanctionedUntil ? (
        <Button onClick={() => cancelSanctions(user.id)}>
          Зняти санкції
        </Button>
        )
        : !!user?.studentInfo ? !checkVerified(user) && (
        <VerifyButton
          verify={() => verify(user.id)}
          dispatchPopupWindow={dispatchPopupWindow}
          dispatchNotification={dispatchNotification}
          userId={user.id}
        />
      ) : !user.employeeInfo.isInUsage ? (
        <Button onClick={() => handleComplete(user.id)}>
          Видати акаунт
        </Button>
      ) : null
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
        {!!user.queueInfo.sanctionedUntil && <span className={styles.sanctioned}>
            Під санкціями до {moment(user.queueInfo.sanctionedUntil).format('DD-MM-YYYY HH:mm')}
        </span>}
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
        <Edit path='/adminUsers'/>
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

