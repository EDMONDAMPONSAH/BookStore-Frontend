// ✅ Mocks must be declared before imports that depend on them
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../services/api");
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { BrowserRouter } from "react-router-dom";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

// ✅ Helper to wrap the tested component with routing context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockReset();
  });

  it("renders login form", () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows error message on failed login", async () => {
    api.post.mockRejectedValueOnce(new Error("Invalid credentials"));

    renderWithRouter(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com", name: "username" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass", name: "password" },
    });

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("navigates and saves token on successful login", async () => {
    const fakeToken = "faketoken";
    api.post.mockResolvedValueOnce({ data: { token: fakeToken } });

    jwtDecode.mockReturnValue({
      role: "User",
      name: "Test User",
    });

    renderWithRouter(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com", name: "username" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "correctpass", name: "password" },
    });

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        username: "user@example.com",
        password: "correctpass",
      });
      expect(localStorage.getItem("token")).toBe(fakeToken);
      expect(localStorage.getItem("userRole")).toBe("User");
      expect(localStorage.getItem("username")).toBe("Test User");
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });
});
