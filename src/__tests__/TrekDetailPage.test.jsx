// src/__tests__/TrekDetailPage.test.jsx
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
  const original = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...original,
    useParams: () => ({ trekId: '1' }),
    useNavigate: jest.fn(),
  };
});

import { useNavigate } from 'react-router-dom';

// Helper to render inside BrowserRouter
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('TrekDetailPage', () => {
  let mockNavigate;

  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    window.alert = jest.fn();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders loading state initially', () => {
    renderWithRouter(<TrekDetailPage />);
    expect(screen.getByText(/loading trek details/i)).toBeInTheDocument();
  });

  test('fetches and displays trek title', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText('Everest Base Camp')).toBeInTheDocument();
  });

  test('displays trek image with correct src and alt', async () => {
    renderWithRouter(<TrekDetailPage />);
    const img = await screen.findByAltText('Everest Base Camp');
    expect(img).toHaveAttribute('src', 'http://localhost:5000/images/everest.jpg');
  });

  test('displays all trek details', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/Nepal/)).toBeInTheDocument();
    expect(await screen.findByText(/MODERATE/)).toBeInTheDocument();
    expect(await screen.findByText(/130 km/)).toBeInTheDocument();
    expect(await screen.findByText(/April-May/)).toBeInTheDocument();
    expect(await screen.findByText(/classic trek/i)).toBeInTheDocument();
    expect(await screen.findByText(/Detailed description here./)).toBeInTheDocument();
  });

  test('displays highlights and list items', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText('Highlights')).toBeInTheDocument();
    const items = await screen.findAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  test('favorite button toggles text correctly', async () => {
    renderWithRouter(<TrekDetailPage />);
    const btn = await screen.findByRole('button', { name: /add to favorites/i });

    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/favorited/i);

    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/add to favorites/i);

    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/favorited/i);
  });

  test('journal button alerts when user not logged in', async () => {
    renderWithRouter(<TrekDetailPage />);
    const btn = await screen.findByText(/view trek journal/i);
    fireEvent.click(btn);
    expect(window.alert).toHaveBeenCalledWith('User not logged in');
  });

  test('journal button navigates when user is logged in', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '123' }));
    renderWithRouter(<TrekDetailPage />);
    const btn = await screen.findByText(/view trek journal/i);
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/trek/1/journal', { state: { userId: '123' } });
  });

  test('handles fetch error on bad response', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/Failed to fetch trek/i)).toBeInTheDocument();
  });

  test('handles fetch error on network failure', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    renderWithRouter(<TrekDetailPage />);
    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
  });

  test('renders multiple N/A fields when data missing', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'Test Trek' }), // missing other fields
      })
    );
    renderWithRouter(<TrekDetailPage />);
    const naItems = await screen.findAllByText(/N\/A/);
    expect(naItems.length).toBeGreaterThan(0);
  });

  test('has correct button and title classes', async () => {
    renderWithRouter(<TrekDetailPage />);
    expect((await screen.findByText('Everest Base Camp'))).toHaveClass('trek-title');
    expect(await screen.findByRole('button', { name: /add to favorites/i })).toHaveClass('favorite-btn');
    expect(await screen.findByText(/view trek journal/i)).toHaveClass('journal-btn');
  });

  test('renders without crashing if trekId param missing', () => {
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({});
    renderWithRouter(<TrekDetailPage />);
  });

  test('shows loading text before data fetched', () => {
    renderWithRouter(<TrekDetailPage />);
    expect(screen.getByText(/loading trek details/i)).toBeInTheDocument();
  });
});
