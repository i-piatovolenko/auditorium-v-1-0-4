import React, {useEffect, useState, Fragment} from 'react';
import styles from './createClassroomPopupBody.module.css';
import Select, {components} from "react-select";
import {useMutation} from "@apollo/client";
import {ClassroomType, Department, InstrumentType} from "../../../../models/models";
import {useForm} from "react-hook-form";
import {CREATE_CLASSROOM} from "../../../../api/operations/mutations/createClassroom";
import {GET_CLASSROOMS} from "../../../../api/operations/queries/classrooms";
import {client, gridUpdate} from "../../../../api/client";
import TextArea from "antd/es/input/TextArea";
import {selectLightStyles} from "../../../../styles/selectStyles";
import useInstruments from "../../../../hooks/useInstruments";
import mainStyles from "../../../../styles/main.module.css";
import useDepartments from "../../../../hooks/useDepartments";
import addIcon from '../../../../assets/images/addLined.svg';
import moment from "moment";

interface PropTypes {
  dispatch: (value: any) => void;
  dispatchNotification: (value: any) => void;
  item?: ClassroomType;
}

const CreateClassroomPopupBody: React.FC<PropTypes> = ({item, ...props}) => {
  const departmentsData = useDepartments(true);
  const instrumentsData = useInstruments(true);
  const [createClassroom] = useMutation(CREATE_CLASSROOM);
  const [departments, setDepartments] = useState<any>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<any>();
  const [instruments, setInstruments] = useState<any>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<any>([]);
  const [freeInstrumentsOnly, setFreeInstrumentsOnly] = useState(true);
  const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm();

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
    if (item && item.instruments) {
      const itemInstruments = item.instruments
        .map(({id, name, type, persNumber}) => ({
          value: id, label: name + ', ' + type + (persNumber ? ' - ' + persNumber :  '')
        }));
      setSelectedInstruments(itemInstruments);
    }
  }, [])

  const setMappedInstruments = (data: InstrumentType[]) => {
    setInstruments(data.map((item) => ({
      value: item.id, label: item.name + ', ' + item.type + ' - ' + item.persNumber
    })));
  };

  const onSubmit = async (data: any) => {
    await createClassroom({
      variables: {
        data: {
          name: data.name,
          special: data.special ? 'PIANO' : undefined,
          floor: Number(data.floor),
          isWing: data.isWing,
          isOperaStudio: data.isOperaStudio,
          description: data.description,
          chair: selectedDepartment ? {connect: {id: selectedDepartment.value}} : undefined,
          instruments: selectedInstruments.length > 0
            ? {connect: selectedInstruments.map((item: any) => ({id: item.value}))} : undefined,
          orderIndex: 0,
        }
      }
    });
    await client.query({
      query: GET_CLASSROOMS,
      variables: {date: moment().toISOString()},
      fetchPolicy: 'network-only',
    });
    gridUpdate(!gridUpdate());
    props.dispatch({
      type: "POP_POPUP_WINDOW",
    });
    props.dispatchNotification({
      header: "Успішно!",
      message: `Аудиторія ${data.name}  створена.`,
      type: "ok",
    });
  };

  const handleSelectDepartment = (e: any) => {
    setSelectedDepartment(e);
  };

  const handleSelectInstrument = (e: any) => {
    setSelectedInstruments([...e]);
  };

  const handleFreeInstruments = () => {
    setFreeInstrumentsOnly(prevState => !prevState);
  };

  const DropdownIndicator = () => {
    return <img src={addIcon} alt="Додати" className={styles.addInstrumentIcon}/>
  };

  const MenuList = (props: any) => {
    return (
      <Fragment>
        <div>
          <span className={styles.instrumentsCheckbox}>
          <input type="checkbox" checked={freeInstrumentsOnly} onChange={handleFreeInstruments}/>
          Вибирати серед інструментів без аудиторій
        </span>
        </div>
        <components.MenuList {...props}>{props.children}</components.MenuList>
      </Fragment>
    );
  };

  return <div className={styles.wrapper}>
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)} id='createClassroom'>
      {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
      <label>Назва
        <input
          placeholder="Не більше 5 символів"
          maxLength={5}
          defaultValue={item ? item.name : undefined}
          {...register("name", {required: true})}
        />
      </label>
      <label>Опис
        <TextArea
          showCount
          maxLength={100}
          onChange={(e) => setValue('description', e.target.value)}
          placeholder="Не більше 100 символів"
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
    </form>
  </div>
};

export default CreateClassroomPopupBody;