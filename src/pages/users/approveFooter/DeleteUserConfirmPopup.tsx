import React from "react";
import {client} from "../../../api/client";
import {DELETE_USER} from "../../../api/operations/mutations/deleteUser";
import {ErrorCodes, ErrorCodesUa} from "../../../models/models";
import Button from "../../../components/button/Button";
import handleOperation from "../../../helpers/handleOperation";


type PropTypes = {
  dispatchNotification: (value: any) => void;
  dispatch?: (value: any) => void;
  userId: number;
}

const DeleteUserConfirmPopup: React.FC<PropTypes> = ({dispatch, dispatchNotification, userId}) => {
  const handleCancel = () => dispatch({type: "POP_POPUP_WINDOW"});
  const handleOk = async () => {
    const operation = client.mutate({
      mutation: DELETE_USER,
      variables: {
        where: {
          id: userId
        }
      },
      update(cache) {
        cache.modify({
          fields: {
            users(existingUsersRefs, {readField}) {
              return existingUsersRefs.filter(
                (userRef: any) => userId !== readField('id', userRef),
              );
            },
          },
        })
      }
    })
    await handleOperation(operation, 'deleteOneUser', dispatchNotification, dispatch, 'Користувача видалено.');
  };

  return (
    <>
      <Button
        color='blue'
        style={{marginRight: 8, height: 40}}
        onClick={handleCancel}
      >
        Відміна
      </Button>
      <Button
        color='red'
        onClick={handleOk}
      >
        Видалити користувача
      </Button>
    </>
  )
};

export default DeleteUserConfirmPopup;