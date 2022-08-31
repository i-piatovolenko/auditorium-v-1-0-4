import React from 'react';
import {useQuery} from "@apollo/client";
import {CRASH_MODE} from "../../../../api/operations/queries/crashMode";
import {usePopupWindow} from "../../../../components/popupWindow/PopupWindowProvider";
import {useNotification} from "../../../../components/notification/NotificationProvider";
import {client} from "../../../../api/client";
import {CRASH_MODE_SWITCH_ON} from "../../../../api/operations/mutations/crashModeSwitchOn";
import moment from "moment";
import handleOperation from "../../../../helpers/handleOperation";
import {CRASH_MODE_SWITCH_OFF} from "../../../../api/operations/mutations/crashModeSwitchOff";
import ConfirmCrashModeBody from "../ConfirmCrashModeBody";
import Button from "../../../../components/button/Button";

function CrashModeSettingsSection() {
  const {data, loading, error} = useQuery(CRASH_MODE);
  const dispatchPopupWindow = usePopupWindow();
  const dispatchNotification = useNotification();

  const handleCrashModeOn = async (until: string, comment: string, dispatch: any) => {
    try {
      const result = await client.mutate({
        mutation: CRASH_MODE_SWITCH_ON,
        variables: {
          input: {
            until: until ? moment(until).toISOString() : null,
            comment
          }
        }
      });
      handleOperation(result, 'crashModeSwitchOn', dispatchNotification, dispatch, 'Режим невідповідності даних увімкнено');
      await client.query({query: CRASH_MODE, fetchPolicy: 'network-only'})
    } catch (e) {
      console.log(e);
    }
  };

  const handleCrashModeOff = async (dispatch: any) => {
    try {
      const result = await client.mutate({
        mutation: CRASH_MODE_SWITCH_OFF
      });
      handleOperation(result, 'crashModeSwitchOff', dispatchNotification, dispatch, 'Режим невідповідності даних вимкнено');
      await client.query({query: CRASH_MODE, fetchPolicy: 'network-only'})
    } catch (e) {
      console.log(e);
    }
  };

  const confirmCrashModeOn = () => {
    dispatchPopupWindow({
      header: <h1>Увага!</h1>,
      body: (
        <ConfirmCrashModeBody handleCrashModeOn={handleCrashModeOn}/>
      ),
      footer: ''
    })
  };

  const ConfirmCrashModeOffFooter = ({dispatch}: any) => (
    <>
      <Button onClick={() => handleCrashModeOff(dispatch)}>Підтвердити</Button>
    </>
  )

  const confirmCrashModeOff = () => {
    dispatchPopupWindow({
      header: <h1>Увага!</h1>,
      body: <p>Ви дійсно бажаєте вимкнути режим невідповідності даних?</p>,
      footer: <ConfirmCrashModeOffFooter/>
    })
  };
  return (
    <div>
      {data?.crashMode.isActive ? (
        <>
          <p>Режим невідповідності даних увімкнено
            {data.crashMode.until && <> до <b> {moment(data?.crashMode.until).format('DD.MM.YYYY HH:mm')}</b></>}
            .
          </p>
          <p>Причина: {data.crashMode.comment || 'відсутня'}.</p>
          <Button onClick={confirmCrashModeOff}>
            Вимкнути режим невідповідности даних
          </Button>
        </>
      ) : (
        <>
          <p>Режим невідповідності даних вимкнено.</p>
          <Button onClick={confirmCrashModeOn}>
            Увімкнути режим невідповідности даних
          </Button>
        </>
      )}
    </div>
  );
}

export default CrashModeSettingsSection;