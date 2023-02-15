import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackSearchInput } from "./FeedbackSearchInput";
import { INPUT_MAX_LENGTH } from "utils/constants";

describe("FeedbackSearchInput", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <FeedbackSearchInput dispatch={jest.fn()} />
    );
    expect(baseElement).toBeTruthy();
  });
  it("limits input length", async () => {
    // ARRANGE
    render(<FeedbackSearchInput dispatch={jest.fn()} />);

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
