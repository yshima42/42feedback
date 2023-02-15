import React from "react";
import { render, screen } from "@testing-library/react";
import { FeedbackSearchBox } from "./FeedbackSearchBox";

describe("FeedbackSearchBox", () => {
  it("should render successfully", () => {
    const dispatch = jest.fn();
    const { baseElement } = render(<FeedbackSearchBox dispatch={dispatch} />);
    expect(baseElement).toBeTruthy();
    expect(screen.getByRole("textbox")).toBeTruthy();
  });
});
