import { renderAllProviders } from "../../../../../utils/testUtils";
import React from "react";
import Amplify, { Auth } from "aws-amplify";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TermsAndConditionsFieldSet from "..";
import mockFormData from "./mockFormData";
import mockUser from "./mockUser";
import amplifyConfig from "../../../../../configs/amplify";
import { AuthActionTypes } from "../../../../../contexts/auth";

Amplify.configure(amplifyConfig);

describe("Terms and Conditions Field Set", () => {
  it("renders", () => {
    renderAllProviders(<TermsAndConditionsFieldSet formData={mockFormData} />, {
      isProfileComplete: false,
      user: mockUser,
      currentAuthState: AuthActionTypes.SIGNIN,
    });
  });

  it("has inputs that can be changed with no form errors and submits a PUT request to the API", async () => {
    Auth.currentSession = jest.fn().mockImplementationOnce(() => ({
      getIdToken: () => ({
        getJwtToken: () => "test token",
      }),
    }));
    // @ts-ignore: TS expects fetch to not be missing properties. We're just using it to mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUser),
      })
    );

    const now = Date.now();
    Date.now = jest.fn().mockImplementation(() => now);

    renderAllProviders(<TermsAndConditionsFieldSet formData={mockFormData} />, {
      isProfileComplete: false,
      user: mockUser,
      currentAuthState: AuthActionTypes.SIGNIN,
    });

    const checkBoxes = screen.getAllByRole("checkbox");
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");

    fireEvent.click(checkBoxes[0]);
    expect(checkBoxes[0]).toBeChecked();

    fireEvent.click(checkBoxes[1]);
    expect(checkBoxes[1]).toBeChecked();

    userEvent.type(firstNameInput, "Rico");
    expect(firstNameInput).toHaveValue("Rico");

    userEvent.type(lastNameInput, "Suave");
    expect(lastNameInput).toHaveValue("Suave");

    fireEvent.submit(screen.getByTestId("terms-form"));

    await waitFor(() => expect(Auth.currentSession).toHaveBeenCalledTimes(1));

    expect(fetch).toHaveBeenCalledTimes(1);

    const data = {
      ...mockUser,
      ...mockFormData,
      birthdate: mockFormData?.dateOfBirth,
      sex: mockFormData?.gender,
      address: {
        streetAddress: mockFormData?.address,
        city: mockFormData?.city,
        state: mockFormData?.state,
        zipCode: mockFormData?.zipcode,
      },
      documentType: "passport", // TODO Replace this with actual form selection when upload ID is complete
      allergies: mockFormData?.allergies,
      termsAcceptedAt: now,
    };

    expect(fetch).toHaveBeenCalledWith("undefinedmyself/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer test token`,
      },
      body: JSON.stringify(data),
    });
  });
});
