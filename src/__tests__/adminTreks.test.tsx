import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminTreksPage from "../app/admin/treks/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/admin/treks",
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const mockTreks = [
  { _id: "1", name: "Everest Base Camp Trek", location: "Solukhumbu, Nepal", price: 150000, difficulty: "Hard", duration: 14 },
  { _id: "2", name: "Annapurna Circuit", location: "Pokhara, Nepal", price: 80000, difficulty: "Moderate", duration: 21 },
];

describe("Admin Treks Page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    Storage.prototype.getItem = jest.fn((key: string) => {
      if (key === "user") return JSON.stringify({ name: "Admin" });
      if (key === "token") return "mock-token";
      return null;
    });
  });

  it("should show loading spinner initially", () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as any;
    render(<AdminTreksPage />);
    expect(screen.getByText("Loading treks...")).toBeInTheDocument();
  });

  it("should show treks table after loading", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockTreks }) })
    ) as any;

    render(<AdminTreksPage />);
    expect(await screen.findByText("Everest Base Camp Trek")).toBeInTheDocument();
    expect(screen.getByText("Annapurna Circuit")).toBeInTheDocument();
  });

  it("should show New Trek button", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockTreks }) })
    ) as any;

    render(<AdminTreksPage />);
    await screen.findByText("Everest Base Camp Trek");
    expect(screen.getByText("+ New Trek")).toBeInTheDocument();
  });

  it("should filter treks by search", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockTreks }) })
    ) as any;

    render(<AdminTreksPage />);
    await screen.findByText("Everest Base Camp Trek");

    const searchInput = screen.getByPlaceholderText("Search treks...");
    fireEvent.change(searchInput, { target: { value: "Annapurna" } });

    expect(screen.getByText("Annapurna Circuit")).toBeInTheDocument();
    expect(screen.queryByText("Everest Base Camp Trek")).not.toBeInTheDocument();
  });

  it("should show correct stat counts", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockTreks }) })
    ) as any;

    render(<AdminTreksPage />);
    await screen.findByText("Everest Base Camp Trek");

    expect(screen.getByText("2")).toBeInTheDocument(); // total treks
  });

  it("should show empty state when no treks found", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) })
    ) as any;

    render(<AdminTreksPage />);
    expect(await screen.findByText("No treks found")).toBeInTheDocument();
  });
});