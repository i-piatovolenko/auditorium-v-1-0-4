import React, {useEffect, useState} from 'react';
import {useMutation} from "@apollo/client";
import {CREATE_INSTRUMENT} from "../../../../api/operations/mutations/createInstrument";
import {UPDATE_INSTRUMENT} from "../../../../api/operations/mutations/updateInstrument";
import {useForm} from "react-hook-form";
import styles from './createInstrumentPopupBody.module.css';
import mainStyles from '../../../../styles/main.module.css';
import useClassrooms from "../../../../hooks/useClassrooms";
import {FormData} from '../models';
import {SelectData} from '../models';
import Select from "react-select";
import {selectLightStyles} from "../../../../styles/selectStyles";
import {ClassroomType, InstrumentType} from "../../../../models/models";

const instrumentTypes = [
  {value: 'UpRightPiano', label: 'Фортепіано'},
  {value: 'GrandPiano', label: 'Рояль'}
];

interface PropTypes {
  dispatchNotification: (value: any) => void;
  dispatch?: (value: any) => void;
  handleErrorDetails?: (error: any) => void;
  onUpdate: () => void;
  addInstrument: (item: InstrumentType) => void;
  instrument: InstrumentType | null;
  isEditMode: boolean;
}

const CreateInstrumentPopupBody: React.FC<PropTypes> = ({
                                                          dispatchNotification, isEditMode,
                                                          dispatch, addInstrument, instrument, onUpdate,
                                                          handleErrorDetails
                                                        }) => {
  const {register, handleSubmit, watch, formState: {errors}} = useForm<FormData>();
  const [classrooms, subscribeToMore]: [ClassroomType[], any] = useClassrooms();
  const [classroomsData, setClassroomsData] = useState<SelectData[]>([{
    value: instrument?.classroom ? String(instrument?.classroom?.id) : '',
    label: instrument?.classroom ? String(instrument?.classroom?.name) : ''
  }]);
  const [createInstrument] = useMutation(CREATE_INSTRUMENT);
  const [updateInstrument] = useMutation(UPDATE_INSTRUMENT);
  const [classroomValue, setClassroomValue] = useState(classroomsData[0]);
  const [selectedInstrumentType, setSelectedInstrumentType] = useState(instrumentTypes[0]);

  useEffect(() => {
    const data = classrooms.map(item => ({value: item.id, label: item.name}));
    const emptyItem = ({value: '', label: 'Немає'});
    setClassroomsData([emptyItem, ...data as unknown as SelectData[]]);
  }, [classrooms]);

  useEffect(() => {
    if (isEditMode) {
      const item = classroomsData.find(item => Number(item.value) === instrument?.classroom?.id);
      if (item) setClassroomValue(item as SelectData);
    } else {
      setClassroomValue(classroomsData[0]);
    }
  }, [classroomsData, instrument]);

  const handleSelect = (e: any) => {
    setClassroomValue(e);
  };

  const onSubmit = async (data: FormData) => {
    const {name, type, persNumber, rate} = data;
    const classroomId = classroomValue?.value;
    const classroomName = classroomValue ? classroomValue.label : instrument?.classroom.name;

    try {
      if (isEditMode) {
        await updateInstrument({
          variables: {
            data: {
              name: {set: name},
              type: {set: selectedInstrumentType.value},
              persNumber: {set: persNumber},
              rate: {set: Number(rate)},
              classroom: classroomId ? {connect: {id: classroomId}} : undefined
            },
            where: {
              id: Number(instrument?.id)
            }
          }
        });
        onUpdate();
        dispatchNotification({
          header: "Успішно!",
          message: `Дані змінені.`,
          type: "ok",
        });
      } else {
        const result = await createInstrument({
          variables: {
            data: {
              name, type: selectedInstrumentType.value, persNumber, rate: Number(rate),
              classroom: classroomId ? {connect: {id: classroomId}} : undefined
            }
          }
        });
        onUpdate();
        dispatchNotification({
          header: "Успішно!",
          message: `Інструмент ${name}  створений.`,
          type: "ok",
        });
        addInstrument({
          ...result.data.createOneInstrument,
          classroom: {name: classroomId ? classroomName : ''}
        });
      }

      dispatch && dispatch({
        type: "POP_POPUP_WINDOW",
      });
    } catch (e) {
      console.log(e)
      dispatchNotification({
        header: "Помилка!",
        message: <><span>Щось пішло не так.</span><br/>
          <span style={{color: '#2b5dff', cursor: 'pointer', textDecoration: 'underline'}}
                onClick={() => handleErrorDetails && handleErrorDetails(e)}>Деталі</span></>,
        type: "alert",
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.container} id='createInstrument'>
        {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
        <label>
          Назва
          <input className={mainStyles.input} type='text' placeholder='Наприклад: "Україна"'
                 defaultValue={isEditMode ? instrument?.name : undefined}
                 {...register("name", {required: true})}/>
        </label>
        {errors.type && <span className={mainStyles.required}>Обов'язкове поле</span>}
        <label>Тип
          <Select
            value={selectedInstrumentType}
            onChange={(e) => setSelectedInstrumentType(e)}
            options={instrumentTypes}
            //@ts-ignore
            styles={selectLightStyles}
            menuPortalTarget={document.body}
            placeholder='Виберіть тип інструменту'
          />
        </label>
        {errors.persNumber && <span className={mainStyles.required}>Обов'язкове поле</span>}
        <label>
          Інв. номер
          <input className={mainStyles.input}
                 type='text' placeholder='Наприклад: "3242234"'
                 defaultValue={isEditMode ? instrument?.persNumber : undefined}
                 {...register("persNumber", {required: true})}/>
        </label>
        <label>
          Рейтинг
          <input className={mainStyles.input}
                 defaultValue={isEditMode && instrument ? instrument.rate : 1} step='.1'
                 type='number' min='1' max='10' placeholder='Рейтинг' {...register("rate")}/>
        </label>
        <label>
          Аудиторія
          <Select options={classroomsData} styles={selectLightStyles} menuPortalTarget={document.body}
                  placeholder='Аудиторія' value={classroomValue} onChange={handleSelect}/>
        </label>
      </form>
    </div>
  );
};

export default CreateInstrumentPopupBody;
