import {ClassroomsFilterTypes, ClassroomType, DisabledState, OccupiedState, QueuePolicyTypes} from "../models/models";

export const filterClassrooms = (
  classrooms: Array<ClassroomType>,
  type: ClassroomsFilterTypes = ClassroomsFilterTypes.ALL,
  isOperaStudioOnly: boolean = false,
  noWing: boolean = false,
  isAvailableForStudentOnly: boolean = false
): Array<ClassroomType> => {

  const filterTypeOnly = (classroom: ClassroomType) => {
    switch (type) {
      case ClassroomsFilterTypes.ALL:
        return true;
      case ClassroomsFilterTypes.FREE:
        return classroom.occupied.state === OccupiedState.FREE;
      case ClassroomsFilterTypes.SPECIAL:
        return !!classroom.special;
    }
  };

  const wingOnlyFilter = (classroom: ClassroomType) => {
    if (noWing) return !classroom.isWing;
    return true;
  };

  const studioOnlyFilter = (classroom: ClassroomType) => {
    if (isOperaStudioOnly) return classroom.isOperaStudio;
    return true;
  };
  const availableForStudentFilter = (classroom: ClassroomType) => {
    if (isAvailableForStudentOnly) return classroom.occupied.state === OccupiedState.FREE
      && classroom.disabled.state === DisabledState.NOT_DISABLED
      && !classroom.isHidden
      && (classroom.queueInfo.queuePolicy.policy === QueuePolicyTypes.ALL_DEPARTMENTS
        || (classroom.queueInfo.queuePolicy.policy === QueuePolicyTypes.SELECTED_DEPARTMENTS
          && classroom.queueInfo.queuePolicy.queueAllowedDepartments.length > 0));
    return true;
  };

  return classrooms?.filter(classroom => filterTypeOnly(classroom))
    .filter(classroom => wingOnlyFilter(classroom))
    .filter(classroom => studioOnlyFilter(classroom))
    .filter(classroom => availableForStudentFilter(classroom));
};