export const getMinutesWithZero = (number: string | number) => {
  const str = number.toString();
  const strLength = str.length;
  if (strLength === 1) return `0${number}`;
  return number;
};