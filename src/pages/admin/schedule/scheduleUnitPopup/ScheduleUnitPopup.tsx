import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import {ScheduleUnitActivityT, ScheduleUnitType, ScheduleUnitTypeT} from "../../../../models/models";
import {formatTimeWithZero, fullName} from "../../../../helpers/helpers";
import Select from "react-select";
import useUsers from "../../../../hooks/useUsers";
import editIcon from '../../../../assets/images/edit.svg';
import addIcon from '../../../../assets/images/addLined.svg';
import removeIcon from '../../../../assets/images/delete.svg';
import styles from './scheduleUnitPopup.module.css';
import moment from "moment";
import Button from "../../../../components/button/Button";
import {
  hasOverlappedUnits,
  hasUnitDateTimeIntersection,
  isBiggerThanSubstitutions, scheduleUnitToString,
  withinPrimaryUnitBoundaries
} from "../../../../helpers/scheduleHelpers";
import {client} from "../../../../api/client";
import {DELETE_SCHEDULE_UNIT} from "../../../../api/operations/mutations/deleteScheduleUnit";
import handleOperation from "../../../../helpers/handleOperation";
import {UPDATE_SCHEDULE_UNIT} from "../../../../api/operations/mutations/updateScheduleUnit";
import {CREATE_SCHEDULE_UNIT} from "../../../../api/operations/mutations/createScheduleUnit";
import {GET_SCHEDULE_SUBSTITUTIONS_UNITS} from "../../../../api/operations/queries/scheduleSubUnits";

type HeaderPropTypes = {
  title: string
}

type BodyPropTypes = {
  unit?: ScheduleUnitType;
  allUnits?: ScheduleUnitType[];
  dispatchPopupWindow: (config: any) => void;
  dispatchNotification: any;
  dispatch?: (config: { type: string }) => void;
  primary?: boolean;
  primaryUnit?: ScheduleUnitType;
  classroomName: string;
  selectedDay: number;
  refetch: () => void;
}

const ScheduleUnitPopupHeader: FC<HeaderPropTypes> = ({title}) => {
  return <h1>{title}</h1>
};

const ScheduleUnitPopupBody: FC<BodyPropTypes> = (
  {
    unit,
    dispatchPopupWindow,
    dispatchNotification,
    allUnits,
    dispatch,
    primary = true,
    primaryUnit,
    classroomName,
    selectedDay,
    refetch
  }
) => {
  const primaryCreateMode = primary && !unit;
  const substitutionCreateMode = !primary && !unit;
  const primaryUpdateMode = unit?.type === ScheduleUnitTypeT.PRIMARY;
  const substitutionUpdateMode = unit?.type === ScheduleUnitTypeT.SUBSTITUTION;

  const [editMode, setEditMode] = useState(false);
  const [selectUserData, setSelectUserdata] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const selectTypesData = [
    {value: Object.keys(ScheduleUnitActivityT)[0], label: ScheduleUnitActivityT.INDIVIDUAL_LESSON},
    {value: Object.keys(ScheduleUnitActivityT)[1], label: ScheduleUnitActivityT.LECTURE}
  ];
  const [selectedType, setSelectedType] = useState(selectTypesData[0]);
  const users = useUsers();
  const [dateError, setDateError] = useState(null);
  const [updatePrimaryError, setUpdatePrimaryError] = useState(false);
  const [substitutionError, setSubstitutionError] = useState(false);
  const [overlapsError, setOverLapsError] = useState(false);
  const [dateStart, setDateStart] = useState(moment().format('YYYY-MM-DD'));
  const [dateEnd, setDateEnd] = useState(moment().format('YYYY-MM-DD'));
  const [timeFrom, setTimeFrom] = useState('08:00');
  const [timeTo, setTimeTo] = useState('15:00');
  const [substitutions, setSubstitutions] = useState(null);

  useEffect(() => {
    if (primaryUnit || unit) {
      setTimeFrom(formatTimeWithZero((primaryUnit || unit).from));
      setTimeTo(formatTimeWithZero((primaryUnit || unit).to));
      setDateStart(moment((primaryUnit || unit).dateStart).format('YYYY-MM-DD'));
      setDateEnd(moment((primaryUnit || unit).dateEnd).format('YYYY-MM-DD'));
    }
  }, [primaryUnit]);

  useEffect(() => {
    const error = hasOverlappedUnits(dateStart, dateEnd, timeFrom, timeTo, allUnits)
    setOverLapsError(error as any);
  }, [dateStart, dateEnd, timeTo, timeFrom]);

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

  const checkForErrors = () => {
    const units = primaryUpdateMode || primaryCreateMode ? allUnits : substitutions;

    const isError = hasUnitDateTimeIntersection(dateStart, unit?.id || -1, units, timeFrom, timeTo)
      || hasUnitDateTimeIntersection(dateEnd, unit?.id || -1, units, timeFrom, timeTo)
      || hasOverlappedUnits(dateStart, dateEnd, timeFrom, timeTo, units);
    setDateError(isError);
    isPrimaryUnitUpdateError(undefined, undefined, undefined, undefined);
    isSubstitutionUpdateOrCreateError(undefined, undefined, undefined, undefined);
  }

  useEffect(() => {
    checkForErrors()
  }, [dateStart, dateEnd, timeFrom, timeTo]);

  useEffect(() => {
    checkForErrors();

    if (unit) {
      client.query({
        query: GET_SCHEDULE_SUBSTITUTIONS_UNITS,
        variables: {
          where: {
            id: unit.id
          }
        }
      }).then(response => {
        setSubstitutions(response.data.scheduleUnit.substitutions);
      });
    }

    return () => {
      setSubstitutions(null);
    }
  }, []);

  const isPrimaryUnitUpdateError = (start: string, end: string, f: string, t: string) => {
    if (primaryUpdateMode) {
      const updatedPrimaryUnit: ScheduleUnitType = {
        ...unit,
        dateStart: (start || dateStart) as unknown as Date,
        dateEnd: (end || dateEnd) as unknown as Date,
        from: f || timeFrom,
        to: t || timeTo
      }
      setUpdatePrimaryError(!isBiggerThanSubstitutions(updatedPrimaryUnit, substitutions));
    }
  };

  const isSubstitutionUpdateOrCreateError = (start: string, end: string, f: string, t: string) => {
    if (substitutionCreateMode || substitutionUpdateMode) {
      const updatedSubstitutionUnit: ScheduleUnitType = {
        ...unit,
        dateStart: (start || dateStart) as unknown as Date,
        dateEnd: (end || dateEnd) as unknown as Date,
        from: f || timeFrom,
        to: t || timeTo
      }
      setSubstitutionError(!withinPrimaryUnitBoundaries(updatedSubstitutionUnit, primaryUnit));
    }
  };

  const handleSelectUser = (e: any) => {
    setSelectedUser(e);
  };

  const handleSelectType = (e: any) => {
    setSelectedType(e);
  };

  const handleDateStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateStart(e.target.value);

    const units = primaryUpdateMode || primaryCreateMode ? allUnits : substitutions;
    const error = hasUnitDateTimeIntersection(e.target.value, unit?.id || -1, units, timeFrom, timeTo)
      || hasOverlappedUnits(e.target.value, dateEnd, timeFrom, timeTo, units);
    setDateError(error);
    isPrimaryUnitUpdateError(e.target.value, undefined, undefined, undefined);
    isSubstitutionUpdateOrCreateError(e.target.value, undefined, undefined, undefined);
  };

  const handleDateEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateEnd(e.target.value);

    const units = primaryUpdateMode || primaryCreateMode ? allUnits : substitutions;
    const error = hasUnitDateTimeIntersection(e.target.value, unit?.id || -1, units, timeFrom, timeTo)
      || hasOverlappedUnits(dateStart, e.target.value, timeFrom, timeTo, units);
    setDateError(error);
    setDateError(hasUnitDateTimeIntersection(e.target.value, unit?.id || -1, units, timeFrom, timeTo));
    isPrimaryUnitUpdateError(undefined, e.target.value, undefined, undefined);
    isSubstitutionUpdateOrCreateError(undefined, e.target.value, undefined, undefined);
  };

  const handleFromTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeFrom(e.target.value);

    const units = primaryUpdateMode || primaryCreateMode ? allUnits : substitutions;
    const isError = hasUnitDateTimeIntersection(dateStart, unit?.id || -1, units, e.target.value, timeTo)
      || hasUnitDateTimeIntersection(dateEnd, unit?.id || -1, units, e.target.value, timeTo)
      || hasOverlappedUnits(dateStart, dateEnd, e.target.value, timeTo, units);
    setDateError(isError);
    isPrimaryUnitUpdateError(undefined, undefined, e.target.value, undefined);
    isSubstitutionUpdateOrCreateError(undefined, undefined, e.target.value, undefined);
  };

  const handleToTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeTo(e.target.value);

    const units = primaryUpdateMode || primaryCreateMode ? allUnits : substitutions;
    const isError = hasUnitDateTimeIntersection(dateStart, unit?.id || -1, units, timeFrom, e.target.value)
      || hasUnitDateTimeIntersection(dateEnd, unit?.id || -1, units, timeFrom, e.target.value)
      || hasOverlappedUnits(dateStart, dateEnd, timeFrom, e.target.value, units);
    setDateError(isError);
    isPrimaryUnitUpdateError(undefined, undefined, undefined, e.target.value);
    isSubstitutionUpdateOrCreateError(undefined, undefined, undefined, e.target.value);
  };

  const handleCreateUnit = () => {
    dispatchPopupWindow({
      header: (
        <ScheduleUnitPopupHeader
          title={`Створити тимчасову заміну для ${fullName(unit.user, true)}`}
        />
      ),
      body: (
        <ScheduleUnitPopupBody
          dispatchPopupWindow={dispatchPopupWindow}
          dispatchNotification={dispatchNotification}
          allUnits={substitutions}
          selectedDay={selectedDay}
          classroomName={classroomName}
          primary={false}
          primaryUnit={unit}
          refetch={refetch}
        />
      ),
      footer: ''
    });
  };

  const RemoveUnitFooter = () => {
    const onCancel = () => dispatch({type: "POP_POPUP_WINDOW"});

    const onOk = async () => {
      try {
        const result = await client.mutate({
          mutation: DELETE_SCHEDULE_UNIT,
          variables: {
            input: {
              scheduleUnitId: unit.id
            }
          },
          update(cache) {
            cache.modify({
              fields: {
                scheduleUnits(existingScheduleUnitsRefs, {readField}) {
                  return existingScheduleUnitsRefs.filter(
                    (scheduleUnitRef: any) => unit.id !== readField('id', scheduleUnitRef),
                  );
                },
                schedule(existingScheduleUnitsRefs, {readField}) {
                  return existingScheduleUnitsRefs.filter(
                    (scheduleUnitRef: any) => unit.id !== readField('id', scheduleUnitRef),
                  );
                },
              },
            })
          }
        });
        await handleOperation(result, 'deleteOneScheduleUnit', dispatchNotification, dispatch, 'Відрізок видалено!');
        await refetch();
      } catch (e: any) {
        dispatchNotification({
          header: "Помилка",
          message: e?.message,
          type: "alert",

        });
      }
    };

    return (
      <div className={styles.removeFooter}>
        <Button color='red' onClick={onCancel}>Ні</Button>
        <Button onClick={onOk}>Так</Button>
      </div>
    );
  };

  const handleConfirmRemoveUnit = () => {
    dispatchPopupWindow({
      header: <h1>Підтвердіть операцію</h1>,
      body: 'Ви дійсно бажаєте видалити відрізок?',
      footer: <RemoveUnitFooter/>,
      isConfirm: true
    });
  };

  const handleSaveChanges = async () => {
    try {
      const result = await client.mutate({
        mutation: UPDATE_SCHEDULE_UNIT,
        variables: {
          where: {
            id: unit.id
          },
          data: {
            user: {
              connect: {
                id: +selectedUser.value
              }
            },
            dateStart: {
              set: moment(dateStart).set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0).toISOString()
            },
            dateEnd: {
              set: moment(dateEnd).set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0).toISOString()
            },
            from: {set: timeFrom},
            to: {set: timeTo},
            activity: {set: selectedType.value}
          }
        }
      });
      await handleOperation(result, 'updateOneScheduleUnit', dispatchNotification, dispatch,
        'Відрізок змінено');
    } catch (e: any) {
      dispatchNotification({
        header: "Помилка",
        message: e?.message,
        type: "alert",
      });
    }
  };

  const submitCreateUnit = async () => {
    try {
      if (primary) {

        const result = await client.mutate({
          mutation: CREATE_SCHEDULE_UNIT,
          variables: {
            data: {
              type: ScheduleUnitTypeT.PRIMARY,
              dateStart: moment(dateStart).set('hours', 0).set('minutes', 0).set('seconds', 0)
                .set('milliseconds', 0).toISOString(),
              dateEnd: moment(dateEnd).set('hours', 0).set('minutes', 0).set('seconds', 0)
                .set('milliseconds', 0).toISOString(),
              dayOfWeek: selectedDay === 6 ? 0 : selectedDay + 1,
              from: timeFrom,
              to: timeTo,
              activity: selectedType.value,
              user: {
                connect: {
                  id: +selectedUser.value
                }
              },
              classroom: {
                connect: {
                  name: classroomName
                }
              }
            }
          }
        });
        await handleOperation(result, 'createOneScheduleUnit', dispatchNotification, dispatch,
          'Відрізок створено');
        await refetch();
      } else {
        const result = client.mutate({
          mutation: UPDATE_SCHEDULE_UNIT,
          variables: {
            where: {
              id: +primaryUnit.id
            },
            data: {
              substitutions: {
                create: {
                  type: ScheduleUnitTypeT.SUBSTITUTION,
                  dateStart: moment(dateStart).set('hours', 0).set('minutes', 0).set('seconds', 0)
                    .set('milliseconds', 0).toISOString(),
                  dateEnd: moment(dateEnd).set('hours', 0).set('minutes', 0).set('seconds', 0)
                    .set('milliseconds', 0).toISOString(),
                  dayOfWeek: selectedDay === 6 ? 0 : selectedDay + 1,
                  from: timeFrom,
                  to: timeTo,
                  activity: selectedType.value,
                  user: {
                    connect: {
                      id: +selectedUser.value
                    }
                  },
                  classroom: {
                    connect: {
                      name: classroomName
                    }
                  }
                }
              }
            }
          }
        });
        await handleOperation(result, 'createOneScheduleUnit', dispatchNotification, dispatch,
          'Тимчасову заміну створено');
        await refetch();
      }
    } catch (e: any) {
      dispatchNotification({
        header: "Помилка",
        message: e?.message,
        type: "alert",
      });
    }
  };

  return (
    <>
      {/*{primaryCreateMode && <p>primaryCreateMode</p>}*/}
      {/*{substitutionCreateMode && <p>substitutionCreateMode</p>}*/}
      {/*{primaryUpdateMode && <p>primaryUpdateMode</p>}*/}
      {/*{substitutionUpdateMode && <p>substitutionUpdateMode</p>}*/}
      <div className={styles.controlButtons}>
        {!editMode && (
          <img
            src={editIcon}
            alt="edit"
            className={styles.controlIcon}
            onClick={() => setEditMode(true)}
            title='Редагувати'
          />
        )}
        <img
          src={removeIcon}
          alt="delete"
          className={styles.controlIcon}
          title='Видалити'
          onClick={handleConfirmRemoveUnit}
        />
      </div>
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
              ScheduleUnitActivityT[unit.activity]}</span></div>
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
            {!!dateError && dateError.map((unit: ScheduleUnitType) => (
              <p className={styles.errorMessage}>
                Накладається на відрізок <span className={styles.subListItem}>{scheduleUnitToString(unit)}</span>
              </p>
            ))
            }
            {!!overlapsError && !dateError && (overlapsError as unknown as ScheduleUnitType[])
              .map((unit: ScheduleUnitType) => (
                <p className={styles.errorMessage}>
                  Перекриває відрізок <span className={styles.subListItem}>{scheduleUnitToString(unit)}</span>
                </p>
              ))
            }
            {updatePrimaryError && (
              <p className={styles.errorMessage}>
                Тимчасові відрізки не можуть виходити за рамки постійного відрізку.
              </p>
            )}
            {substitutionError && (
              <p className={styles.errorMessage}>
                Тимчасовий відрізок не може бути більшим за постійний відрізок <span
                className={styles.subListItem}>{scheduleUnitToString(primaryUnit)}</span>
              </p>
            )}
          </div>
        )}
        {!!substitutions?.length && (
          <div className={styles.unitData}>
            <div>
              <span>Заміни: </span>
              <ul className={styles.subList}>
                {substitutions.map((sub: ScheduleUnitType) => (
                  <li className={styles.subListItem}>{scheduleUnitToString(sub)}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className={styles.buttons}>
          {editMode && (
            <>
              <Button onClick={() => setEditMode(false)} color='red'>Відміна</Button>
              <Button
                disabled={!selectedUser}
                onClick={handleSaveChanges}
              >
                Зберегти
              </Button>
            </>
          )}
          {!unit && (
            <>
              <Button onClick={() => dispatch({type: 'POP_POPUP_WINDOW'})} color='red'>Відміна</Button>
              <Button
                disabled={!selectedUser}
                onClick={submitCreateUnit}
              >
                Створити
              </Button>
            </>
          )}
        </div>
        {primaryUpdateMode && !editMode && (
          <Button onClick={handleCreateUnit}>
            Створити тимчасову заміну
            <img
              src={addIcon}
              alt="create"
              className={styles.addIcon}
              title='Додати відрізок'
            />
          </Button>
        )}
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
