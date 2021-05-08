import React, {useEffect, useState} from 'react';
import Header from "../../../components/header/Header";
import Add from "../../../components/icons/add/Add";
import DataList from "../../../components/dataList/DataList";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import {useMutation} from "@apollo/client";
import {useNotification} from "../../../components/notification/NotificationProvider";
import {Degree} from "../../../models/models";
import styles from "../departments/adminDepartments.module.css";
import Edit from "../../../components/icons/edit/Edit";
import Delete from "../../../components/icons/delete/Delete";
import Button from "../../../components/button/Button";
import CreateDegreePopupBody from "./createDegreePopupBody/CreateDegreePopupBody";
import useDegrees from "../../../hooks/useDegrees";
import {DELETE_DEGREE} from "../../../api/operations/mutations/deleteDegree";

const listHeader = ['ID', 'Назва'];

const AdminDegrees = () => {
  const dispatchPopupWindow = usePopupWindow();
  const [updateList, setUpdateList] = useState(false);
  const degrees = useDegrees(updateList);
  const [deleteFaculty] = useMutation(DELETE_DEGREE);
  const dispatchNotification = useNotification();
  const [listData, setListData] = useState<any>([]);
  const dataItem = (item: Degree) => <>
    <span className={styles.centerText}>{item.id}</span>
    <span>{item.name}</span>
    <Edit dark onClick={() => handleAdd(item)}/>
    <Delete onClick={() => handleDelete(item.id)}/>
  </>;

  useEffect(() => {
    const data = degrees.map(item => dataItem(item));

    setListData(data);
  }, [degrees]);

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

  const handleAdd = (item: Degree | null = null) => {
    dispatchPopupWindow({
      header: <h1>{item ? 'Редагування учбового ступеню' : 'Створити учбовий ступінь'}</h1>,
      body: <CreateDegreePopupBody setUpdateList={setUpdateList} handleErrorDetails={handleErrorDetails}
                                       dispatchNotification={dispatchNotification} item={item}/>,
      footer: <Button type='submit' form='createDegree'>
        {item ? 'Зберегти зміни' : 'Створити'}
      </Button>
    });
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Ви дійсно бажаєте видалити учбовий ступінь?');

    if (confirm) {
      try {
        await deleteFaculty({variables: {where: {id}}});
        setUpdateList(prevState => !prevState);
        dispatchNotification({
          header: "Успішно!",
          message: `Учбовий ступінь видалено.`,
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

  return (
    <div>
      <Header>
        <h1>Управління учбовими ступенями</h1>
        <Add onClick={() => handleAdd()}/>
      </Header>
      <DataList header={listHeader} data={listData} gridTemplateColumns={'40px 1fr 40px 40px'}/>
    </div>
  );
};

export default AdminDegrees;