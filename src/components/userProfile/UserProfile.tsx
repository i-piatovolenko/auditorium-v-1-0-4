import React from "react";
import styles from "./userProfile.module.css";
import {useQuery} from "@apollo/client";
import {GET_USER_BY_ID} from "../../api/operations/queries/users";
import Title from "../title/Title";
import {UserTypes, UserTypesUa} from "../../models/models";
import Button from "../button/Button";
import moment from "moment";

interface PropTypes {
  userId: number;
}

const NO_EMAIL = 'No email';
const NO_PHONE_NUMBER = 'No phone number';

const UserProfile: React.FC<PropTypes> = ({userId}) => {
  const {data, loading, error} = useQuery(GET_USER_BY_ID, {
    variables: {
      where: {
        id: userId,
      }
    },
  });

  if (!loading && !error)
    return (
      <div>
        <Title title="Персональний номер"/>
        <p>{data.user.id}</p>
        <Title title="Статус"/>
        <p>{UserTypesUa[data.user.type as UserTypes]}</p>
        {data.user.department && (
          <>
            <Title title="Кафедра"/>
            <p>{data.user.department.name}</p>
          </>
        )}
        <Title title="E-mail"/>
        <p>
          <Button disabled={data.user.email === NO_EMAIL}>
            <a className={styles.link} href={`mailto:${data.user.email}`}>
              {data.user.email === NO_EMAIL ? 'Немає даних' : data.user.email}
            </a>
          </Button>
        </p>
        <Title title="Телефон"/>
        <p>
          <Button disabled={data.user.phoneNumber === NO_PHONE_NUMBER}>
            <a className={styles.link} href={`tel:${data.user.phoneNumber}`}>
              {data.user.phoneNumber === NO_PHONE_NUMBER ? 'Немає даних' : data.user.phoneNumber}
            </a>
          </Button>
        </p>
      </div>
    );
  return <p>Loading...</p>;
};

export default UserProfile;
