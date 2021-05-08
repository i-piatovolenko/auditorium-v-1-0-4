import React from 'react';
import mainStyles from '../../../../styles/main.module.css';
import {useMutation} from "@apollo/client";
import {useForm} from "react-hook-form";
import {FormData} from "../../instruments/models";
import {Faculty} from "../../../../models/models";
import {CREATE_FACULTY} from "../../../../api/operations/mutations/createFaculty";
import {UPDATE_FACULTY} from "../../../../api/operations/mutations/updateFaculty";

interface PropTypes {
  setUpdateList: (value: any) => void;
  dispatchNotification: (value: any) => void;
  dispatch?: (value: any) => void;
  item: Faculty | null
}

const CreateFacultyPopupBody: React.FC<PropTypes> = ({setUpdateList, dispatchNotification, dispatch,
                                                          item}) => {
  const [createFaculty] = useMutation(CREATE_FACULTY);
  const [updateFaculty] = useMutation(UPDATE_FACULTY);
  const {register, handleSubmit, watch, formState: {errors}} = useForm<FormData>();

  const onSubmit = async (e: any) => {
    if (item) {
      try {
        await updateFaculty({
          variables: {
            data: {
              name: {set: e.name},
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
          message: `Щось пішло не так.`,
          type: "alert",
        });
      }
    } else {
      try {
        await createFaculty({
          variables: {
            data: {
              name: e.name,
            }
          }
        });
        dispatchNotification({
          header: "Успішно!",
          message: `Факультет створено.`,
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
          message: `Щось пішло не так.`,
          type: "alert",
        });
      }
    }
  };

  return (
    <form id='createFaculty' onSubmit={handleSubmit(onSubmit)}>
      {errors.name && <span className={mainStyles.required}>Обов'язкове поле</span>}
      <label>
        Назва
        <input className={mainStyles.input} type="text"
               defaultValue={item ? item?.name : undefined}
               {...register("name", {required: true})}/>
      </label>
    </form>
  );
}

export default CreateFacultyPopupBody;