import { cleanup } from "@testing-library/react";
import React from "react";
import data from "../../tests/unit/mockData/Manuals";
import Manuals from "../Manuals";
import withAnalytics from "../../analytics/withAnalytics";
import withManuals from "../../hoc/withManuals";
import withAuth from "../../auth/withAuth";
import { renderAuthRouterApolloIntl } from "../../tests/unit/testUtils/testUtils";
import {
  mockAnalytics,
  mockManualData
} from "../../tests/unit/testUtils/mockHoc";

jest.mock("../../analytics/withAnalytics", () => {
  return Component => {
    return props => {
      const WrapComponent = props => {
        return <Component {...props} analytics={mockAnalytics} />;
      };
      return WrapComponent(props);
    };
  };
});

// Mocking the withManuls HOC
jest.mock("../../hoc/withManuals", () => {
  return Component => {
    return props => {
      const WrapComponent = props => {
        return <Component {...mockManualData} {...props} />;
      };

      return WrapComponent(props);
    };
  };
});

afterEach(cleanup);

describe("<Manuals>", () => {
  it("renders", () => {
    // Returns a component wrapped with HoC
    const WrappedManual = withAuth(withAnalytics(withManuals(Manuals)));

    // Render HoC'ed component with mock functions
    const { getByTestId } = renderAuthRouterApolloIntl(
      <WrappedManual {...data} />
    );
    expect(getByTestId("manuals-form-form")).toBeDefined();
  });

  it("renders without the adjust options button", () => {
    const WrappedManual = withAuth(withAnalytics(withManuals(Manuals)));

    const { queryByTestId } = renderAuthRouterApolloIntl(
      <WrappedManual {...data} />
    );
    expect(queryByTestId("manuals-adjust-button")).toBeNull();
  });

  it("renders without the mobile header component in desktop", () => {
    window.innerWidth = 1300;
    const WrappedManual = withAuth(withAnalytics(withManuals(Manuals)));

    const { queryByTestId } = renderAuthRouterApolloIntl(
      <WrappedManual {...data} />
    );
    expect(queryByTestId("form-header-container-results")).toBeNull();
  });
});
