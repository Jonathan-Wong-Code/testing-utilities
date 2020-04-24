import { selectDeviceConfig, makeSelectDeviceList } from "../selector";
import { initialState } from "../reducer";

describe("selectDeviceConfig", () => {
  it("should return the initial state", () => {
    const result = selectDeviceConfig();
    expect(result).toEqual(initialState);
  });

  it("should return the state object", () => {
    const result = selectDeviceConfig({ deviceList: ["test"] });
    expect(result).toEqual(["test"]);
  });
});

// resultFunc tests the resulting function as a result of the composed selectors.
// createSelector(fn,fn, res => result)
describe("makeSelectDeviceList", () => {
  const result = makeSelectDeviceList();
  const actual = result.resultFunc(["test"]);
  expect(actual).toEqual(["test"]);
});
