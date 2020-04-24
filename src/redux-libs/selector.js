import { createSelector } from 'reselect';
import { initialState } from './reducer';

export const selectDeviceConfig = state =>
  (state && state.deviceList) || initialState;

export const makeSelectDeviceList = () =>
  createSelector(selectDeviceConfig, globalState => globalState);
