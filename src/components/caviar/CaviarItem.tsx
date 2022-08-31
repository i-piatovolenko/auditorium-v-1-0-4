import React, {CSSProperties, useEffect, useState} from 'react';
import {ClassroomType, DisabledState, OccupiedState} from "../../models/models";
import Tag from "../tag/Tag";
import ClassroomInfo from "../ classroomInfo/ClassroomInfo";
import Footer from "../footer/Footer";
import {usePopupWindow} from "../popupWindow/PopupWindowProvider";
import moment from "moment";

type PropTypes = {
  classroom: ClassroomType;
  dispatchNotification: (value: string) => void;
}

const CaviarItem: React.FC<PropTypes> = ({classroom, dispatchNotification}) =>  {
  const dispatchPopupWindow = usePopupWindow();
  const [isOverdue, setIsOverDue] = useState(false);
  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (classroom.occupied.state === OccupiedState.RESERVED) {
      const untilString: string = classroom.occupied.until as unknown as string;
      const diffInMs = moment(untilString).diff(moment());

      if (diffInMs >= 0 && classroom.occupied.state === OccupiedState.RESERVED && !timeout) {
        timeout = setTimeout(() => setIsOverDue(true), diffInMs);
      } else if (diffInMs <= 0 && classroom.occupied.state === OccupiedState.RESERVED) {
        setIsOverDue(true);
      } else {
        setIsOverDue(false);
      }
    } else {
      setIsOverDue(false);
    }
    if (classroom.occupied.state !== OccupiedState.RESERVED && timeout) clearTimeout(timeout);
  }, [classroom.occupied.state]);

  const calcStyle = (classroom: ClassroomType) => {
    const resStyles: CSSProperties = {};
    if (classroom.isHidden) resStyles.opacity = .5;
    if (classroom.disabled.state === DisabledState.DISABLED) {
      resStyles.background = '#b1b1b1';
    } else {
      classroom.occupied.state === OccupiedState.FREE ?
        resStyles.background = '#4bfd63' : resStyles.background = '#fff';
      if (isOverdue) {
        resStyles.background = '#f91354';
        resStyles.color = '#fff';
      }
    }
    return resStyles
  };

  function handleClick(classroom: ClassroomType) {
    const {name, occupied, id, disabled} = classroom;
    dispatchPopupWindow({
      header: (
        <>
          <h1>{`Аудиторія ${classroom.name}`}</h1>
          {classroom.isWing && <Tag body="Флігель"/>}
          {classroom.isOperaStudio && <Tag body="Оперна студія"/>}
        </>
      ),
      body: (
        //@ts-ignore
        <ClassroomInfo
          dispatchNotification={dispatchNotification}
          classroom={classroom}
          dispatchPopupWindow={dispatchPopupWindow}
        />
      ),
      footer: <Footer
        classroomName={name}
        classroomId={id}
        disabled={disabled}
        occupied={occupied}
        dispatchNotification={dispatchNotification}
        dispatchPopupWindow={dispatchPopupWindow}
        isOverdue={isOverdue}
      />,
    });
  }

  return (
    <li
      onClick={() => handleClick(classroom)}
      style={calcStyle(classroom)}
    >
      {classroom.name}
    </li>
  );
}

export default CaviarItem;