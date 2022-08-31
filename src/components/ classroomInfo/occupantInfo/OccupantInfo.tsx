import React from "react";
import styles from "./occupantInfo.module.css";
import {
  OccupiedInfo,
  OccupiedStateUa,
  UserTypes,
  UserTypesUa,
} from "../../../models/models";
import Title from "../../title/Title";
import {fullName, typeStyle} from "../../../helpers/helpers";
import {usePopupWindow} from "../../popupWindow/PopupWindowProvider";
import UserProfile from "../../userProfile/UserProfile";

interface PropTypes {
  occupied: OccupiedInfo;
}

const OccupantInfo: React.FC<PropTypes> = ({occupied}) => {
  const dispatchPopupWindow = usePopupWindow();

  const onClick = () => {
    dispatchPopupWindow({
      header: <h1>{fullName(occupied?.user)}</h1>,
      body: <UserProfile userId={occupied?.user?.id}/>,
    });
  };

  return (
    <>
      <Title title="Ким зайнято"/>
      <div onClick={onClick} className={styles.occupantCard}>
        <div className={styles.occupantName}>
          <div className={styles.icon}/>
          <p>{fullName(occupied?.user)}</p>
        </div>
        <p
          style={typeStyle(occupied)}
          className={styles.occupantType}
        >
          {UserTypesUa[occupied?.user?.type as UserTypes]}
        </p>
        <p className={styles.state}>
          Статус: {OccupiedStateUa[occupied?.state].toLowerCase()}
        </p>
        {/*TODO schedule time left*/}
        {/*<p className={styles.occupiedUntil}>*/}
        {/*  Зайнято до {getTimeHHMM(new Date(occupied?.until))}*/}
        {/*</p>*/}
      </div>
    </>
  );
};

export default OccupantInfo;