import React from "react";
import styles from "./scheduleUnit.module.css";
import { useQuery } from "@apollo/client";
import { GET_SCHEDULE_UNIT } from "../../api/operations/queries/schedule";
import {fullName, getScheduleUnitSize} from "../../helpers/helpers";
import {ActivityTypes, ScheduleUnitType} from "../../models/models";
import Button from "../button/Button";
import {usePopupWindow} from "../popupWindow/PopupWindowProvider";
import UserProfile from "../userProfile/UserProfile";
import moment from "moment";

interface PropTypes {
  classroomName: string;
}

const ScheduleUnit: React.FC<PropTypes> = ({ classroomName }) => {

  const { data, loading, error } = useQuery(GET_SCHEDULE_UNIT, {
    variables: {
      classroomName: classroomName,
      date: moment().toISOString(),
    },
  });

  const dispatchPopupWindow = usePopupWindow();

  const handleClick = (unit: ScheduleUnitType) => {
    dispatchPopupWindow({
      header: <h1>{fullName(unit.user)}</h1>,
      body: <UserProfile userId={unit.user.id as number}/>,
    });
  };

  if (!loading && !error)
    return (
      <ul
        style={{
          gridTemplateColumns: document.body.clientWidth >= 1024 ? getScheduleUnitSize(
            data.schedule
              .slice()
              .sort(
                (a: ScheduleUnitType, b: ScheduleUnitType) =>
                  parseInt(a.from) - parseInt(b.from)
              ),
            false
          ):"1fr"
        }}
        className={styles.scheduleRow}
      >
        {data.schedule
          .slice()
          .sort(
            (a: ScheduleUnitType, b: ScheduleUnitType) =>
              parseInt(a.from) - parseInt(b.from)
          )
          .map((unit: ScheduleUnitType) => (
            <li>
              <Button
                onClick={() => handleClick(unit)}
                style={{
                  height: "2rem",
                  width: "100%",
                //@ts-ignore
                  backgroundColor: ActivityTypes[unit.activity],
                  //@ts-ignore
                  border: `1px solid ${ActivityTypes[unit.activity]}`
                }}
              >
                {unit.from + " - " + unit.to + " " + fullName(unit.user, true)}
              </Button>
            </li>
          ))}
      </ul>
    );
  return <p></p>;
};

export default ScheduleUnit;
