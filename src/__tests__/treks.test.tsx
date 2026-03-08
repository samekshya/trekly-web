import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserTreksPage from "../app/treks/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/treks",
}));

// Mock next/dynamic
jest.mock("next/dynamic", () => () => {
  const MockMap = () => <div data-testid="trek-map">Map View</div>;
  return MockMap;
});

const mockTreks = [
  {
    _id: "1",
    name: "Everest Base Camp",
    description: "A great trek",
    location: "Solukhumbu",
    duration: 14,
    difficulty: "Hard",
    price: 1500,
    imageUrl: "https://example.com/ebc.jpg",
  },
];

describe("User Treks Page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should show skeleton loading state initially", () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as any;
    render(<UserTreksPage />);
    // Page renders with hero section
    expect(screen.getByText("Find Your Perfect Trek")).toBeInTheDocument();
  });

  it("should show no treks message when list is empty", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) })
    ) as any;

    render(<UserTreksPage />);
    expect(await screen.findByText("No treks found")).toBeInTheDocument();
  });

  it("should show trek cards when treks are returned", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockTreks }) })
    ) as any;

    render(<UserTreksPage />);
    expect(await screen.findByText("Everest Base Camp")).toBeInTheDocument();
    expect(await screen.findByText(/Solukhumbu/)).toBeInTheDocument();
  });

  it("should show error message when fetch fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    ) as any;

    render(<UserTreksPage />);
    expect(await screen.findByText("Failed to load treks")).toBeInTheDocument();
  });

  it("should filter treks by search input", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockTreks }) })
    ) as any;

    render(<UserTreksPage />);
    await screen.findByText("Everest Base Camp");

    const searchInput = screen.getByPlaceholderText("Search by trek name or location...");
    fireEvent.change(searchInput, { target: { value: "Everest" } });
    expect(screen.getByText("Everest Base Camp")).toBeInTheDocument();
  });

  it("should filter treks by difficulty", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockTreks }) })
    ) as any;

    render(<UserTreksPage />);
    await screen.findByText("Everest Base Camp");

    fireEvent.click(screen.getByText(/Easy/));
    expect(await screen.findByText("No treks found")).toBeInTheDocument();
  });

  it("should toggle to map view", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: mockTreks }) })
    ) as any;

    render(<UserTreksPage />);
    await screen.findByText("Everest Base Camp");

    fireEvent.click(screen.getByText(/Map/));
    expect(screen.getByTestId("trek-map")).toBeInTheDocument();
  });

  it("should show hero section with correct text", () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as any;
    render(<UserTreksPage />);
    expect(screen.getByText("EXPLORE NEPAL")).toBeInTheDocument();
    expect(screen.getByText("Find Your Perfect Trek")).toBeInTheDocument();
  });
});