import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ellipseTheme } from "web_component_library";
import { renderAllProviders } from "../../../tests/testUtils";
import AdjustTabForm from "../adjustTabForm";
import mockData from "./adjustTabForm.mock";
// mockData configured for minimum payment of 200 and max of 500, tabcharge of 720

const closeModal = jest.fn();
const setTabPaymentResetValue = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("<AdjustTabForm />", () => {
  it("renders", () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="0"
      />
    );
  });

  it("should have an accessible H2", () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="0"
      />
    );
    expect(
      screen.getByText(/Adjust your monthly tab with an upfront payment/i)
    ).toBeDefined();
  });

  it("should have an input the user can type into", async () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="0"
      />
    );
    const input = screen.getByTestId("adjust-tab-input");
    await act(async () => await userEvent.type(input, "222"));

    expect(input).toHaveValue("$222");
  });

  it("should trigger the appropriate error states for the input when below the minimum amount and above the maximum amount", async () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="0"
      />
    );
    const input = screen.getByTestId("adjust-tab-input");
    // Below 200.
    await act(async () => await userEvent.type(input, "22"));
    let errorMessage = screen.getByRole("alert");

    expect(input).toHaveStyleRule(
      "border",
      `1px solid ${ellipseTheme.colors.errorRed}`
    );
    expect(input).toHaveStyleRule("outline", ellipseTheme.colors.errorRed);
    expect(errorMessage).toBeDefined();

    // Above 200 but below 500
    await act(async () => await userEvent.type(input, "2"));
    errorMessage = screen.queryByRole("alert");

    expect(errorMessage).toBeNull();
    expect(input).toHaveStyleRule("border", `1px solid black`);

    // Above 500 at 2222
    await act(async () => await userEvent.type(input, "2"));
    errorMessage = screen.getByRole("alert");

    expect(input).toHaveStyleRule(
      "border",
      `1px solid ${ellipseTheme.colors.errorRed}`
    );
    expect(input).toHaveStyleRule("outline", ellipseTheme.colors.errorRed);

    expect(errorMessage).toBeDefined();
  });

  it("Should not allow the user to type in non whole number integers", async () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="0"
      />
    );

    const input = screen.getByTestId("adjust-tab-input");
    await act(async () => await userEvent.type(input, "fff"));
    expect(input).toHaveValue("");

    await act(async () => await userEvent.type(input, "20.00f"));
    expect(input).toHaveValue("$20");
  });

  it("Should not allow the user to type in numbers starting with zero", async () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="0"
      />
    );

    const input = screen.getByTestId("adjust-tab-input");
    await act(async () => await userEvent.type(input, "02"));
    expect(input).toHaveValue("$2");
  });

  it("has an apply button that closes the modal and dispatches the new plan to the cart when a valid tabpayment is input", async () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="0"
      />
    );
    const input = screen.getByTestId("adjust-tab-input");
    const form = screen.getByTestId("adjust-tab-form");
    await act(async () => await userEvent.type(input, "222"));
    await act(async () => fireEvent.submit(form));

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("has an apply button that should not close the modal if invalid tabpayments are entered", async () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="0"
      />
    );
    const input = screen.getByTestId("adjust-tab-input");
    const form = screen.getByTestId("adjust-tab-form");
    // Below 200 our mock minimum
    await act(async () => await userEvent.type(input, "22"));
    await act(async () => fireEvent.submit(form));
    expect(closeModal).not.toHaveBeenCalled();

    // Above 500 our mock maximum
    await act(async () => await userEvent.type(input, "22"));
    await act(async () => fireEvent.submit(form));
    expect(closeModal).not.toHaveBeenCalled();
  });

  it("Has a reset button that should change the input value to the last applied tab value", async () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="$300"
      />
    );

    const input = screen.getByTestId("adjust-tab-input");
    const resetButton = screen.getByRole("button", { name: "Reset" });
    await act(async () => userEvent.click(resetButton));
    expect(input).toHaveValue("$300");
  });

  it("Updates the monthly total when the user types in", async () => {
    renderAllProviders(
      <AdjustTabForm
        {...mockData}
        closeModal={closeModal}
        setTabPaymentResetValue={setTabPaymentResetValue}
        tabPaymentResetValue="$300"
      />
    );

    const monthlyTotal = screen.getByTestId("adjust-tab-monthly-total");
    const input = screen.getByTestId("adjust-tab-input");
    // render intitial amount.
    expect(monthlyTotal).toHaveTextContent("$30");
    await act(async () => await userEvent.type(input, "300"));
    // (720 - 300)/24
    expect(monthlyTotal).toHaveTextContent("$17.50/mo");
  });
});
