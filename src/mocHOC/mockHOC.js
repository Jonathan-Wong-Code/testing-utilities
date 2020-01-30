import data from "../mockData/Manuals";

// Mock HoC Data to use for testing
export const mockAnalytics = {
  incrementUserProperty: jest.fn(),
  trackEvent: jest.fn(),
  trackFormSubmission: jest.fn()
};

export const mockManualData = {
  brand: data.brand,
  productFamily: data.productFamily,
  manualType: data.manualtype,
  language: data.language,
  onHandleSearch: jest.fn(),
  onChangeBrand: jest.fn()
};

export const mockAuth = {
  authState: "signedIn",
  signOut: jest.fn(),
  signIn: jest.fn()
};

// Example for mocking HoC mock inside component
// jest.mock('../../auth/withAuth', () => {
//   return Component => {
//     return props => {
//       const WrapComponent = props => {
//         return <Component {...props} {...mockAuth} />;
//       };
//       return WrapComponent(props);
//     };
//   };
// });
