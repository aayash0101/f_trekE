// TrekDetailPage.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TrekDetailPage from '../pages/TrekDetailPage';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        name: 'Everest Base Camp',
        imageUrl: '/images/everest.jpg',
        location: 'Nepal',
        difficulty: 'MODERATE',
        distance: 130,
        bestSeason: 'April-May',
        smallDescription: 'A classic trek to the foot of Everest.',
        description: 'Detailed description here.',
        highlights: ['View of Everest', 'Sherpa culture', 'Sagarmatha National Park'],
      }),
  })
);

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({ trekId: '1' }),
    useNavigate: jest.fn(),
  };
});

import { useNavigate } from 'react-router-dom';

// Helper to render inside Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('TrekDetailPage', () => {
  let mockNavigate;

  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders loading state initially', () => {
    renderWithRouter(<TrekDetailPage />);
    expect(screen.getByText(/loading trek details/i)).toBeInTheDocument();
  });

  test('fetches and displays trek title', async () => {
    renderWithRouter(<TrekDetailPage />);
    const title = await screen.findByText('Everest Base Camp');
    expect(title).toBeInTheDocument();
  });

  test('displays trek image with correct src and alt', async () => {
    renderWithRouter(<TrekDetailPage />);
    const image = await screen.findByAltText('Everest Base Camp');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'http://localhost:5000/images/everest.jpg');
  });

  test('displays location', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/Nepal/)).toBeInTheDocument();
  });

  test('displays difficulty', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/MODERATE/)).toBeInTheDocument();
  });

  test('displays distance', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/130 km/)).toBeInTheDocument();
  });

  test('displays best season', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/April-May/)).toBeInTheDocument();
  });

  test('displays short description', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/classic trek/i)).toBeInTheDocument();
  });

  test('displays full description', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/Detailed description here./)).toBeInTheDocument();
  });

  test('displays highlights', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/View of Everest/)).toBeInTheDocument();
  });

  test('favorite button toggles text on multiple clicks', async () => {
    renderWithRouter(<TrekDetailPage />);
    const btn = await screen.findByRole('button', { name: /add to favorites/i });

    // First click -> favorited
    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/favorited/i);

    // Second click -> add to favorites
    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/add to favorites/i);

    // Third click -> favorited again
    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/favorited/i);
  });

  test('journal button shows alert when user not logged in', async () => {
    window.alert = jest.fn();
    renderWithRouter(<TrekDetailPage />);
    const btn = await screen.findByText(/view trek journal/i);
    fireEvent.click(btn);
    expect(window.alert).toHaveBeenCalledWith('User not logged in');
  });

  test('journal button navigates with user id', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '123' }));
    renderWithRouter(<TrekDetailPage />);
    const btn = await screen.findByText(/view trek journal/i);
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/trek/1/journal', { state: { userId: '123' } });
  });

  test('handles fetch error gracefully on bad response', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/Failed to fetch trek/i)).toBeInTheDocument();
  });

  test('handles fetch error gracefully on network failure', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
  });

  test('renders N/A when optional data is missing', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'Test Trek' }), // no other fields
      })
    );
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/N\/A/)).toBeInTheDocument();
  });

  test('displays correct button styles initially', async () => {
    renderWithRouter(<TrekDetailPage />);
    const btn = await screen.findByRole('button', { name: /add to favorites/i });
    expect(btn).toHaveClass('favorite-btn');
  });

  test('title uses correct class', async () => {
    renderWithRouter(<TrekDetailPage />);
    const title = await screen.findByText('Everest Base Camp');
    expect(title).toHaveClass('trek-title');
  });

  test('journal button uses correct class', async () => {
    renderWithRouter(<TrekDetailPage />);
    const btn = await screen.findByText(/view trek journal/i);
    expect(btn).toHaveClass('journal-btn');
  });

  test('renders highlights list items correctly', async () => {
    renderWithRouter(<TrekDetailPage />);
    const items = await screen.findAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  test('highlights section has correct heading', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText('Highlights')).toBeInTheDocument();
  });

  test('renders without crashing if trekId param missing', () => {
    // We temporarily override useParams to return undefined
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({});
    renderWithRouter(<TrekDetailPage />);
  });

  test('displays loading text before data fetched', () => {
    renderWithRouter(<TrekDetailPage />);
    expect(screen.getByText(/loading trek details/i)).toBeInTheDocument();
  });
});
