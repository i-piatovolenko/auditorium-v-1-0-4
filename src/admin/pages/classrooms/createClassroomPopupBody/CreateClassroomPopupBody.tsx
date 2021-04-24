import React, {useEffect, useState} from 'react';
import styles from './createClassroomPopupBody.module.css';
import Select from "react-select";
import {useMutation, useQuery} from "@apollo/client";
import {GET_DEPARTMENTS} from "../../../../api/operations/queries/departments";
import {ClassroomType, Department} from "../../../../models/models";
import {useForm} from "react-hook-form";
import {CREATE_CLASSROOM} from "../../../../api/operations/mutations/createClassroom";
import {GET_CLASSROOMS} from "../../../../api/operations/queries/classrooms";
import {client, gridUpdate} from "../../../../api/client";
import {ISODateString} from "../../../../helpers/helpers";
import {Input} from "antd";
import TextArea from "antd/es/input/TextArea";
import {selectLightStyles} from "../../../../styles/selectStyles";

interface PropTypes {
  dispatch: (value: any) => void;
  dispatchNotification: (value: any) => void;
  item?: ClassroomType;
}

const CreateClassroomPopupBody: React.FC<PropTypes> = ({item, ...props}) => {
  const {data, loading, error} = useQuery(GET_DEPARTMENTS, {variables: {where: {}}});
  const [createClassroom] = useMutation(CREATE_CLASSROOM);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState({value: -1, label: 'Не кафедральна аудиторія'});
  const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm();

  useEffect(() => {
    setDepartments(data?.departments.map((dep: Department) => ({value: dep.id, label: dep.name})));

  }, [data?.departments]);

  const onSubmit = async (data: any) => {
    await createClassroom({
      variables: {
        data: {
          name: data.name,
          special: data.special ? 'PIANO' : null,
          floor: Number(data.floor),
          isWing: data.isWing,
          isOperaStudio: data.isOperaStudio,
          description: data.description,
          chair: selectedDepartment.value !== -1 ? {connect: {id: selectedDepartment.value}} : null,
          orderIndex: 0,
        }
      }
    });
    await client.query({
      query: GET_CLASSROOMS,
      variables: {date: ISODateString(new Date())},
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

  return <div className={styles.wrapper}>
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)} id='createClassroom'>
      <label>Назва
        <Input
          name="name"
          onChange={(e) => setValue('name', e.target.value)}
          placeholder="Наприклад: ФМЗ, 23А, 114..."
          defaultValue={item ? item.name : undefined}
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
      {data?.departments &&
      <label>Кафедра
          <Select
          value={selectedDepartment}
          onChange={handleSelectDepartment}
          options={departments}
          //@ts-ignore
          styles={selectLightStyles}
          menuPortalTarget={document.body}
          />
      </label>}
      <label>Спеціалізована
        <input {...register("special")} type="checkbox"
               checked={item ? Boolean(item.special) : false}/>
      </label>
      <label>Флігель
        <input {...register("isWing")} type="checkbox"
               checked={item ? item.isWing : false}/>
      </label>
      <label>Оперна студія
        <input {...register("isOperaStudio")} type="checkbox"
               checked={item ? item.isOperaStudio : false}/>
      </label>
      <label>Поверх
        <input {...register("floor")} type="number" min={1} max={4}
               defaultValue={item ? item.floor as number: 1}/>
      </label>
    </form>
  </div>
};

export default CreateClassroomPopupBody;