import React, {FC} from 'react';
import styles from './scheduleUnitRow.module.css';
import {WORKING_DAY_END, WORKING_DAY_START} from "../../../../helpers/constants";
import {ScheduleUnitType} from "../../../../models/models";
import {fullName} from "../../../../helpers/helpers";
import moment from "moment";
import {usePopupWindow} from "../../../../components/popupWindow/PopupWindowProvider";
import {useNotification} from "../../../../components/notification/NotificationProvider";
import ScheduleUnitPopup from "../scheduleUnitPopup/ScheduleUnitPopup";

type PropTypes = {
  units: ScheduleUnitType[];
}

const DAY_LENGTH_MIN = (WORKING_DAY_END - WORKING_DAY_START) * 60;
const FULL_DAY_LENGTH_MIN = 24 * 60;
const COLUMN_HEIGHT = +((365 * 2) / 7).toFixed(0)
const hours = new Array(24).fill(true, WORKING_DAY_START, WORKING_DAY_END)
  .map((item, index) => item ? index : false).filter(item => item);
const daysAmount = new Array(COLUMN_HEIGHT).fill(null);

const ScheduleUnitRow: FC<PropTypes> = ({units}) => {
  const now = moment();
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();

  const handleClick = (unit: ScheduleUnitType) => {
    dispatchPopupWindow({
      header: <ScheduleUnitPopup.Header title={fullName(unit.user)}/>,
      body: <ScheduleUnitPopup.Body unit={unit} dispatchPopupWindow={dispatchPopupWindow} allUnits={units}/>,
      footer: <ScheduleUnitPopup.Footer/>,
    });
  };

  return (
    <div className={styles.wrapper}>
      <ul className={styles.dates}>
        {daysAmount.map((_, index) => {
          if ((index % 7)) return <li>{moment().add(index * 6, 'days').format('DD.MM.YYYY')}</li>
          return null;
        })}
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
          top: vertStart < 0 ? vertStart * 20 : 0
        };

        return (
          <div
            className={styles.unit}
            style={cssStyles}
            onClick={() => handleClick(unit as ScheduleUnitType)}
          >
            <span>{fullName(user, true)} | </span>
            <span>{from} - {to} | </span>
            <span>{moment(dateStart).format('DD.MM.YY')} - {moment(dateEnd).format('DD.MM.YY')}</span>
          </div>
        )
      })}
    </div>
  );
};

export default ScheduleUnitRow;
