import React from "react";
import "@testing-library/jest-dom/extend-expect";
import {
  renderContext,
  renderWithContextRouter
} from "./../../../testUtils/testUtils";
import TaskForm from "..";
import axios from "axios";
import { fireEvent, wait, cleanup } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

jest.mock("axios");

const history = createMemoryHistory();

const mockTask = {
  title: "Test task",
  description: "Test descript",
  completed: false,
  _id: "test1234"
};

const response = {
  data: {
    data: {
      task: mockTask
    }
  }
};
afterEach(cleanup);

describe("<TaskForm>", () => {
  beforeEach(() => {
    history.push = jest.fn();
  });

  test("it should successfully create a new task", async () => {
    axios.mockImplementation(() => Promise.resolve(response));
    const {
      getByLabelText,
      getByTestId,
      queryByTestId,
      getByText,
      queryByText
    } = renderContext(
      <Router history={history}>
        <TaskForm history={history} type="create" />,
      </Router>,
      {
        route: "/create"
      }
    );

    expect(getByText("Create")).toBeDefined();
    expect(queryByText("Edit")).toBeNull();
    const title = getByLabelText(/title:/i);
    const description = getByLabelText(/description:/i);
    const completed = getByTestId("completed-checkbox");

    fireEvent.change(title, { target: { value: mockTask.title } });
    fireEvent.change(description, { target: { value: mockTask.description } });
    fireEvent.click(completed);

    expect(title).toHaveValue(mockTask.title);
    expect(description).toHaveValue(mockTask.description);
    expect(completed).toHaveAttribute("value", "true");

    fireEvent.submit(getByTestId("task-form"));
    await wait(() => {
      expect(queryByTestId("task-form-error")).toBeNull();
      expect(history.push).toHaveBeenCalledTimes(1);
    });
  });

  test("it should throw an error if create task fails", async () => {
    const error = new Error();
    error.response = { data: { message: "failure" } };
    axios.mockImplementationOnce(() => Promise.reject(error));

    const { getByLabelText, getByTestId } = renderContext(
      <Router history={history}>
        <TaskForm history={history} type="create" />
      </Router>,
      {}
    );

    const title = getByLabelText(/title:/i);
    const description = getByLabelText(/description:/i);
    const completed = getByTestId("completed-checkbox");

    fireEvent.change(title, { target: { value: mockTask.title } });
    fireEvent.change(description, {
      target: { value: mockTask.description }
    });
    fireEvent.click(completed);
    fireEvent.submit(getByTestId("task-form"));

    await wait(() => {
      expect(getByTestId("task-form-error")).toBeTruthy();
      expect(getByTestId("task-form-error").textContent).toBe("failure");
    });

    expect(history.push).not.toHaveBeenCalled();
  });

  test("should successfully update a task", async () => {
    axios.mockImplementation(() => Promise.resolve(response));
    const {
      getByLabelText,
      getByTestId,
      queryByTestId,
      getByText,
      queryByText
    } = renderContext(
      <Router history={history}>
        <TaskForm history={history} type="edit" editedTask={mockTask} />,
      </Router>,
      {
        route: "/edit"
      }
    );
    expect(queryByText("Create")).toBeNull();
    expect(getByText("Edit")).toBeDefined();
    const title = getByLabelText(/title:/i);
    const description = getByLabelText(/description:/i);
    const completed = getByTestId("completed-checkbox");

    expect(title).toHaveValue("Test task");
    expect(description).toHaveValue("Test descript");
    expect(completed).toHaveAttribute("value", "false");

    fireEvent.change(title, { target: { value: "new test title" } });
    fireEvent.change(description, {
      target: { value: "new test description" }
    });

    fireEvent.click(completed);

    expect(title).toHaveValue("new test title");
    expect(description).toHaveValue("new test description");
    expect(completed).toHaveAttribute("value", "true");

    fireEvent.submit(getByTestId("task-form"));
    await wait(() => {
      expect(queryByTestId("task-form-error")).toBeNull();
      expect(history.push).toHaveBeenCalledTimes(1);
    });
  });

  test("should throw an error if edit task fails", async () => {
    const error = new Error();
    error.response = {
      data: {
        message: "edit task error"
      }
    };
    axios.mockImplementation(() => Promise.reject(error));
    const { getByLabelText, getByTestId } = renderWithContextRouter(
      <TaskForm task={mockTask} type="edit" />,
      { route: "/edit" }
    );

    const title = getByLabelText("Title:");
    const description = getByLabelText("Description:");
    const completed = getByTestId("completed-checkbox");

    fireEvent.change(title, { target: { value: "test title" } });
    fireEvent.change(description, { target: { value: "test description" } });
    fireEvent.click(completed);

    fireEvent.submit(getByTestId("task-form"));

    await wait(() => {
      expect(getByTestId("task-form-error")).toBeTruthy();
      expect(getByTestId("task-form-error").textContent).toBe(
        "edit task error"
      );
      expect(history.push).not.toHaveBeenCalled();
    });
  });

  test("should render an error if there is an error fetching task", () => {
    const { getByText } = renderWithContextRouter(
      <TaskForm task={mockTask} type="edit" fetchError="fetchError" />,
      { route: "/edit" }
    );

    expect(getByText("fetchError")).toBeDefined();
  });
});
