import React from 'react';
import Button from "../../../../components/button/Button";

type PropTypes = {
  verify: () => void;
  dispatch?: any;
}

const VerifyButton: React.FC<PropTypes> = ({verify, dispatch}) => {
  const handleVerify = () => {
    verify();
    dispatch({
      type: "POP_POPUP_WINDOW",
    });
  };

  return (
    <Button onClick={handleVerify}>Верифікувати</Button>
  );
}

export default VerifyButton;