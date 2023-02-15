import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackSearchBox } from "./FeedbackSearchBox";
import { INPUT_MAX_LENGTH } from "utils/constants";

describe("FeedbackSearchBox", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<FeedbackSearchBox dispatch={jest.fn()} />);
    expect(baseElement).toBeTruthy();
  });
  it("limits input length", async () => {
    // ARRANGE
    render(<FeedbackSearchBox dispatch={jest.fn()} />);

    const input: HTMLInputElement = screen.getByRole("textbox");
    const longText = "x".repeat(INPUT_MAX_LENGTH + 1);
    const expectedText = longText.slice(0, INPUT_MAX_LENGTH);

    // ACT
    const user = userEvent.setup();
    await user.type(input, longText);

    // ASSERT
    expect(input.value).toBe(expectedText);
  });
});
