import produce from 'immer';
import { handleActions } from 'redux-actions';
import { deviceListSuccess } from './actions';
export const initialState = {
  deviceList: null,
};

/* eslint-disable default-case, no-param-reassign */
const deviceListReducer = handleActions(
  {
    [deviceListSuccess]: produce((draft, action) => {
      draft.deviceList = action.payload;
      return draft;
    }),
  },
  initialState,
);

export default deviceListReducer;
