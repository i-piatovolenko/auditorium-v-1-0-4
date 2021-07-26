import React, {useState} from 'react';
import styles from "./classroom/classroom.module.css";

type PropTypes = {
  onSubmit: (comment: string, until: string) => void;
};

const DisableClassroom: React.FC<PropTypes> = ({onSubmit}) => {
  const [comment, setComment] = useState('');
  const [until, setUntil] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(comment, until);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} id='disableClassroomForm'>
        <label className={styles.disableClassroomInput}>
          <span>Причина блокування:</span>
          <input type='text' placeholder='Проведення конкурсу, ремонт, тощо...' value={comment}
                 onChange={(e) => {
                   setComment(e.target.value)
                 }}
                 name='disableComment'
          />
        </label>
        <label className={styles.disableClassroomInput}>
          <span>До:</span>
          <input type="datetime-local" value={until}
                 onChange={(e => setUntil(e.target.value))}
                 name='disableUntil'
          />
        </label>
      </form>
    </div>
  );
};

export default DisableClassroom;