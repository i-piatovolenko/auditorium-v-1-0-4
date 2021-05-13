import {ACCESS_RIGHTS, User, UserTypes} from "../../../models/models";

export const isAvailableAccess = (accessRights: ACCESS_RIGHTS, user: User) => {
  return accessRights === ACCESS_RIGHTS.USER
    ? user.type === UserTypes.TEACHER
    || user.type === UserTypes.ILLUSTRATOR
    || user.type === UserTypes.CONCERTMASTER : true;
};