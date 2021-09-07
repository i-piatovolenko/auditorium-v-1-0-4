import React, {useEffect, useState} from 'react';
import Header from '../../../components/header/Header';
import styles from './adminClassrooms.module.css';
import {ClassroomType, DisabledState, QueuePolicyTypes} from "../../../models/models";
import {usePopupWindow} from "../../../components/popupWindow/PopupWindowProvider";
import CreateClassroomPopupBody from "./createClassroomPopupBody/CreateClassroomPopupBody";
import {useNotification} from "../../../components/notification/NotificationProvider";
import {useMutation, useQuery} from "@apollo/client";
import {DELETE_CLASSROOM} from "../../../api/operations/mutations/deleteClassroom";
import Add from "../../../components/icons/add/Add";
import Edit from "../../../components/icons/edit/Edit";
import Delete from "../../../components/icons/delete/Delete";
import DataList from "../../../components/dataList/DataList";
import Button from "../../../components/button/Button";
import BrowseClassroomPopupBody from "./browseClassroomPopupBody/BrowseClassroomPopupBody";
import {GET_CLASSROOMS} from "../../../api/operations/queries/classrooms";

const listHeader = ['Назва', 'Кафедра', 'Прихована', 'Відключена', 'Спец.', 'Оп. студія', 'Флігель'];

const AdminClassrooms = () => {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const {data, loading, error} = useQuery(GET_CLASSROOMS);
  const [listData, setListData] = useState<any>([]);
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();
  const [deleteClassroom] = useMutation(DELETE_CLASSROOM);
  const dataItem = (item: ClassroomType) => <>
    <span className={styles.centerText}
          style={{
            backgroundColor: item?.color ? item.color : '#ffffff00', borderRadius: 6,
            color: item.color === '#000000' || item.color === '#ff0000' ||
            item.color === '#0000ff' ? '#ffffff' : '#000000',
            padding: '2px 0'
          }}
    >{item.name}</span>
    <span>{item.chair?.name}</span>
    <span className={styles.centerText}>{item.isHidden ? 'Так' : 'Ні'}</span>
    <span className={styles.centerText}>
      {item.disabled.state === DisabledState.DISABLED ? 'Тимчасово'
        : (item.queueInfo.queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS
          && !item.queueInfo.queuePolicy.queueAllowedDepartments.length) ? 'Так' :
          (item.queueInfo.queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS
            && item.queueInfo.queuePolicy.queueAllowedDepartments.length) ? 'Частково' : 'Ні'}
    </span>
    <span className={styles.centerText}>{item.special ? 'Так' : 'Ні'}</span>
    <span className={styles.centerText}>{item.isOperaStudio ? 'Так' : 'Ні'}</span>
    <span className={styles.centerText}>{item.isWing ? 'Так' : 'Ні'}</span>
    <Edit dark onClick={() => handleCreate(item)}/>
    <Delete onClick={() => handleDelete(item.id)}/>
  </>;


  useEffect(() => {
    !loading && !error && setClassrooms(data.classrooms);
  }, [data, loading, error]);

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
        const result = await deleteClassroom({
          variables: {where: {id}},
          update(cache) {
            cache.modify({
              fields: {
                classrooms(existingClassroomsRefs, {readField}) {
                  return existingClassroomsRefs.filter(
                    (classroomRef: any) => id !== readField('id', classroomRef),
                  );
                },
              },
            })
          }
        });
        if (result.data.deleteOneClassroom.userErrors?.length) {
          result.data.deleteOneClassroom.userErrors.forEach(({message}: any) => {
            dispatchNotification({
              header: "Помилка",
              message,
              type: "alert",
            });
          })
        } else {
          dispatchNotification({
            header: "Успішно!",
            message: `Аудиторія видалена.`,
            type: "ok",
          });
        }
      } catch (e) {
        console.log(e)
        dispatchNotification({
          header: "Помилка!",
          message: <><span>Щось пішло не так.</span><br/>
            <span style={{color: '#2b5dff', cursor: 'pointer', textDecoration: 'underline'}}
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

  const handleItemClick = (name: string) => {
    const classroom = classrooms?.find(item => item.name === name);

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
                gridTemplateColumns={'55px 1fr 100px 100px 100px 80px 80px 40px 40px'}/>
    </div>
  );
}

export default AdminClassrooms;