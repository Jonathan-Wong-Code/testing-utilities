import { call, put, takeLatest } from 'redux-saga/effects';
import {
  deviceListSuccess,
  deviceListError,
  deviceListRequest,
} from './actions';

import { get } from '../../utils/api';

const fetchDevice = () => get(`devices/`);

export function* getDeviceList(action) {
  try {
    const device = yield call(fetchDevice, action.payload);
    yield put(deviceListSuccess(device));
  } catch (e) {
    yield put(deviceListError(e));
  }
}

// sagas to be loaded
export default function* DeviceSaga() {
  yield takeLatest(deviceListRequest().type, getDeviceList);
}
