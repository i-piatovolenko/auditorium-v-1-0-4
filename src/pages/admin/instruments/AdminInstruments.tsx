import React, {useEffect, useState} from 'react';
import useInstruments from "../../../hooks/useInstruments";
import Header from "../../../components/header/Header";
import DataList from "../../../components/dataList/DataList";
import styles from './adminInstruments.module.css';
import Edit from "../../../components/icons/edit/Edit";
import Delete from "../../../components/icons/delete/Delete";
import Add from "../../../components/icons/add/Add";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import {useNotification} from "../../../components/notification/NotificationProvider";
import CreateInstrumentPopupBody from "./createInstrumentPopupBody/CreateInstrumentPopupBody";
import Button from "../../../components/button/Button";
import {useMutation} from "@apollo/client";
import {DELETE_INSTRUMENT} from "../../../api/operations/mutations/deleteInstrument";
import {ClassroomType, InstrumentType} from "../../../models/models";
import BrowseClassroomPopupBody from "../classrooms/browseClassroomPopupBody/BrowseClassroomPopupBody";
import BrowseInstrumentPopupBody from "./browseInstrumentPopupBody/BrowseInstrumentPopupBody";

const dataHeader = ['ID', 'Назва', 'Рейтинг', 'Ауд.', 'Інв. номер'];

const AdminInstruments = () => {
  const [updateList, setUpdateList] = useState(false);
  const instruments = useInstruments(updateList);
  const [listData, setListData] = useState<Array<any>>([]);
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();
  const [deleteInstrument] = useMutation(DELETE_INSTRUMENT);
  const instrument = (item: InstrumentType) => <>
    <span className={styles.alignText}>{item.id}</span>
    <span>{item.name}</span>
    <span className={styles.alignText}>{item.rate}</span>
    <span className={styles.alignText}>{item.classroom?.name}</span>
    <span className={styles.alignText}>{item.persNumber}</span>
    <Edit dark onClick={() => handleAdd(item, true)}/>
    <Delete onClick={() => handleDelete(item.id)}/>
  </>;

  useEffect(() => {
    setListData(instruments?.map((item) => instrument(item)));
  }, [instruments]);

  const handleErrorDetails = (e: any) => {
    dispatchPopupWindow({
      header: <h1>{e.name}</h1>,
      body: <>
        <p>{e.message}</p>
      </>,
      footer: ''
    })
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Ви дійсно бажаєте видалити інструмент?');

    if (confirm) {
      try {
        await deleteInstrument({variables: {where: {id}}});
        dispatchNotification({
          header: "Успішно!",
          message: `Інструмент видалено.`,
          type: "ok",
        });
        setUpdateList(prevState => !prevState);
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

  const handleUpdate = () => {
    setUpdateList(prevState => !prevState);
  };

  const handleAdd = (item: InstrumentType | null = null, isEditMode = false) => {
    dispatchPopupWindow({
      header: <h1>{isEditMode ? 'Редагувати інструмент' : 'Створити інструмент'}</h1>,
      body: <CreateInstrumentPopupBody dispatchNotification={dispatchNotification} onUpdate={handleUpdate}
          addInstrument={addInstrument} instrument={item} isEditMode={isEditMode}
          handleErrorDetails={handleErrorDetails}
      />,
      footer: <Button type='submit' form='createInstrument'>
        {isEditMode ? 'Зберегти зміни' : 'Створити'}
      </Button>,
    });
  };

  const handleItemClick = (id: number) => {
    const instrument = instruments?.find(item => item.id === id);
    dispatchPopupWindow({
      header: <h1>{instrument?.name}</h1>,
      body: <BrowseInstrumentPopupBody instrument={instrument as InstrumentType}/>,
      footer: ''
    });
  };

  const addInstrument = (item: InstrumentType) => {
    setListData(prevState => [...prevState, instrument(item)]);
  };

  return (
    <div>
      <Header>
        <h1>Управління інструментами</h1>
        <Add onClick={handleAdd}/>
      </Header>
      <DataList header={dataHeader} data={listData}
                gridTemplateColumns={'40px 250px 100px 100px 1fr 30px 30px'}
                handleItemClick={handleItemClick}
      />
    </div>
  );
}

export default AdminInstruments;