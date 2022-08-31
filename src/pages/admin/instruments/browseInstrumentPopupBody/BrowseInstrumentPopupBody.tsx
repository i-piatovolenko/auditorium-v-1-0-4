import React from 'react';
import styles from './browseInstrumentPopupBody.module.css';
import {InstrumentType} from "../../../../models/models";

interface PropTypes {
  instrument: InstrumentType;
}

const BrowseInstrumentPopupBody: React.FC<PropTypes> = ({instrument}) => {
  const {id, name, persNumber, type, rate, classroom: {name: classroomName}} = instrument;

  return (
    <div className={styles.list}>
      <div><span>ID: </span><span>{id}</span></div>
      <div><span>Назва: </span><span>{name}</span></div>
      <div><span>Інв. номер: </span><span>{persNumber}</span></div>
      <div><span>Тип: </span><span>{type}</span></div>
      <div><span>Рейтинг: </span><span>{rate}</span></div>
      {classroomName && <div><span>Аудиторія: </span><span>{classroomName}</span></div>}
    </div>
  );
}

export default BrowseInstrumentPopupBody;