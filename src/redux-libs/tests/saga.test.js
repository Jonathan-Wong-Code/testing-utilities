import { runSaga } from "redux-saga";
import { takeLatest, all } from "redux-saga/effects";

import { deviceListRequest } from "../actions";
import DeviceSaga, { getDeviceList } from "../saga";
import { get } from "../../../utils/api";
import mockData from "./devices.mock";

jest.mock("../../../utils/api");

beforeEach(() => jest.clearAllMocks());

describe("The getDeviceList Saga", () => {
  it("Should make the api call and dispatch the correct action to the reducer on success", async () => {
    const dispatchedActions = [];

    get.mockImplementationOnce(() => Promise.resolve(mockData));

    const fakeStore = {
      getState: () => ({ deviceList: [] }),
      dispatch: (action) => dispatchedActions.push(action),
    };

    await runSaga(fakeStore, getDeviceList, "");
    expect(get).toHaveBeenCalledTimes(1);
    expect(dispatchedActions).toEqual([
      {
        type: "DEVICE_LIST_SUCCESS",
        payload: mockData,
      },
    ]);
  });

  // Mock API call. Create fake store. Run the saga. Make Assertions
  it("Should make the api call and dispatch the correct action to the reducer when the API call fails", async () => {
    const dispatchedActions = [];
    const error = "Oops something went wrong!";
    get.mockImplementationOnce(() => Promise.reject(error));

    const fakeStore = {
      getState: () => ({ deviceList: [] }),
      dispatch: (action) => dispatchedActions.push(action),
    };

    await runSaga(fakeStore, getDeviceList, "");
    expect(get).toHaveBeenCalledTimes(1);
    expect(dispatchedActions).toEqual([
      {
        type: "DEVICE_LIST_ERROR",
        payload: error,
      },
    ]);
  });

  // Calls the saga and iterates through each step of the generator. Assert what the current step is.
  it("should watch for the action", () => {
    const watchAll = DeviceSaga();
    const effect = watchAll.next().value;
    expect(effect).toEqual(takeLatest("DEVICE_LIST_REQUEST", getDeviceList));
  });
});
