import { render, screen } from "@testing-library/react";
import UserTreksPage from "@/app/treks/page";

// Mock fetch globally
global.fetch = jest.fn();

describe("User Treks Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading state initially", () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<UserTreksPage />);
    expect(screen.getByText("Loading treks...")).toBeInTheDocument();
  });

  it("should show no treks message when list is empty", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<UserTreksPage />);
    expect(await screen.findByText("No treks available right now.")).toBeInTheDocument();
  });

  it("should show trek cards when treks are returned", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            _id: "1",
            name: "Everest Base Camp",
            location: "Solukhumbu",
            duration: 14,
            difficulty: "Hard",
            price: 1500,
            imageUrl: "https://example.com/ebc.jpg",
            description: "A great trek",
          },
        ],
      }),
    });

    render(<UserTreksPage />);
    expect(await screen.findByText("Everest Base Camp")).toBeInTheDocument();
    expect(screen.getByText("Solukhumbu")).toBeInTheDocument();
  });

  it("should show error message when fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Server error" }),
    });

    render(<UserTreksPage />);
    expect(await screen.findByText("Error: Server error")).toBeInTheDocument();
  });
});