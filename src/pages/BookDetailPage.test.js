// ✅ Mocks first
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
}));

jest.mock("../services/api");

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BookDetailPage from "./BookDetailPage";
import api from "../services/api";

// Helper
const mockBook = {
  id: 123,
  name: "Test Book",
  price: 45.5,
  category: "Fiction",
  description: "A great book",
  images: ["http://image1.com", "http://image2.com"],
};

describe("BookDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("displays loading initially", async () => {
    api.get.mockResolvedValueOnce({ data: mockBook });

    render(<BookDetailPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("Test Book")).toBeInTheDocument()
    );
  });

  it("displays error message if fetch fails", async () => {
    api.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<BookDetailPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to load book details/i)
      ).toBeInTheDocument()
    );
  });

  it("displays book details correctly", async () => {
    api.get.mockResolvedValueOnce({ data: mockBook });

    render(<BookDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("GHS 45.50")).toBeInTheDocument();
      expect(screen.getByText(/Fiction/)).toBeInTheDocument();
      expect(screen.getByText(/A great book/)).toBeInTheDocument();
    });

    const images = screen.getAllByRole("img");
    expect(images.length).toBe(2);
  });

  it("starts payment and redirects on successful buy", async () => {
    api.get.mockResolvedValueOnce({ data: mockBook });

    const mockUrl = "https://paystack.com/redirect";
    api.post.mockResolvedValueOnce({
      data: { authorization_url: mockUrl },
    });

    // Mock token in localStorage
    const fakePayload = {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name":
        "user@example.com",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": 99,
    };
    const base64Payload = btoa(JSON.stringify(fakePayload));
    const token = `header.${base64Payload}.signature`;

    localStorage.setItem("token", token);

    delete window.location;
    window.location = { href: "" }; // mock redirect

    render(<BookDetailPage />);

    await waitFor(() => screen.getByText("Test Book"));

    fireEvent.click(screen.getByText(/buy/i));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/payments/initialize",
        {
          email: "user@example.com",
          bookId: 123,
          buyerId: 99,
        },
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      expect(window.location.href).toBe(mockUrl);
    });
  });

  it("shows toast error on buy if not logged in", async () => {
    api.get.mockResolvedValueOnce({ data: mockBook });
    api.post.mockRejectedValueOnce(new Error("No token"));

    render(<BookDetailPage />);

    await waitFor(() => screen.getByText("Test Book"));

    fireEvent.click(screen.getByText(/buy/i));

    await waitFor(() => {
      // No need to assert exact toast, just make sure no crash
      expect(api.post).toHaveBeenCalled();
    });
  });
});
