// src/__tests__/TrekReviewsPage.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TrekReviewsPage from '../pages/TrekReviewsPage'; // adjust path as needed
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => jest.fn(),
  };
});

const BACKEND_URL = 'http://localhost:5000';

describe('TrekReviewsPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const trekId = '123';

  const mockTrekData = {
    name: 'Annapurna Circuit',
    imageUrl: '/uploads/annapurna.jpg',
    reviews: [
      {
        username: 'Alice',
        review: 'Amazing trek, highly recommend!',
        date: '2025-07-30T12:00:00Z',
      },
      {
        username: 'Bob',
        review: 'Challenging but worth it.',
        date: '2025-07-29T08:30:00Z',
      },
    ],
  };

  function renderWithRouter() {
    return render(
      <MemoryRouter initialEntries={[`/trek-reviews/${trekId}`]}>
        <Routes>
          <Route path="/trek-reviews/:trekId" element={<TrekReviewsPage />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test('shows loading initially', async () => {
    fetch.mockReturnValue(new Promise(() => {})); // never resolves
    renderWithRouter();

    expect(screen.getByText(/loading reviews/i)).toBeInTheDocument();
  });

  test('fetches and displays trek data and reviews', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTrekData,
    });

    renderWithRouter();

    // Wait for trek name to appear
    expect(await screen.findByRole('heading', { name: /annapurna circuit — reviews/i })).toBeInTheDocument();

    // Image with correct src and alt
    const img = screen.getByRole('img', { name: /annapurna circuit/i });
    expect(img).toHaveAttribute('src', `${BACKEND_URL}${mockTrekData.imageUrl}`);

    // Reviews content
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(screen.getByText(/amazing trek, highly recommend!/i)).toBeInTheDocument();
    expect(screen.getByText(/bob/i)).toBeInTheDocument();
    expect(screen.getByText(/challenging but worth it./i)).toBeInTheDocument();

    // Review dates (locale strings, so test just existence)
    expect(screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/).length).toBe(2);
  });

  test('shows no reviews message if no reviews', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockTrekData, reviews: [] }),
    });

    renderWithRouter();

    expect(await screen.findByText(/no reviews yet for this trek/i)).toBeInTheDocument();
  });

  test('shows error message on fetch failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    renderWithRouter();

    expect(await screen.findByText(/error: failed to fetch trek/i)).toBeInTheDocument();
  });

  test('shows no trek data message if trek is null', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    });

    renderWithRouter();

    expect(await screen.findByText(/no trek data found/i)).toBeInTheDocument();
  });
});
