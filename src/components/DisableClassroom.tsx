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
  const [hours, setHours] = useState(23);
  const [minutes, setMinutes] = useState(59);
  const [until, setUntil] = useState(moment().format('YYYY-MM-DD'));
  const [selectedUntilIndex, setSelectedUntilIndex] = useState(-1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const untilDateTime = moment(until).set({
      hours,
      minutes
    }).format('YYYY-MM-DDTHH:mm');
    onSubmit(comment, untilDateTime);
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
    setSelectedUntilIndex(index);

    switch (value) {
      case TIME_VALUES[0]: {
        setHours(20);
        setMinutes(0)
        setUntil(moment().format('YYYY-MM-DD'));
        return;
      }
      case TIME_VALUES[1]: {
        setHours(23);
        setMinutes(59);
        setUntil(moment().format('YYYY-MM-DD'));
        return;
      }
      default:
        return setUntil('');
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
          <Button
            onClick={handleCommentButtonClick}
            disabled={comment === 'Відсутній ключ'}
          >
            Відсутній ключ
          </Button>
        </div>
        <label className={styles.disableClassroomInput}>
          <span>До:</span>
          <input type="date"
                 value={until}
                 onChange={handleUntilChange}
                 name='disableUntil'
                 min={moment().format('YYYY-MM-DD')}
          />
          <input
            type="number"
            min={0}
            max={23}
            value={hours}
            onChange={(e) => setHours(+e.target.value)}
          />
          <input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(+e.target.value)}
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