import React from 'react';
import moment from "moment";
import {isTimeout} from "./helpers/helpers";

test('is overdue', () => {
  const outerTime = moment().subtract(2, 'hours').toISOString();
  expect(isTimeout(outerTime)).toBeFalsy();
});
