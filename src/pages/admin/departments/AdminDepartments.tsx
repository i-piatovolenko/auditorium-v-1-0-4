import React, {useEffect, useState} from 'react';
import Header from "../../../components/header/Header";
import Add from "../../../components/icons/add/Add";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import CreateDepartmentPopupBody from "./createDepartmentPopupBody/CreateDepartmentPopupBody";
import Button from "../../../components/button/Button";
import DataList from "../../../components/dataList/DataList";
import useDepartments from "../../../hooks/useDepartments";
import {Department} from "../../../models/models";
import Edit from "../../../components/icons/edit/Edit";
import Delete from "../../../components/icons/delete/Delete";
import styles from './adminDepartments.module.css';
import {useMutation} from "@apollo/client";
import {DELETE_DEPARTMENT} from "../../../api/operations/mutations/deleteDepartment";
import {useNotification} from "../../../components/notification/NotificationProvider";

const listHeader = ['ID', 'Назва'];

const AdminDepartments = () => {
  const dispatchPopupWindow = usePopupWindow();
  const departments = useDepartments();
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT);
  const dispatchNotification = useNotification();
  const [listData, setListData] = useState<any>([]);
  const dataItem = (item: Department) => <>
    <span className={styles.centerText}>{item.id}</span>
    <span>{item.name}</span>
    <Edit dark onClick={() => handleAdd(item)}/>
    <Delete onClick={() => handleDelete(item.id)}/>
  </>;

  useEffect(() => {
    const data = departments.map(item => dataItem(item));
    setListData(data);
  }, [departments]);

  const handleAdd = (item: Department | null = null) => {
    dispatchPopupWindow({
      header: <h1>{item ? 'Редагування кафедри' : 'Створити кафедру'}</h1>,
      body: <CreateDepartmentPopupBody
              dispatchNotification={dispatchNotification} item={item}/>,
      footer: <Button type='submit' form='createDepartment'>
        {item ? 'Зберегти зміни' : 'Створити'}
      </Button>
    });
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Ви дійсно бажаєте видалити кафедру?');

    if (confirm) {
      try {
        await deleteDepartment({variables: {where: {id}}});
        dispatchNotification({
          header: "Успішно!",
          message: `Кафедру видалено.`,
          type: "ok",
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
    <div>
      <Header>
        <h1>Управління кафедрами</h1>
        <Add onClick={() => handleAdd()}/>
      </Header>
      <DataList header={listHeader} data={listData} gridTemplateColumns={'40px 1fr 40px 40px'}/>
    </div>
  );
}

export default AdminDepartments;