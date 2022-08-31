import React, {FC} from 'react';
import {fullName, getScheduleUnitSize} from "../../helpers/helpers";
import {ActivityTypes, ScheduleUnitType, ScheduleUnitTypeT} from "../../models/models";
import styles from "../../components/scheduleUnit/scheduleUnit.module.css";
import Button from "../../components/button/Button";
import { mappedSchedule } from '../../helpers/scheduleHelpers';

type PropTypes = {
  units: ScheduleUnitType[];
  onClick: (unit: ScheduleUnitType) => void;
  withoutGrid?: boolean;
}

const ScheduleUnitList: FC<PropTypes> = ({units, onClick, withoutGrid = false}) => {
  return (
    <ul
      style={{
        gridTemplateColumns: document.body.clientWidth >= 1024 ? getScheduleUnitSize(units
            .slice()
            .sort(
              (a: ScheduleUnitType, b: ScheduleUnitType) =>
                parseInt(a.from) - parseInt(b.from)
            ))
          : "100%"
      }}
      className={withoutGrid ? styles.scheduleSubRow : styles.scheduleRow}
    >
      {!!units.length && mappedSchedule(units)
        .map((unit: ScheduleUnitType) => (
          <li>
            {unit?.user && (
              <Button
                onClick={() => onClick(unit)}
                color={unit.type === ScheduleUnitTypeT.SUBSTITUTION ? 'orange' : 'blue'}
                style={{
                  height: "2rem",
                  width: "100%",
                  //@ts-ignore
                  // backgroundColor: ActivityTypes[unit.activity],
                  //@ts-ignore
                  border: `1px solid ${ActivityTypes[unit.activity]}`,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={fullName(unit.user, true) + " " + unit.from + " - " + unit.to}
              >
                {fullName(unit.user, true) + " " + unit.from + " - " + unit.to}
              </Button>
            )}
          </li>
        ))}
    </ul>
  );
};

export default ScheduleUnitList;
