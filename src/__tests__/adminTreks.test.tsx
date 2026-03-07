import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminTreksPage from "@/app/admin/treks/page";

// Mock AdminLayout
jest.mock("@/components/layout/AdminLayout", () => {
  return function MockAdminLayout({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

global.fetch = jest.fn();

describe("Admin Treks Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => "mock-token");
  });

  it("should show loading state initially", () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<AdminTreksPage />);
    expect(screen.getByText("Loading treks...")).toBeInTheDocument();
  });

  it("should show no treks message when list is empty", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<AdminTreksPage />);
    expect(await screen.findByText("No treks found.")).toBeInTheDocument();
  });

  it("should show treks in table when loaded", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            _id: "1",
            name: "Everest Base Camp",
            location: "Solukhumbu",
            difficulty: "Hard",
            price: 1500,
          },
        ],
      }),
    });

    render(<AdminTreksPage />);
    expect(await screen.findByText("Everest Base Camp")).toBeInTheDocument();
    expect(screen.getByText("Solukhumbu")).toBeInTheDocument();
  });

  it("should show error message when fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Unauthorized" }),
    });

    render(<AdminTreksPage />);
    expect(await screen.findByText("Error: Unauthorized")).toBeInTheDocument();
  });

  it("should show New Trek button", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<AdminTreksPage />);
    expect(await screen.findByText("+ New Trek")).toBeInTheDocument();
  });
});