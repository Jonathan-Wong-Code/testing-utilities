import React from "react";
import { fireEvent } from "@testing-library/react";
import {
  renderReduxAndTheme,
  renderAllProviders,
} from "../../../tests/testUtils";
import FinancialBar from "..";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

beforeEach(() => jest.clearAllMocks());

describe("<FinancialBar>", () => {
  it("renders", () => {
    renderReduxAndTheme(<FinancialBar />);
  });

  it("navigates to the next page when the button is clicked", () => {
    const { getByTestId } = renderAllProviders(<FinancialBar />);
    fireEvent.click(getByTestId("financial-bar-continue"));
    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
    expect(mockHistoryPush).toHaveBeenCalledWith("/cart-summary");
  });
});
