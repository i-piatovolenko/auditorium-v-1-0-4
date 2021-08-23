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
        <div><span>ID: </span><span>{user.id}</span></div>
        <div><span>П.І.Б.: </span><span>{fullName(user)}</span></div>
        <div><span>Статус: </span><span>{UserTypesUa[user.type as UserTypes]}</span></div>
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