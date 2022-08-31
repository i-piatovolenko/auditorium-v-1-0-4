import React, {useEffect} from 'react';
import {useLocal} from "../../hooks/useLocal";
import styles from "../../pages/classrooms/classrooms.module.css";
import Button from "../button/Button";

type PropTypes = {};

const ErrorHandler: React.FC<PropTypes> = ({children}) => {
  const {data: {networkError}} = useLocal('networkError');

  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    console.log('networkError', networkError);
  }, [networkError]);

  return (
    <>
      {networkError && <div className={styles.updateDataModal}>
          <div className={styles.popup}>
              <p>Відсутнє з'єднання</p>
              <Button onClick={handleReload}>Перезавантажити</Button>
          </div>
      </div>}
      {children}
    </>
  );
}

export default ErrorHandler;