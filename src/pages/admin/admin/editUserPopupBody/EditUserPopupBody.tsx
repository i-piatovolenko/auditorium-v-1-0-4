import React from 'react';
import {User} from "../../../../models/models";
import styles from './editUserPopupBody.module.css';

interface PropTypes {
  user: User;
}

const EditUserPopupBody: React.FC<PropTypes> = ({user}) =>  {
  return (
    <div>
      <div className={styles.userInfo}>
        <div>
          test
        </div>
      </div>
    </div>
  );
}

export default EditUserPopupBody;