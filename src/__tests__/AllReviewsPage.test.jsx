// src/__tests__/AllReviewsPage.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import AllReviewsPage from '../pages/AllReviewsPage'; // Adjust import path as needed
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => jest.fn(),
  };
});

const BACKEND_URL = 'http://localhost:5000';

describe('AllReviewsPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockTreks = [
    {
      _id: '1',
      name: 'Annapurna Circuit',
      imageUrl: '/uploads/annapurna.jpg',
      reviews: [
        {
          _id: 'r1',
          username: 'Alice',
          review: 'Amazing trek!',
          date: '2025-07-30T12:00:00Z',
        },
      ],
    },
    {
      _id: '2',
      name: 'Everest Base Camp',
      imageUrl: '/uploads/everest.jpg',
      reviews: [
        {
          _id: 'r2',
          username: 'Bob',
          review: 'Challenging but rewarding.',
          date: '2025-07-29T08:30:00Z',
        },
      ],
    },
    {
      _id: '3',
      name: 'Langtang Valley',
      imageUrl: '/uploads/langtang.jpg',
      reviews: [],
    },
  ];

  function renderComponent() {
    return render(
      <MemoryRouter>
        <AllReviewsPage />
      </MemoryRouter>
    );
  }

  test('shows loading initially', () => {
    fetch.mockReturnValue(new Promise(() => {})); // never resolves
    renderComponent();
    expect(screen.getByText(/loading all reviews/i)).toBeInTheDocument();
  });

  test('fetches and displays trek reviews', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTreks,
    });

    renderComponent();

    // Wait for trek review blocks (h2 with class trek-review-title)
    const trekTitles = await screen.findAllByRole('heading', { level: 2, name: /circuit|base camp|valley/i });
    // There should be 3 trek headings displayed (not counting options)
    expect(trekTitles).toHaveLength(3);
    expect(trekTitles.some((el) => /annapurna circuit/i.test(el.textContent))).toBe(true);
    expect(trekTitles.some((el) => /everest base camp/i.test(el.textContent))).toBe(true);
    expect(trekTitles.some((el) => /langtang valley/i.test(el.textContent))).toBe(true);

    // Check reviews presence for Annapurna
    const annapurnaSection = trekTitles.find((el) => /annapurna circuit/i.test(el.textContent)).closest('.trek-review-block');
    expect(annapurnaSection).toBeInTheDocument();
    expect(within(annapurnaSection).getByText(/alice/i)).toBeInTheDocument();
    expect(within(annapurnaSection).getByText(/amazing trek!/i)).toBeInTheDocument();

    // Check "No reviews" text for Langtang Valley
    const langtangSection = trekTitles.find((el) => /langtang valley/i.test(el.textContent)).closest('.trek-review-block');
    expect(within(langtangSection).getByText(/no reviews yet for this trek/i)).toBeInTheDocument();
  });

  test('shows error message on fetch failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    renderComponent();

    expect(await screen.findByText(/error: failed to fetch reviews/i)).toBeInTheDocument();
  });

  test('shows "no reviews found" if no treks', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderComponent();

    expect(await screen.findByText(/no reviews found/i)).toBeInTheDocument();
  });

  test('searches treks and reviews based on search input', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTreks,
    });

    renderComponent();

    await screen.findByText(/all user reviews/i);

    const searchInput = screen.getByPlaceholderText(/search reviews or trek names/i);

    // Search by trek name "Langtang"
    fireEvent.change(searchInput, { target: { value: 'Langtang' } });
    const trekTitlesLangtang = screen.getAllByRole('heading', { level: 2 });
    expect(trekTitlesLangtang).toHaveLength(1);
    expect(trekTitlesLangtang[0]).toHaveTextContent(/langtang valley/i);

    // Search by review text "amazing"
    fireEvent.change(searchInput, { target: { value: 'amazing' } });
    const trekTitlesAmazing = screen.getAllByRole('heading', { level: 2 });
    expect(trekTitlesAmazing).toHaveLength(1);
    expect(trekTitlesAmazing[0]).toHaveTextContent(/annapurna circuit/i);

    // Search by username "bob"
    fireEvent.change(searchInput, { target: { value: 'bob' } });
    const trekTitlesBob = screen.getAllByRole('heading', { level: 2 });
    expect(trekTitlesBob).toHaveLength(1);
    expect(trekTitlesBob[0]).toHaveTextContent(/everest base camp/i);
  });
});

