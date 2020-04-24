import {
  deviceListRequest,
  deviceListSuccess,
  deviceListError,
} from "../actions";

describe("DeviceList Actions", () => {
  // Call the createActions with a payload. Assert resulting actions object
  it("should send the proper deviceListRequest action object", () => {
    const testPayload = { field: "test payload" };
    const result = deviceListRequest(testPayload);
    expect(result).toEqual({
      type: "DEVICE_LIST_REQUEST",
      payload: {
        field: "test payload",
      },
    });
  });

  it("should send the proper deviceListSuccess action object", () => {
    const testPayload = { field: "test payload" };
    const result = deviceListSuccess(testPayload);
    expect(result).toEqual({
      type: "DEVICE_LIST_SUCCESS",
      payload: {
        field: "test payload",
      },
    });
  });

  it("should send the proper deviceListError action object", () => {
    const testPayload = { field: "test payload" };
    const result = deviceListError(testPayload);
    expect(result).toEqual({
      type: "DEVICE_LIST_ERROR",
      payload: {
        field: "test payload",
      },
    });
  });
});
