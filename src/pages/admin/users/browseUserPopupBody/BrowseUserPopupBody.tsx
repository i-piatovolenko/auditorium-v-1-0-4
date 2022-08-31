import React from 'react';
import styles from "./browseUserPopupBody.module.css";
import {
  EmploymentTypes,
  EmploymentTypesUa,
  StudentAccountStatus,
  User,
  UserTypes,
  UserTypesUa
} from "../../../../models/models";
import {fullName} from "../../../../helpers/helpers";
import Title from "../../../../components/title/Title";
import moment from "moment";

interface PropTypes {
  user: User;
};

const BrowseUserPopupBody: React.FC<PropTypes> = ({user}) => {
  return (
    <div>
      {user.studentInfo?.accountStatus === StudentAccountStatus.UNVERIFIED && <div className={styles.verification}>
          <h2>Користувача не верифіковано!</h2>
          <p>Перед верифікацією користувача звірте правильність даних з офіційном документом.</p>
      </div>}
      <div className={styles.list}>
        {!!user.queueInfo.sanctionedUntil && (
          <p className={styles.sanctioned}>
            Під санкціями до {moment(user.queueInfo.sanctionedUntil).format('DD-MM-YYYY HH:mm')}
          </p>
        )}
        <div><span>ID: </span><span>{user.id}</span></div>
        <div><span>Прізвище: </span><span>{user?.lastName || '-'}</span></div>
        <div><span>Ім'я: </span><span>{user?.firstName || '-'}</span></div>
        <div><span>По-батькові: </span><span>{user?.patronymic || '-'}</span></div>
        <div><span>Статус: </span><span>{UserTypesUa[user.type as UserTypes]}</span></div>
        {user.expireDate && (
          <div>
            <span>
              Термін дії акаунту:
            </span>
            <span>
              {moment(user.expireDate).format('DD.MM.YYYY')}
            </span>
          </div>
        )}
        {user.studentInfo && <div><span>Ступінь: </span><span>{user.studentInfo.degree.name}</span></div>}
        {user.employeeInfo && <div><span>Зайнятість: </span>
            <span>{EmploymentTypesUa[user.employeeInfo.employmentType as EmploymentTypes]}</span></div>}
        <div><span>Кафедра: </span><span>{user.department ? user.department.name : 'Немає'}</span></div>
        <div><span>E-mail: </span><span>{user.email}</span></div>
        <div><span>Тел.: </span><span>{user.phoneNumber}</span></div>
        {user?.extraPhoneNumbers && <div><span>Інші тел.: </span>
            <ul>{JSON.parse(user.extraPhoneNumbers).map((item: string) => <li>{item}</li>)}</ul>
        </div>}
      </div>
    </div>
  );
}

export default BrowseUserPopupBody;