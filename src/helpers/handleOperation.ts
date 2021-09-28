import {ErrorCodes, ErrorCodesUa} from "../models/models";

type clientOperationHandlerType = (
  operation: any,
  operationName: string,
  dispatchNotification: (value: any) => void,
  dispatch: (value: any) => void | null,
  successMessage?: string,
) => void;

const handleOperation: clientOperationHandlerType = async (
  operation, operationName, dispatchNotification, dispatch,
  successMessage = 'Операція успішна!'
) => {
  try {
    const result = await operation;
    if (result.data?.[operationName].userErrors?.length) {
      result.data?.[operationName].userErrors.forEach(({code}: any) => {
        dispatchNotification({
          header: "Помилка",
          message: ErrorCodesUa[code as ErrorCodes],
          type: "alert",
        });
      });
    } else if (result) {
      dispatchNotification({
        header: "Успішно!",
        message: successMessage,
        type: "ok",
      });
      dispatch && dispatch({type: "POP_ALL_POPUP_WINDOW"});
    }
  } catch (e: any) {
    dispatchNotification({
      header: "Помилка",
      message: JSON.stringify(e.message),
      type: "alert",
    });
  }
}

export default handleOperation;