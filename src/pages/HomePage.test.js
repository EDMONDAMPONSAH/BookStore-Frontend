const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../services/api");

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import api from "../services/api";
import { BrowserRouter } from "react-router-dom";

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays books", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 1,
            name: "Test Book",
            price: 100,
            firstImageUrl: "http://test.com/img.jpg",
          },
        ],
        total: 1,
      },
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
      expect(screen.getByText(/GHS 100.00/i)).toBeInTheDocument();
    });
  });

  it("searches books when typing", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 2,
            name: "Searched Book",
            price: 50,
            firstImageUrl: "",
          },
        ],
        total: 1,
      },
    });

    renderWithRouter(<HomePage />);
    const searchInput = screen.getByPlaceholderText(
      /search by name or category/i
    );

    fireEvent.change(searchInput, { target: { value: "Searched" } });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/home",
        expect.objectContaining({
          params: expect.objectContaining({
            search: "Searched",
            page: 1,
            pageSize: 2,
          }),
        })
      );
      expect(screen.getByText(/Searched Book/i)).toBeInTheDocument();
    });
  });

  it("handles pagination", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [{ id: 3, name: "Book on Page 2", price: 80 }],
        total: 4, // 2 pages
      },
    });

    renderWithRouter(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    });

    const nextBtn = screen.getByText(/Next/i);
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/home",
        expect.objectContaining({
          params: expect.objectContaining({ page: 2 }),
        })
      );
    });
  });

  it("navigates to book detail when clicked", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 5,
            name: "Clickable Book",
            price: 30,
            firstImageUrl: "",
          },
        ],
        total: 1,
      },
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Clickable Book"));
    });

    expect(mockedNavigate).toHaveBeenCalledWith("/books/5");
  });
});
