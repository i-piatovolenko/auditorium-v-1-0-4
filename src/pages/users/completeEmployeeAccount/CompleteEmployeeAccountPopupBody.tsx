import React, {useState} from 'react';
import CustomInput from "../../../components/customInput/CustomInput";
import {EMAIL_VALID} from "../../../helpers/validators";
import handleOperation from "../../../helpers/handleOperation";
import {client} from "../../../api/client";
import {COMPLETE_EMPLOYEE_ACCOUNT} from "../../../api/operations/mutations/completeEmployeeAccountRequestEmail";
import {GET_USERS} from "../../../api/operations/queries/users";

type PropTypes = {
  dispatchNotification: (value: any) => void;
  dispatch?: (value: any) => void;
  userId: number;
}

const CompleteEmployeeAccountPopupBody: React.FC<PropTypes> = ({dispatchNotification, userId, ...props}) => {
  const [email, setEmail] = useState('');
  const submitCompleteAccount = async (e: any) => {
    e.preventDefault();
    if (EMAIL_VALID.test(email)) {
      const completeEmployeeAccountRequestEmail = client.mutate({
        mutation: COMPLETE_EMPLOYEE_ACCOUNT,
        variables: {
          input: {
            email,
            userId
          }
        }
      });
      await handleOperation(completeEmployeeAccountRequestEmail, 'completeEmployeeAccountRequestEmail',
        dispatchNotification, props.dispatch, 'Лист надіслано')
      await client.query({
        query: GET_USERS
      });
    } else {
      dispatchNotification({
        header: "Помилка",
        message: 'Невірний формат e-mail',
        type: "alert",
      })
    }
  };

  return (
    <div>
      <p>Введіть e-mail адресу співробітника</p>
      <form id='completeEmployeeAccount' onSubmit={submitCompleteAccount}>
        <CustomInput
          theme='dark'
          label='E-mail адреса:'
          name='completeEmployeeAccount'
          id='completeEmployeeAccountInput'
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
      </form>
    </div>
  );
}

export default CompleteEmployeeAccountPopupBody;