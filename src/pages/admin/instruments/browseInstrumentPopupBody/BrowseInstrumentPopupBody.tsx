import React from 'react';
import styles from './browseInstrumentPopupBody.module.css';
import {InstrumentType} from "../../../../models/models";

interface PropTypes {
  instrument: InstrumentType;
}

const BrowseInstrumentPopupBody: React.FC<PropTypes> = ({instrument}) => {
  const {id, name, persNumber, type, rate,} = instrument;

  return (
    <div className={styles.list}>
      <div><span>ID: </span><span>{id}</span></div>
      <div><span>Назва: </span><span>{name}</span></div>
      <div><span>Інв. номер: </span><span>{persNumber}</span></div>
      <div><span>Тип: </span><span>{type}</span></div>
      <div><span>Рейтинг: </span><span>{rate}</span></div>
      {instrument.classroom?.name && (
        <div>
          <span>Аудиторія: </span>
          <span>{instrument?.classroom.name}</span>
        </div>
      )}
    </div>
  );
}

export default BrowseInstrumentPopupBody;