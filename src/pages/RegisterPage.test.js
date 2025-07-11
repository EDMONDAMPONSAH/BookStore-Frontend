// ✅ Mocks must be declared first
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../services/api");

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "./RegisterPage";
import { BrowserRouter } from "react-router-dom";
import api from "../services/api";

// Helper to wrap with router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("RegisterPage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockReset();
  });

  it("renders register form", () => {
    renderWithRouter(<RegisterPage />);
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("navigates to login on successful registration", async () => {
    api.post.mockResolvedValueOnce({ status: 200 });

    renderWithRouter(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "newuser@example.com", name: "username" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123", name: "password" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        username: "newuser@example.com",
        password: "password123",
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("displays error message on registration failure", async () => {
    api.post.mockRejectedValueOnce(new Error("API Error"));

    renderWithRouter(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fail@example.com", name: "username" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "badpass", name: "password" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});
