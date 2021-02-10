import React, { ChangeEvent, FormEvent, useState } from "react";
import styles from "./occupantRegistration.module.css";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../../../api/operations/queries/users";
import {
  OccupiedInfo,
  User,
  userTypes,
  userTypesUa,
} from "../../../models/models";
import { fullName, typeStyle } from "../../../helpers/helpers";
import Button from "../../button/Button";

interface PropTypes {
  dispatchNotification: (value: string) => void;
}

const OccupantRegistration: React.FC<PropTypes> = ({
  dispatchNotification,
}) => {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const { data, loading, error } = useQuery(GET_USERS);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatchNotification(value);
  };

  return (
    <div>
      <form
        id="userSearchForm"
        className={styles.userSearch}
        onSubmit={handleSubmit}
      >
        <label htmlFor="usersSearch">
          Введіть П.І.Б або персональний номер
        </label>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          name="usersSearch"
          id="usersSearch"
          list="users"
        />
        <datalist id="users">
          {!loading &&
            !error &&
            data.users.map((user: User) => (
              <option value={user.id} label={fullName(user)} />
            ))}
        </datalist>
      </form>
      <div className={styles.userCard}>
        <div className={styles.occupantName}>
          <div className={styles.icon} />
          <p>
            {value.search(/[0-9]/) === -1
              ? value
              : fullName(
                  data.users.find((user: User) => user.id === parseInt(value))
                )}
          </p>
        </div>
        <p className={styles.occupantType}>
          {value.search(/[0-9]/) === -1
            ? ""
            : userTypesUa[
                data.users.find((user: User) => user.id === parseInt(value))
                  .type as userTypes
              ]}
        </p>
      </div>
    </div>
  );
};

export default OccupantRegistration;
