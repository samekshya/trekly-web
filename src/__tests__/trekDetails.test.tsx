import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TrekDetailsPage from "@/app/treks/[id]/page";

// Mock useParams
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "test-trek-id" }),
}));

global.fetch = jest.fn();

describe("Trek Details Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading state initially", () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null }),
    });

    render(<TrekDetailsPage />);
    expect(screen.getByText("Loading trek...")).toBeInTheDocument();
  });

  it("should show trek details when loaded", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          _id: "test-trek-id",
          name: "Everest Base Camp",
          description: "Amazing trek",
          location: "Solukhumbu",
          duration: 14,
          difficulty: "Hard",
          price: 1500,
          imageUrl: "https://example.com/ebc.jpg",
        },
      }),
    });

    render(<TrekDetailsPage />);
    expect(await screen.findByText("Everest Base Camp")).toBeInTheDocument();
    expect(screen.getByText("Amazing trek")).toBeInTheDocument();
  });

  it("should show error when trek not found", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Trek not found" }),
    });

    render(<TrekDetailsPage />);
    expect(await screen.findByText(/Trek not found/i)).toBeInTheDocument();
  });
});