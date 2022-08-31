import React, {useEffect, useState} from 'react';
import Header from "../../../components/header/Header";
import Add from "../../../components/icons/add/Add";
import DataList from "../../../components/dataList/DataList";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import {useMutation} from "@apollo/client";
import {useNotification} from "../../../components/notification/NotificationProvider";
import {Faculty} from "../../../models/models";
import styles from "../departments/adminDepartments.module.css";
import Edit from "../../../components/icons/edit/Edit";
import Delete from "../../../components/icons/delete/Delete";
import useFaculties from "../../../hooks/useFaculties";
import Button from "../../../components/button/Button";
import CreateFacultyPopupBody from "./createFacultyPopupBody/CreateFacultyPopupBody";
import {DELETE_FACULTY} from "../../../api/operations/mutations/deleteFaculty";

const listHeader = ['ID', 'Назва'];

const AdminFaculties = () => {
  const dispatchPopupWindow = usePopupWindow();
  const [updateList, setUpdateList] = useState(false);
  const faculties = useFaculties(updateList);
  const [deleteFaculty] = useMutation(DELETE_FACULTY);
  const dispatchNotification = useNotification();
  const [listData, setListData] = useState<any>([]);
  const dataItem = (item: Faculty) => <>
    <span className={styles.centerText}>{item.id}</span>
    <span>{item.name}</span>
    <Edit dark onClick={() => handleAdd(item)}/>
    <Delete onClick={() => handleDelete(item.id)}/>
  </>;

  useEffect(() => {
    const data = faculties.map(item => dataItem(item));

    setListData(data);
  }, [faculties]);

  const handleAdd = (item: Faculty | null = null) => {
    dispatchPopupWindow({
      header: <h1>{item ? 'Редагування факультету' : 'Створити факультет'}</h1>,
      body: <CreateFacultyPopupBody setUpdateList={setUpdateList}
                                       dispatchNotification={dispatchNotification} item={item}/>,
      footer: <Button type='submit' form='createFaculty'>
        {item ? 'Зберегти зміни' : 'Створити'}
      </Button>
    });
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Ви дійсно бажаєте видалити факультет?');

    if (confirm) {
      try {
        await deleteFaculty({variables: {where: {id}}});
        setUpdateList(prevState => !prevState);
        dispatchNotification({
          header: "Успішно!",
          message: `Факультет видалено.`,
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
        <h1>Управління факультетами</h1>
        <Add onClick={() => handleAdd()}/>
      </Header>
      <DataList header={listHeader} data={listData} gridTemplateColumns={'40px 1fr 40px 40px'}/>
    </div>
  );
};

export default AdminFaculties;