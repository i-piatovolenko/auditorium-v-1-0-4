import React, {useState} from 'react';
import Button from "../../../button/Button";

const ChooseTime = {
  Header: () => <><h1>Виберіть час</h1></>,
  Body: ({until, setUntil}: any) => {
    const [value, setValue] = useState(until);

    const handleValueChange = (value: number) => {
      setValue(value);
      setUntil(value);
    };
    return (
      <form>
        <label>
          <input
            type='radio'
            name='time'
            checked={value === 3}
            onChange={() => handleValueChange(3)}
          />
          На 3 години
        </label>
        <label>
          <input
            type='radio'
            name='time'
            checked={value === -1}
            onChange={() => handleValueChange(-1)}
          />
          До кінця дня
        </label>
      </form>
    );
  },
  Footer: ({dispatch}: any) => <Button onClick={() => dispatch({type: 'POP_POPUP_WINDOW'})} color='red'>Закрити</Button>
}

export default ChooseTime;
