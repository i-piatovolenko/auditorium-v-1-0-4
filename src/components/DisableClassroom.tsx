import React, {useState} from 'react';
import styles from "./classroom/classroom.module.css";
import Button from "./button/Button";
import moment from "moment";

type PropTypes = {
  onSubmit: (comment: string, until: string) => void;
};

const TIME_VALUES = ['До 20:00', 'До кінця дня'];

const DisableClassroom: React.FC<PropTypes> = ({onSubmit}) => {
  const [comment, setComment] = useState('');
  const [until, setUntil] = useState('');
  const [selectedUntilIndex, setSelectedUntilIndex] = useState(-1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(comment, until);
  };

  const handleCommentButtonClick = (e: any) => {
    e.preventDefault();
    setComment(e.target.innerHTML);
  };

  const handleUntilChange = (e: any) => {
    setUntil(e.target.value);
    setSelectedUntilIndex(-1);
  };

  const handleExactTime = (value: string, index: number) => {
    const until20 = moment().set({hours: 20, minutes: 0, seconds: 0, millisecond: 0}).format('YYYY-MM-DDTHH:mm');
    const untilEndOfDay = moment().endOf('day').format('YYYY-MM-DDTHH:mm');

    setSelectedUntilIndex(index);

    switch (value) {
      case TIME_VALUES[0]: return setUntil(until20 as unknown as string);
      case TIME_VALUES[1]: return setUntil(untilEndOfDay as unknown as string);
      default: return setUntil('');
    }
  }

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
        <div className={styles.buttonsRow}>
          <Button
            onClick={handleCommentButtonClick}
            disabled={comment === 'За розкладом'}
          >
            За розкладом
          </Button>
          <Button
            onClick={handleCommentButtonClick}
            disabled={comment === 'Сесія'}
          >
            Сесія
          </Button>
        </div>
        <label className={styles.disableClassroomInput}>
          <span>До:</span>
          <input type="datetime-local" value={until}
                 onChange={handleUntilChange}
                 name='disableUntil'
          />
        </label>
        <div className={styles.buttonsRow}>
          {TIME_VALUES.map((value, index) => (
            <Button
              onClick={() => handleExactTime(value, index)}
              disabled={selectedUntilIndex === index}
            >
              {value}
            </Button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default DisableClassroom;