import React, {Fragment, useEffect, useRef, useState} from 'react';
import styles from './createClassroomPopupBody.module.css';
import Select, {components} from "react-select";
import {useMutation} from "@apollo/client";
import {
  ClassroomType,
  Department,
  ExclusivelyQueueAllowedDepartmentsInfo,
  InstrumentType, InstrumentTypesE, InstrumentTypesEUa,
  QueuePolicyTypes,
  SpecialClassroomTypes
} from "../../../../models/models";
import {useForm} from "react-hook-form";
import {CREATE_CLASSROOM} from "../../../../api/operations/mutations/createClassroom";
import {GET_CLASSROOMS} from "../../../../api/operations/queries/classrooms";
import {client} from "../../../../api/client";
import {selectLightStyles} from "../../../../styles/selectStyles";
import useInstruments from "../../../../hooks/useInstruments";
import mainStyles from "../../../../styles/main.module.css";
import useDepartments from "../../../../hooks/useDepartments";
import addIcon from '../../../../assets/images/addLined.svg';
import moment from "moment";
import {UPDATE_CLASSROOM} from "../../../../api/operations/mutations/updateClassroom";

interface PropTypes {
  dispatch: (value: any) => void;
  dispatchNotification: (value: any) => void;
  item?: ClassroomType;
}

const colors = [
  {value: '#ffffff00', label: 'Немає'},
  {value: '#000000', label: 'Чорний'},
  {value: '#ff0000', label: 'Червоний'},
  {value: '#00ff00', label: 'Зелений'},
  {value: '#0000ff', label: 'Синій'},
]

const CreateClassroomPopupBody: React.FC<PropTypes> = ({
                                                         item,
                                                         dispatchNotification, ...props
                                                       }) => {
  const departmentsData = useDepartments();
  const instrumentsData = useInstruments();
  const [createClassroom] = useMutation(CREATE_CLASSROOM);
  const [departments, setDepartments] = useState<any>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<any>();
  const [selectedColor, setSelectedColor] = useState<any>(colors[0]);
  const [selectedAllowedDepartments, setSelectedAllowedDepartments] = useState([]);
  const [allowedForSelectedDepartments, setAllowedForSelectedDepartments] = useState(false);
  const [instruments, setInstruments] = useState<any>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<any>([]);
  const [freeInstrumentsOnly, setFreeInstrumentsOnly] = useState(true);
  const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm();
  const firstFieldRef = useRef(null);

  useEffect(() => {
    firstFieldRef.current && firstFieldRef.current.focus();
  }, [firstFieldRef]);

  useEffect(() => {
    setDepartments(departmentsData.map((dep: Department) => ({value: dep.id, label: dep.name})));
    if (item && item.chair) {
      setSelectedDepartment({value: item.chair.id, label: item.chair.name});
    }
  }, [departmentsData]);

  useEffect(() => {
    if (freeInstrumentsOnly && instrumentsData) {
      const filteredInstruments = instrumentsData.filter(item => !item.classroom);

      setMappedInstruments(filteredInstruments);
    } else {
      setMappedInstruments(instrumentsData);
    }
  }, [freeInstrumentsOnly, instrumentsData]);

  useEffect(() => {
    if (item && item.color) {
      const color = colors.find(({value}) => value === item.color);
      setSelectedColor(color ? color : colors[0]);
    }
    if (item && item.instruments) {
      const itemInstruments = item.instruments
        .map(({id, name, type, persNumber}) => ({
          value: id, label: name + ' ('
            + InstrumentTypesEUa[type as InstrumentTypesE].toLowerCase() + ') '
            + (persNumber ? ', ' + persNumber : '')
        }));
      setSelectedInstruments(itemInstruments);
    }
    if (item && item.queueInfo.queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS) {
      setAllowedForSelectedDepartments(true);
      setMappedSelectedAllowedDepartments(item.queueInfo.queuePolicy.queueAllowedDepartments)
    }
  }, [])

  const setMappedInstruments = (data: InstrumentType[]) => {
    setInstruments(data.map((item) => ({
      value: item.id, label: item.name + ' ('
        + InstrumentTypesEUa[item.type as InstrumentTypesE].toLowerCase()
        + ') ' + item.persNumber
    })));
  };

  const setMappedSelectedAllowedDepartments = (data: ExclusivelyQueueAllowedDepartmentsInfo[]) => {
    setSelectedAllowedDepartments(data.map(({department}) => ({
      value: department.id, label: department.name
    })));
  };

  const onSubmit = async (data: any) => {
    if (item) {
      const newInstruments = item.instruments ? selectedInstruments.filter(({value}: any) => {
        return !(item.instruments.some(instrument => instrument.id === value))
      }).map(({value}: any) => ({id: value})) : selectedInstruments
        .map(({value}: any) => ({id: value}));

      const removedInstruments = item.instruments ? item.instruments.filter(instrument => {
        return !(selectedInstruments.some(({value}: any) => value === instrument.id))
      }).map(({id}: any) => ({id})) : [];

      const newQueueAllowedDepartments = item.queueInfo.queuePolicy.queueAllowedDepartments ?
        selectedAllowedDepartments.filter(({value}: any) => {
          return !(item.queueInfo.queuePolicy.queueAllowedDepartments
            .some(allowedDep => allowedDep.department.id === value))
        }).map(({value}: any) => ({departmentId: value})) : selectedAllowedDepartments
          .map(({value}: any) => ({departmentId: value}));

      const removedQueueAllowedDepartments = item.queueInfo.queuePolicy.queueAllowedDepartments ?
        item.queueInfo.queuePolicy.queueAllowedDepartments.filter(({department}) => {
          return !(selectedAllowedDepartments.some(({value}: any) => value === department.id))
        }).map(({id}: any) => ({departmentId: id})) : [];

      try {
        const result = await client.mutate({
          mutation: UPDATE_CLASSROOM,
          variables: {
            data: {
              name: data.name ? {
                set: data.name
              } : undefined,
              special: data.special ? {
                set: SpecialClassroomTypes.PIANO
              } : undefined,
              floor: data.floor ? {
                set: Number(data.floor)
              } : undefined,
              isWing: {
                set: data.isWing
              },
              isOperaStudio: {
                set: data.isOperaStudio
              },
              description: data.description !== null ? {
                set: data.description
              } : undefined,
              isHidden: {
                set: data.isHidden
              },
              chair: item.chair && !selectedDepartment ? {
                disconnect: true
              } : selectedDepartment?.value !== item.chair?.id ? {
                connect: {
                  id: selectedDepartment.value
                }
              } : undefined,
              instruments: {
                connect: newInstruments,
                disconnect: removedInstruments
              },
              color: {
                set: selectedColor.value
              },
              queueInfo: {
                update: {
                  queuePolicy: {
                    update: {
                      policy: {
                        set: allowedForSelectedDepartments ? QueuePolicyTypes.SELECTED_DEPARTMENTS
                          : QueuePolicyTypes.ALL_DEPARTMENTS
                      },
                      queueAllowedDepartments:
                        allowedForSelectedDepartments ? {
                          deleteMany: removedQueueAllowedDepartments,
                          createMany: {
                            data: newQueueAllowedDepartments
                          }
                        } : {
                          deleteMany: removedQueueAllowedDepartments
                        }
                    }
                  }
                }
              },
            },
            where: {
              id: item.id
            }
          }
        })
        if (result.data.updateOneClassroom.userErrors?.length) {
          result.data.updateOneClassroom.userErrors.forEach(({message}: any) => {
            dispatchNotification({
              header: "Помилка",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "Успішно!",
            message: `Аудиторія ${item.name} змінена.`,
            type: "ok",
          });
          props.dispatch({
            type: "POP_POPUP_WINDOW",
          });
        }
      } catch (e) {
        console.log(e)
        dispatchNotification({
          header: "Помилка",
          message: JSON.stringify(e),
          type: "alert",
        });
      }
    } else {
      try {
        const result = await createClassroom({
          variables: {
            data: {
              name: data.name,
              special: data.special ? SpecialClassroomTypes.PIANO : undefined,
              floor: Number(data.floor),
              isWing: data.isWing,
              isOperaStudio: data.isOperaStudio,
              description: data.description,
              chair: selectedDepartment ? {connect: {id: selectedDepartment.value}} : undefined,
              instruments: selectedInstruments.length > 0
                ? {connect: selectedInstruments.map((item: any) => ({id: item.value}))} : undefined,
              orderIndex: 0,
              isHidden: data.isHidden,
              color: selectedColor.value,
              queueInfo: {
                create: {
                  queuePolicy: {
                    create: {
                      policy: allowedForSelectedDepartments ? QueuePolicyTypes.SELECTED_DEPARTMENTS
                        : QueuePolicyTypes.ALL_DEPARTMENTS,
                      queueAllowedDepartments: allowedForSelectedDepartments ? {
                        createMany: {
                          data: selectedAllowedDepartments.map(({value}: any) => ({departmentId: value}))
                        }
                      } : undefined
                    }
                  }
                }
              }
            }
          }
        });
        if (result.data.createOneClassroom.userErrors?.length) {
          result.data.createOneClassroom.userErrors.forEach(({message}: any) => {
            dispatchNotification({
              header: "Помилка",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "Успішно!",
            message: `Аудиторія ${data.name} створена.`,
            type: "ok",
          });
        }
      } catch (e) {
        dispatchNotification({
          header: "Помилка",
          message: JSON.stringify(e),
          type: "alert",
        });
      }
      await client.query({
        query: GET_CLASSROOMS,
        variables: {date: moment().toISOString()},
        fetchPolicy: 'network-only',
      });
      props.dispatch({
        type: "POP_POPUP_WINDOW",
      });
    }
  };

  const handleSelectDepartment = (e: any) => {
    setSelectedDepartment(e);
  };

  const handleSelectInstrument = (e: any) => {
    setSelectedInstruments([...e]);
  };

  const handleSelectColor = (e: any) => {
    setSelectedColor(e);
  };

  const handleSelectAllowedDepartment = (e: any) => {
    setSelectedAllowedDepartments([...e]);
  };

  const handleFreeInstruments = () => {
    setFreeInstrumentsOnly(prevState => !prevState);
  };

  const DropdownIndicator = () => {
    return <img src={addIcon} alt="Додати" className={styles.addInstrumentIcon}/>
  };

  const MenuList = (props: any) => {
    return (
      <>
        <div>
          <span className={styles.instrumentsCheckbox}>
          <input type="checkbox" checked={freeInstrumentsOnly} onChange={handleFreeInstruments}/>
          Вибирати серед інструментів без аудиторій
        </span>
        </div>
        <components.MenuList {...props}>{props.children}</components.MenuList>
      </>
    );
  };

  return <div className={styles.wrapper}>
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)} id='createClassroom'>
      {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
      <label>Назва
        <input
          placeholder="Не більше 5 символів"
          maxLength={5}
          onChange={(e) => setValue('name', e.target.value)}
          defaultValue={item ? item.name : undefined}
          {...register("name", {required: true})}
          ref={ref => firstFieldRef.current = ref}
        />
      </label>
      <label>Опис
        <input
          maxLength={100}
          onChange={(e) => setValue('description', e.target.value)}
          placeholder="Не більше 100 символів"
          {...register("description")}
          defaultValue={item ? item.description as string : undefined}
        />
      </label>
      {departmentsData &&
      <label>Кафедра
          <Select
              value={selectedDepartment}
              onChange={handleSelectDepartment}
              options={departments}
            //@ts-ignore
              styles={selectLightStyles}
              menuPortalTarget={document.body}
              isClearable
              isSearchable
              placeholder='Виберіть кафедру'
              noOptionsMessage={() => 'Кафедри відсутні'}
          />
      </label>}
      <label>Спеціалізована
        <input {...register("special")} type="checkbox"
               defaultChecked={item ? Boolean(item.special) : false}/>
      </label>
      <label>Флігель
        <input {...register("isWing")} type="checkbox"
               defaultChecked={item ? item.isWing : false}/>
      </label>
      <label>Оперна студія
        <input {...register("isOperaStudio")} type="checkbox"
               defaultChecked={item ? item.isOperaStudio : false}/>
      </label>
      <label>Поверх
        <input {...register("floor")} type="number" min={1} max={4}
               defaultValue={item ? item.floor as number : 1}/>
      </label>
      <label>Прихована
        <input {...register("isHidden")} type="checkbox"
               defaultChecked={item ? item.isHidden : false}/>
      </label>
      <label>Доступна тільки для вибраних кафедр
        <input {...register("allowedForSelectedDepartments")}
               type="checkbox" checked={allowedForSelectedDepartments}
               onChange={() => setAllowedForSelectedDepartments(prevState => !prevState)}
        />
      </label>
      {allowedForSelectedDepartments && (
        <label>Кафедри, яким аудиторія буде доступна
          <Select options={departments}
            //@ts-ignore
                  styles={selectLightStyles}
                  menuPortalTarget={document.body}
                  value={selectedAllowedDepartments}
                  onChange={handleSelectAllowedDepartment}
                  components={{DropdownIndicator, MenuList}}
                  isSearchable
                  isClearable={false}
                  isMulti
                  placeholder='Додати кафедру'
                  noOptionsMessage={() => 'Кафедри відсутні'}
          />
        </label>
      )}
      <label>Інструменти
        <Select options={instruments}
          //@ts-ignore
                styles={selectLightStyles}
                menuPortalTarget={document.body}
                value={selectedInstruments}
                onChange={handleSelectInstrument}
                components={{DropdownIndicator, MenuList}}
                isSearchable
                isClearable={false}
                isMulti
                placeholder='Додати інструмент'
                noOptionsMessage={() => 'Інструменти відсутні'}
        />
      </label>
      <label>Колір
        <Select options={colors}
          //@ts-ignore
                styles={selectLightStyles}
                menuPortalTarget={document.body}
                value={selectedColor}
                onChange={handleSelectColor}
                placeholder='Виберіть колір'
        />
      </label>
    </form>
  </div>
};

export default CreateClassroomPopupBody;