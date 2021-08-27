import React from 'react';
import {ClassroomType, QueuePolicyTypes} from "../../../../models/models";
import styles from './browseClassroomPopupBody.module.css';

interface PropTypes {
  classroom: ClassroomType;
}

const BrowseClassroomPopupBody: React.FC<PropTypes> = ({classroom}) => {
  return (
    <div className={styles.list}>
      <div><span>ID: </span><span>{classroom.id}</span></div>
      <div><span>Назва: </span><span>{classroom.name}</span></div>
      <div><span>Опис: </span><span>{classroom.description}</span></div>
      <div><span>Поверх: </span><span>{classroom.floor}</span></div>
      <div><span>Кафедра: </span><span>{classroom.chair ? classroom.chair.name : '-'}</span></div>
      <div><span>Спеціалізована: </span><span>{classroom.special ? 'так' : 'ні'}</span></div>
      <div><span>Флігель: </span><span>{classroom.isWing ? 'так' : 'ні'}</span></div>
      <div><span>Оперна студія: </span><span>{classroom.isOperaStudio ? 'так' : 'ні'}</span></div>
      <div><span>Прихована: </span><span>{classroom.isHidden ? 'так' : 'ні'}</span></div>
      {classroom.queueInfo.queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS && (
        <div>
          <span>Заблокована для всіх, окрім: </span>
          <span>
         {classroom.queueInfo.queuePolicy.queueAllowedDepartments.map(({department}) => {
           return department.name
         }).join(', ')}
        </span>
        </div>
      )}
      <div><span>Інструменти: </span>{classroom.instruments?.length > 0 ? <ul className={styles.instruments}>
        {classroom.instruments.map(item => <li key={item.id}>{item.name}</li>)}
      </ul> : '-'}</div>
    </div>
  );
}

export default BrowseClassroomPopupBody;