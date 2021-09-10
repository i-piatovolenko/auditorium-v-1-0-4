import React from "react";
import Button from "../button/Button";
import styles from "../classroom/classroom.module.css";

type PropTypes = {
  onOk: () => void;
}

const ConfirmFooter: React.FC<PropTypes> = (props) => {

  const handleClose = () => {
    // @ts-ignore
    props.dispatch({
      type: "POP_POPUP_WINDOW",
    });
  };

  const handleOk = () => {
    props.onOk();
    handleClose();
  };

  return (
    <div className={styles.footer}>
          <Button color='red' onClick={handleClose}>Відмінити</Button>
          <Button onClick={handleOk}>Підтвердити</Button>
    </div>
  );
}
;

export default ConfirmFooter;
