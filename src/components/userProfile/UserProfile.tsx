import React from "react";
import styles from "./userProfile.module.css";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../../api/operations/queries/users";
import Title from "../title/Title";
import {ACCESS_RIGHTS, UserTypes, UserTypesUa} from "../../models/models";
import Button from "../button/Button";
import {useLocal} from "../../hooks/useLocal";

interface PropTypes {
  userId: number;
}

const UserProfile: React.FC<PropTypes> = ({ userId }) => {
  const {data: {accessRights}} = useLocal('accessRights');
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: {
      where: {
        id: userId,
      }
    },
  });
  const isNoAccess = (): boolean => accessRights === ACCESS_RIGHTS.USER && (
    data.user.type !== UserTypes.TEACHER
    || data.user.type !== UserTypes.ILLUSTRATOR
    || data.user.type === UserTypes.CONCERTMASTER);

  if (!loading && !error)
    return (
      <div>
        <Title title="Персональний номер" />
        <p>{data.user.id}</p>
        <Title title="Статус" />
        <p>{UserTypesUa[data.user.type as UserTypes]}</p>
        <Title title="Кафедра" />
        <p>{data.user.department}</p>
        <Title title="E-mail" />
        <p>
          <Button disabled={isNoAccess()}>
            {isNoAccess() ? 'Інформація прихована'
              : <a className={styles.link} href={`mailto:${data.user.email}`}>
              {data.user.email}
            </a>}
          </Button>
        </p>
        <Title title="Телефон" />
        <p>
          <Button disabled={isNoAccess()}>
            {isNoAccess() ? 'Інформація прихована'
            : <a className={styles.link} href={`tel:${data.user.phoneNumber}`}>
              {data.user.phoneNumber}
            </a>}
          </Button>
        </p>
      </div>
    );
  return <p>Loading...</p>;
};

export default UserProfile;
