import { createActions } from 'redux-actions';

export const {
  deviceListRequest,
  deviceListSuccess,
  deviceListError,
} = createActions(
  'DEVICE_LIST_REQUEST',
  'DEVICE_LIST_SUCCESS',
  'DEVICE_LIST_ERROR',
);
