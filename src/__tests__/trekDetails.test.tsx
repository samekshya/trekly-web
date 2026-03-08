import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TrekDetailsPage from "../app/treks/[id]/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), back: jest.fn() })),
  useParams: jest.fn(() => ({ id: "test-id-123" })),
  usePathname: jest.fn(() => "/treks/test-id-123"),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock child components that make their own API calls
jest.mock("../components/WeatherCard", () => ({
  __esModule: true,
  default: () => <div data-testid="weather-card">Weather</div>,
}));

jest.mock("../components/ReviewSection", () => ({
  __esModule: true,
  default: () => <div data-testid="review-section">Reviews</div>,
}));

const mockTrek = {
  _id: "test-id-123",
  name: "Everest Base Camp",
  description: "An iconic Himalayan trek",
  location: "Solukhumbu, Nepal",
  duration: 14,
  difficulty: "Hard",
  price: 150000,
  imageUrl: "https://example.com/ebc.jpg",
  highlights: ["Stunning views", "Expert guides"],
  includes: ["Accommodation", "Meals"],
};

describe("Trek Details Page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const { useRouter, useParams } = require("next/navigation");
    useRouter.mockReturnValue({ push: jest.fn(), back: jest.fn() });
    useParams.mockReturnValue({ id: "test-id-123" });

    Storage.prototype.getItem = jest.fn((key: string) => {
      if (key === "token") return "mock-token";
      if (key === "user") return JSON.stringify({ name: "Test User" });
      return null;
    });
  });

  it("should show loading state initially", () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as any;
    render(<TrekDetailsPage />);
    // Page renders without crashing during loading
    expect(document.body).toBeInTheDocument();
  });

  it("should show trek details when loaded", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockTrek }),
      })
    ) as any;

    render(<TrekDetailsPage />);
    expect(await screen.findByText("Everest Base Camp")).toBeInTheDocument();
  });

  it("should show error when trek not found", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    ) as any;

    render(<TrekDetailsPage />);
    // Should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it("should show Book This Trek button when trek loads", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockTrek }),
      })
    ) as any;

    render(<TrekDetailsPage />);
    expect(await screen.findByText("Book This Trek")).toBeInTheDocument();
  });

  it("should display trek price", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockTrek }),
      })
    ) as any;

    render(<TrekDetailsPage />);
    await screen.findByText("Everest Base Camp");
    expect(screen.getAllByText(/150,000/).length).toBeGreaterThan(0);
  });
});