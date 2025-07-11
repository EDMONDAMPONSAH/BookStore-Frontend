import React from "react";
import { render, screen } from "@testing-library/react";
import WelcomeMessage from "./WelcomeMessage";

test("renders welcome message", () => {
  render(<WelcomeMessage />);
  const textElement = screen.getByText(/Welcome to Bookstore/i);
  expect(textElement).toBeInTheDocument();
});
