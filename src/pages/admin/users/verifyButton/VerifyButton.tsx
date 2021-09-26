import React from 'react';
import Button from "../../../../components/button/Button";
import DeleteUserConfirmPopup from "../../../users/approveFooter/DeleteUserConfirmPopup";

type PropTypes = {
  verify: () => void;
  dispatch?: any;
  dispatchPopupWindow: (value: any) => any;
  dispatchNotification: (value: any) => any;
  userId: number;
}

const VerifyButton: React.FC<PropTypes> = ({verify, dispatch, dispatchPopupWindow, dispatchNotification, userId}) => {
  const handleVerify = () => {
    verify();
    dispatch({
      type: "POP_POPUP_WINDOW",
    });
  };

  const handleConfirmDelete = () => {
    dispatchPopupWindow({
      header: <h1>Бажаєте видалити користувача?</h1>,
      body: <p>Цю дію неможливо буде відмінити</p>,
      footer: <DeleteUserConfirmPopup
        dispatchNotification={dispatchNotification}
        userId={userId}
        dispatch={dispatch}
      />,
      isConfirm: true,
    })
  }

  return (
    <>
      <Button
        onClick={handleConfirmDelete}
        style={{marginRight: 8, height: 40}}
        color='red'
      >
        Видалити
      </Button>
      <Button onClick={handleVerify}>Верифікувати</Button>
    </>
  );
}

export default VerifyButton;