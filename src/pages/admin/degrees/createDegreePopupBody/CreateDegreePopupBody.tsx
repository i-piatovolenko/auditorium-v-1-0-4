import React from 'react';
import mainStyles from '../../../../styles/main.module.css';
import {useMutation} from "@apollo/client";
import {useForm} from "react-hook-form";
import {Degree} from "../../../../models/models";
import {CREATE_DEGREE} from "../../../../api/operations/mutations/createDegree";
import {UPDATE_DEGREE} from "../../../../api/operations/mutations/updateDegree";

interface PropTypes {
  setUpdateList: (value: any) => void;
  dispatchNotification: (value: any) => void;
  dispatch?: (value: any) => void;
  item: Degree | null;
  handleErrorDetails?: (error: any) => void;
}

const CreateDegreePopupBody: React.FC<PropTypes> = ({setUpdateList, dispatchNotification, dispatch,
    handleErrorDetails, item}) => {
  const [createDegree] = useMutation(CREATE_DEGREE);
  const [updateDegree] = useMutation(UPDATE_DEGREE);
  const {register, handleSubmit, watch, formState: {errors}} = useForm<any>();

  const onSubmit = async (e: any) => {
    if (item) {
      try {
        await updateDegree({
          variables: {
            data: {
              name: {set: e.name},
              startMonth: {set: Number(e.startMonth)},
              startDay: {set: Number(e.startDay)},
              durationMonths: {set: Number(e.durationMonths)},
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
        setUpdateList((prevState: any) => !prevState);
        dispatch && dispatch({
          type: "POP_POPUP_WINDOW",
        });
      } catch (e) {
        console.log(e)
        dispatchNotification({
          header: "Помилка!",
          message:  <><span>Щось пішло не так.</span><br/>
            <span style={{color: '#2b5dff', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => handleErrorDetails && handleErrorDetails(e)}>Деталі</span></>,
          type: "alert",
        });
      }
    } else {
      try {
        await createDegree({
          variables: {
            data: {
              name: e.name,
              startMonth: Number(e.startMonth),
              startDay: Number(e.startDay),
              durationMonths: Number(e.durationMonths),
            }
          }
        });
        dispatchNotification({
          header: "Успішно!",
          message: `Учбовий ступінь створено.`,
          type: "ok",
        });
        setUpdateList((prevState: any) => !prevState);
        dispatch && dispatch({
          type: "POP_POPUP_WINDOW",
        });
      } catch (e) {
        console.log(e)
        dispatchNotification({
          header: "Помилка!",
          message:  <><span>Щось пішло не так.</span><br/>
            <span style={{color: '#2b5dff', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => handleErrorDetails && handleErrorDetails(e)}>Деталі</span></>,
          type: "alert",
        });
      }
    }
  };

  return (
    <form id='createDegree' onSubmit={handleSubmit(onSubmit)}>
      {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
      <label>
        Назва
        <input className={mainStyles.input} type="text"
               defaultValue={item ? item?.name : undefined}
               {...register("name", {required: true})}/>
      </label>
      {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
      <label>
        Місяць початку
        <input className={mainStyles.input} type="number" min={1} max={12}
               defaultValue={item ? item?.startMonth : 9}
               {...register("startMonth", {required: true})}/>
      </label>
      {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
      <label>
        День початку
        <input className={mainStyles.input} type="number" min={1} max={31}
               defaultValue={item ? item?.startDay : 1}
               {...register("startDay", {required: true})}/>
      </label>
      {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
      <label>
        Триваліть (міс.)
        <input className={mainStyles.input} type="number" min={1}
               defaultValue={item ? item?.durationMonths : 12}
               {...register("durationMonths", {required: true})}/>
      </label>
    </form>
  );
}

export default CreateDegreePopupBody;