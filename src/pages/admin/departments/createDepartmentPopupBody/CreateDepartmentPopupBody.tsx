import React, {useEffect, useState} from 'react';
import Select from "react-select";
import useFaculties from "../../../../hooks/useFaculties";
import {selectLightStyles} from "../../../../styles/selectStyles";
import mainStyles from '../../../../styles/main.module.css';
import {useMutation} from "@apollo/client";
import {CREATE_DEPARTMENT} from "../../../../api/operations/mutations/createDepartment";
import {useForm} from "react-hook-form";
import {FormData} from "../../instruments/models";
import {UPDATE_DEPARTMENT} from "../../../../api/operations/mutations/updateDepartment";
import {Department, Faculty} from "../../../../models/models";

interface PropTypes {
  dispatchNotification: (value: any) => void;
  dispatch?: (value: any) => void;
  item: Department | null
}

const CreateDepartmentPopupBody: React.FC<PropTypes> = ({dispatchNotification, dispatch,
        item}) => {
  const faculties = useFaculties();
  const [createDepartment] = useMutation(CREATE_DEPARTMENT);
  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT);
  const [selectValue, setSelectValue] = useState({value: -1, label: ''});
  const [options, setOptions] = useState<any>(selectValue);
  const {register, handleSubmit, watch, formState: {errors}} = useForm<FormData>();

  useEffect(() => {
    const data = faculties.map(item => ({value: item.id, label: item.name}));
    if (item) {
      const faculty: Faculty | undefined = faculties.find(f => f.id === item?.faculty.id);

      setSelectValue({value: faculty?.id as number, label: faculty?.name as string});
    } else {
      setSelectValue(data[0]);
    }
    setOptions(data);
  }, [faculties]);

  const onSubmit = async (e: any) => {
    if (item) {
      try {
        await updateDepartment({
          variables: {
            data: {
              name: {set: e.name},
              faculty: item ? {connect: {id: selectValue.value}} : undefined
            },
            where: {
              id: Number(item?.id)
            }
          }
        });
        dispatchNotification({
          header: "Успішно!",
          message: `Дані збережено.`,
          type: "ok",
        });
        dispatch && dispatch({
          type: "POP_POPUP_WINDOW",
        });
      } catch (e) {
        console.log(e)
        dispatchNotification({
          header: "Помилка!",
          message: `Щось пішло не так.`,
          type: "alert",
        });
      }
    } else {
      try {
        await createDepartment({
          variables: {
            data: {
              name: e.name,
              faculty: {
                connect: {id: selectValue.value}
              }
            }
          }
        });
        dispatchNotification({
          header: "Успішно!",
          message: `Кафедру створено.`,
          type: "ok",
        });
        dispatch && dispatch({
          type: "POP_POPUP_WINDOW",
        });
      } catch (e) {
        console.log(e)
        dispatchNotification({
          header: "Помилка!",
          message: `Щось пішло не так.`,
          type: "alert",
        });
      }
    }
  };

  const handleSelect = (e: any) => {
    setSelectValue(e);
  };

  return (
    <form id='createDepartment' onSubmit={handleSubmit(onSubmit)}>
      {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
      <label>
        Назва
        <input className={mainStyles.input} type="text"
               defaultValue={item ? item?.name : undefined}
               {...register("name", {required: true})}/>
      </label>
      <label>
        Факультет
        {/*@ts-ignore*/}
        <Select options={options} styles={selectLightStyles} menuPortalTarget={document.body}
                placeholder='Виберіть факультет' defaultValue={selectValue} value={selectValue}
                onChange={handleSelect}
        />
      </label>
    </form>
  );
}

export default CreateDepartmentPopupBody;