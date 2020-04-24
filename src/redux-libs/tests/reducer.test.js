import deviceListReducer from "../reducer";
import { deviceListSuccess } from "../actions";

const mockData = ["item one", "item two", "item three"];

// Even for handleactions simply pass the reducer a state/action
describe("The deviceListReducer", () => {
  it("should return the expected results on success", () => {
    const result = deviceListReducer(
      { deviceList: null },
      deviceListSuccess(mockData)
    );
    expect(result).toEqual({ deviceList: mockData });
  });
});
