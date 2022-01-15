import React, {FC, useRef} from 'react';
import styles from './scheduleUnitRow.module.css';
import {ScheduleUnitType, ScheduleUnitTypeT} from "../../../../models/models";
import {fullName} from "../../../../helpers/helpers";
import moment from "moment";
import {usePopupWindow} from "../../../../components/popupWindow/PopupWindowProvider";
import {useNotification} from "../../../../components/notification/NotificationProvider";
import ScheduleUnitPopup from "../scheduleUnitPopup/ScheduleUnitPopup";

type PropTypes = {
  units: ScheduleUnitType[];
  classroomName: string;
  selectedDay: number;
  refetch: () => void;
}

const FULL_DAY_LENGTH_MIN = 24 * 60;
const COLUMN_HEIGHT = +((365 * 2) / 7).toFixed(0)
const daysAmount = new Array(COLUMN_HEIGHT).fill(null);

const ScheduleUnitRow: FC<PropTypes> = ({units, classroomName, selectedDay, refetch}) => {
  const now = moment();
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();

  const handleClick = (unit: ScheduleUnitType) => {
    const isSubstitution = unit.type === ScheduleUnitTypeT.SUBSTITUTION;
    const primary = isSubstitution ? units.find(({id}) => unit.primaryScheduleUnit.id === id) : null;
    dispatchPopupWindow({
      header: <ScheduleUnitPopup.Header title={fullName(unit.user)}/>,
      body: (
        <ScheduleUnitPopup.Body
          unit={unit}
          dispatchPopupWindow={dispatchPopupWindow}
          dispatchNotification={dispatchNotification}
          allUnits={isSubstitution ? null : units}
          selectedDay={selectedDay}
          classroomName={classroomName}
          primaryUnit={primary}
          refetch={refetch}
        />
      ),
      footer: <ScheduleUnitPopup.Footer/>,
    });
  };

  return (
    <div className={styles.wrapper}>
      <ul className={styles.dates}>
        {daysAmount.map((_, index) => index % 7 ? (
          <li>
            {moment().add(index * 6, 'days').format('DD.MM.YYYY')}
          </li>
        ) : null)}
      </ul>
      {units.map((unit) => {
        const {from, to, user, dateStart, dateEnd} = unit;
        const fromMinutes = (+from.split(':')[0] * 60) + +from.split(':')[1];
        const toMinutes = (+to.split(':')[0] * 60) + +to.split(':')[1];
        const startPos = fromMinutes / (FULL_DAY_LENGTH_MIN / 100);
        const width = (toMinutes - fromMinutes) / (FULL_DAY_LENGTH_MIN / 100);
        const amountOfWeeks = moment(dateEnd).diff(moment(dateStart), 'weeks');
        const vertStart = moment(now).diff(dateStart, 'weeks');

        const cssStyles = {
          left: `${startPos}%`,
          width: `${width}%`,
          height: 20 * (amountOfWeeks - vertStart),
          top: vertStart < 0 ? -(vertStart * 20) : 0,
          backgroundColor: unit.type === ScheduleUnitTypeT.PRIMARY ? '#00a6ff' : '#ff8c00',
          zIndex: unit.type === ScheduleUnitTypeT.PRIMARY ? 1 : 2,
        };

        return (
          <div
            className={styles.unit}
            style={cssStyles}
            onClick={() => handleClick(unit as ScheduleUnitType)}
          >
            <span>{fullName(user, true)} | {from} - {to} | {moment(dateStart).format('DD.MM.YY')} - {moment(dateEnd).format('DD.MM.YY')}</span>
          </div>
        )
      })}
    </div>
  );
};

export default ScheduleUnitRow;
