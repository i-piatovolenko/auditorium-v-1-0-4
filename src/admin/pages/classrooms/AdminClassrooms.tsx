import React, {useEffect, useState} from 'react';
import Header from '../../../components/header/Header';
import styles from './adminClassrooms.module.css';
import {ClassroomType} from "../../../models/models";
import useClassrooms from "../../../hooks/useClassrooms";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import CreateClassroomPopupBody from "./createClassroomPopupBody/CreateClassroomPopupBody";
import {useNotification} from "../../../components/notification/NotificationProvider";
import {useMutation} from "@apollo/client";
import {DELETE_CLASSROOM} from "../../../api/operations/mutations/deleteClassroom";
import Add from "../../../components/icons/add/Add";
import Edit from "../../../components/icons/edit/Edit";
import Delete from "../../../components/icons/delete/Delete";
import DataList from "../../../components/dataList/DataList";
import Button from "../../../components/button/Button";
import BrowseClassroomPopupBody from "./browseClassroomPopupBody/BrowseClassroomPopupBody";
import Loader from "../../../components/loader/Loader";

const listHeader = ['ID', 'Назва', 'Кафедра', 'Спец.', 'Оп. студія', 'Флігель'];

const AdminClassrooms = () => {
  const classrooms: ClassroomType[] = useClassrooms();
  const [listData, setListData] = useState<any>([]);
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();
  const [deleteClassroom] = useMutation(DELETE_CLASSROOM);
  const dataItem = (item: ClassroomType) => <>
    <span className={styles.centerText}>{item.id}</span>
    <span className={styles.centerText}>{item.name}</span>
    <span>{item.chair?.name}</span>
    <span className={styles.centerText}>{item.special ? 'Так' : 'Ні'}</span>
    <span className={styles.centerText}>{item.isOperaStudio ? 'Так' : 'Ні'}</span>
    <span className={styles.centerText}>{item.isWing ? 'Так' : 'Ні'}</span>
    <Edit dark onClick={() => handleCreate(item)}/>
    <Delete onClick={() => handleDelete(item.id)}/>
  </>;

  useEffect(() => {
    const data = classrooms.map(item => dataItem(item));

    setListData(data);
  }, [classrooms]);

  const handleErrorDetails = (e: any) => {
    dispatchPopupWindow({
      header: <h1>{e.name}</h1>,
      body: <>
        <p>{e.message}</p>
        <p>{e.extraInfo}</p>
        <pre>{e.stack}</pre>
      </>,
      footer: ''
    });
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Ви дійсно бажаєте видалити аудиторію?');

    if (confirm) {
      try {
        await deleteClassroom({variables: {where: {id}}});
        dispatchNotification({
          header: "Успішно!",
          message: `Аудиторію видалено.`,
          type: "ok",
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

  const handleCreate = (item: ClassroomType | null = null) => {
    dispatchPopupWindow({
      header: <h1>{item ? 'Редагування аудиторії' : 'Створити аудиторію'}</h1>,
      //@ts-ignore
      body: <CreateClassroomPopupBody dispatchNotification={dispatchNotification} item={item}/>,
      footer: <Button type='submit' form='createClassroom'>
        {item ? 'Зберегти зміни' : 'Створити'}
      </Button>
    });
  };

  const handleItemClick = (id: number) => {
    const classroom = classrooms?.find(item => item.id === id);

    dispatchPopupWindow({
      header: <h1>{`Аудиторія ${classroom?.name}`}</h1>,
      body: <BrowseClassroomPopupBody classroom={classroom as ClassroomType}/>,
      footer: ''
    });
  };

  return (
    <div>
      <Header>
        <h1>Редагування аудиторій</h1>
        <Add onClick={() => handleCreate()}/>
      </Header>
      <DataList header={listHeader} data={listData} handleItemClick={handleItemClick}
                gridTemplateColumns={'40px 40px 1fr 100px 80px 80px 40px 40px'}/>
    </div>
  );
}

export default AdminClassrooms;