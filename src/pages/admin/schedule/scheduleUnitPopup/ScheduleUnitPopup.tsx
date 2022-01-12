import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import {ScheduleUnitType, ScheduleUnitTypeT} from "../../../../models/models";
import {fullName} from "../../../../helpers/helpers";
import Select from "react-select";
import useUsers from "../../../../hooks/useUsers";
import editIcon from '../../../../assets/images/edit.svg';
import addIcon from '../../../../assets/images/addLined.svg';
import removeIcon from '../../../../assets/images/delete.svg';
import styles from './scheduleUnitPopup.module.css';
import moment from "moment";
import Button from "../../../../components/button/Button";
import {hasUnitDateTimeIntersection} from "../../../../helpers/scheduleHelpers";

type HeaderPropTypes = {
  title: string
}

type BodyPropTypes = {
  unit?: ScheduleUnitType;
  allUnits?: ScheduleUnitType[];
  dispatchPopupWindow: (config: any) => void;
  dispatch?: (config: { type: string }) => void;
}

const ScheduleUnitPopupHeader: FC<HeaderPropTypes> = ({title}) => {
  return <h1>{title}</h1>
};

const ScheduleUnitPopupBody: FC<BodyPropTypes> = ({unit, dispatchPopupWindow, allUnits, dispatch}) => {
  const [editMode, setEditMode] = useState(false);
  const [selectUserData, setSelectUserdata] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const selectTypesData = [
    {value: Object.keys(ScheduleUnitTypeT)[0], label: ScheduleUnitTypeT.INDIVIDUAL_LESSON},
    {value: Object.keys(ScheduleUnitTypeT)[1], label: ScheduleUnitTypeT.LECTURE}
  ];
  const [selectedType, setSelectedType] = useState(selectTypesData[0]);
  const users = useUsers();
  const [dateError, setDateError] = useState(null);
  const [dateStart, setDateStart] = useState(moment(unit?.dateStart).format('YYYY-MM-DD'));
  const [dateEnd, setDateEnd] = useState(moment(unit?.dateEnd).format('YYYY-MM-DD'));
  const [timeFrom, setTimeFrom] = useState(unit?.from || moment().format('HH:mm'));
  const [timeTo, setTimeTo] = useState(unit?.to || moment().format('HH:mm'));

  useEffect(() => {
    if (users?.length) {
      const mappedUsers = users.map(user => ({value: String(user.id), label: fullName(user)}));
      setSelectUserdata(mappedUsers);
      if (unit) {
        const selected = mappedUsers.find(({value}) => unit.user.id === +value);
        setSelectedUser(selected);
        const typeIndex = selectTypesData.findIndex(t => t.value === unit.activity);
        setSelectedType(selectTypesData[typeIndex]);
      }
    }
  }, [users]);

  useEffect(() => {
    const isError = hasUnitDateTimeIntersection(dateStart, unit?.id || -1, allUnits, timeFrom, timeTo)
      || hasUnitDateTimeIntersection(dateEnd, unit?.id || -1, allUnits, timeTo, timeTo);
    setDateError(isError);
  }, []);

  const handleSelectUser = (e: any) => {
    setSelectedUser(e);
  };

  const handleSelectType = (e: any) => {
    setSelectedType(e);
  };

  const handleDateStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateStart(e.target.value);
    setDateError(hasUnitDateTimeIntersection(e.target.value, unit?.id || -1, allUnits, timeFrom, timeTo));
  };

  const handleDateEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateEnd(e.target.value);
    setDateError(hasUnitDateTimeIntersection(e.target.value, unit?.id || -1, allUnits, timeFrom, timeTo));
  };

  const handleFromTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeFrom(e.target.value);
    const isError = hasUnitDateTimeIntersection(dateStart, unit?.id || -1, allUnits, e.target.value, timeTo)
      || hasUnitDateTimeIntersection(dateEnd, unit?.id || -1, allUnits, e.target.value, timeTo);
    setDateError(isError);
  };
  const handleToTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeTo(e.target.value);
    const isError = hasUnitDateTimeIntersection(dateStart, unit?.id || -1, allUnits, timeFrom, e.target.value)
      || hasUnitDateTimeIntersection(dateEnd, unit?.id || -1, allUnits, timeFrom, e.target.value);
    setDateError(isError);
  };

  const handleCreateUnit = () => {
    dispatchPopupWindow({
      header: <ScheduleUnitPopupHeader title='Створити новий відрізок'/>,
      body: <ScheduleUnitPopupBody dispatchPopupWindow={dispatchPopupWindow}/>,
      footer: ''
    });
  };

  const RemoveUnitFooter = ({dispatch}: any) => {
    const onCancel = () => dispatch({type: "POP_POPUP_WINDOW"});
    const onOk = () => {
    }
    return (
      <div className={styles.removeFooter}>
        <Button color='red' onClick={onCancel}>Ні</Button>
        <Button onClick={onOk}>Так</Button>
      </div>
    )
  }

  const handleConfirmRemoveUnit = () => {
    dispatchPopupWindow({
      header: <h1>Підтвердіть операцію</h1>,
      body: 'Ви дійсно бажаєте видалити відрізок?',
      footer: <RemoveUnitFooter/>,
      isConfirm: true
    });
  };

  const handleSaveChanges = () => {
    try {

    } catch (e) {

    }
  };

  const submitCreateUnit = () => {
    try {

    } catch (e) {

    }
  };

  return (
    <>
      <img
        src={addIcon}
        alt="create"
        className={styles.addIcon}
        title='Додати відрізок'
        onClick={handleCreateUnit}
      />
      <img
        src={removeIcon}
        alt="delete"
        className={styles.removeIcon}
        title='Видалити'
        onClick={handleConfirmRemoveUnit}
      />
      {!editMode && (
        <img
          src={editIcon}
          alt="edit"
          className={styles.editIcon}
          onClick={() => setEditMode(true)}
          title='Редагувати'
        />
      )}
      <div>
        {!editMode && !!unit ? (
          <div className={styles.unitData}>
            <div>{fullName(unit.user)}</div>
            <div><span>Дата (від): </span><span>{moment(unit.dateStart).format('DD.MM.YYYY')}</span></div>
            <div><span>Дата (до): </span><span>{moment(unit.dateEnd).format('DD.MM.YYYY')}</span></div>
            <div><span>Час (від): </span><span>{unit.from}</span></div>
            <div><span>Час (до): </span><span>{unit.to}</span></div>
            <div><span>Тип: </span><span>{
              /*@ts-ignore*/
              ScheduleUnitTypeT[unit.activity]}</span></div>
          </div>
        ) : (
          <div className={styles.editWrapper}>
            <label>
              Педагог:
              <Select
                options={selectUserData}
                value={selectedUser}
                placeholder='Виберіть педагога'
                onChange={handleSelectUser}
                menuPortalTarget={document.body}
                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
              />
            </label>
            <label>
              Дата (від):
              <input type="date" value={dateStart} onChange={handleDateStartChange} className={styles.input}/>
            </label>
            <label>
              Дата (до):
              <input type="date" value={dateEnd} onChange={handleDateEndChange} className={styles.input}/>
            </label>
            <label>
              Час (від):
              <input type="time" className={styles.input} value={timeFrom} onChange={handleFromTimeChange}/>
            </label>
            <label>
              Час (до):
              <input type="time" className={styles.input} value={timeTo} onChange={handleToTimeChange}/>
            </label>
            <label>
              Тип:
              <Select
                options={selectTypesData as any}
                value={selectedType}
                onChange={handleSelectType}
                menuPortalTarget={document.body}
                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
              />
            </label>
            {!!dateError && dateError.map((error: ScheduleUnitType) => (
              <p className={styles.errorMessage}>
                Накладається на відрізок [ {
                fullName(error.user, true) + ' | '
                + moment(error.dateStart).format('DD.MM.YY') + ' - '
                + moment(error.dateEnd).format('DD.MM.YY') + ' | '
                + error.from + ' - ' + error.to
              } ]
              </p>
            ))
            }
          </div>
        )}
        <div className={styles.buttons}>
          {editMode && (
            <>
              <Button onClick={() => setEditMode(false)} color='red'>Відміна</Button>
              <Button disabled={!!dateError} onClick={handleSaveChanges}>Зберегти</Button>
            </>
          )}
          {!unit && (
            <>
              <Button onClick={() => dispatch({type: 'POP_POPUP_WINDOW'})} color='red'>Відміна</Button>
              <Button disabled={!!dateError} onClick={submitCreateUnit}>Створити</Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const ScheduleUnitPopupFooter = () => {
  return (
    <div>

    </div>
  );
};

export default {
  Header: ScheduleUnitPopupHeader,
  Body: ScheduleUnitPopupBody,
  Footer: ScheduleUnitPopupFooter
};
