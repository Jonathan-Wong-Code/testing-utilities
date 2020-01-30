import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import { UserProvider } from "./../context/user-context";
import { AuthProvider } from "./../context/auth-context";
import { TaskProvider } from "./../context/task-context";

import React from "react";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { createMemoryHistory } from "history";
import createSagaMiddleware from "redux-saga";
import { render } from "react-testing-library";
import { routerMiddleware } from "connected-react-router";
import reducers from "../common/reducers";
import { ModalProvider } from "../common/components/modal/modalContext";

export const renderRedux = (ui, initialState = {}) => {
  const history = createMemoryHistory();
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [routerMiddleware(history), sagaMiddleware];
  const enhancers = [];

  const enhancer = compose(applyMiddleware(...middlewares), ...enhancers);

  const store = createStore(reducers(history), initialState, enhancer);

  return render(<Provider store={store}>{ui}</Provider>);
};

export const renderModalContextRedux = (ui, initialState = {}) => {
  const history = createMemoryHistory();
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [routerMiddleware(history), sagaMiddleware];
  const enhancers = [];

  const enhancer = compose(applyMiddleware(...middlewares), ...enhancers);

  const store = createStore(reducers(history), initialState, enhancer);

  return render(
    <Provider store={store}>
      <ModalProvider>{ui}</ModalProvider>
    </Provider>
  );
};
export const renderRouter = (
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    ...options
  }
) => {
  return {
    ...render(<Router history={history}>{ui}</Router>, options),
    history
  };
};

export function renderContext(
  ui,
  { authValue, userValue, taskValue, ...options }
) {
  return {
    ...render(
      <AuthProvider value={authValue}>
        <UserProvider value={userValue}>
          <TaskProvider value={taskValue}>{ui}</TaskProvider>
        </UserProvider>
      </AuthProvider>,
      options
    )
  };
}

export function renderWithContextRouter(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    authValue,
    userValue,
    taskValue,
    ...options
  }
) {
  return {
    ...render(
      <AuthProvider value={authValue}>
        <UserProvider value={userValue}>
          <TaskProvider value={taskValue}>
            <Router history={history}>{ui}</Router>
          </TaskProvider>
        </UserProvider>
      </AuthProvider>,
      options
    ),
    history
  };
}
