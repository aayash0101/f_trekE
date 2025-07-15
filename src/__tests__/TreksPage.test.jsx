import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TreksPage from '../pages/TreksPage';

// Helper to wrap component in router for Link to work
import { MemoryRouter } from 'react-router-dom';

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

// Mock the useTreks hook to control data for tests
jest.mock('../hooks/Trek/useTreks', () => {
  return jest.fn();
});

import useTreks from '../hooks/Trek/useTreks';

describe('TreksPage', () => {
  const mockTreks = [
    {
      _id: '1',
      name: 'Annapurna Base Camp',
      location: 'Nepal',
      description: 'Beautiful trek in Nepal.',
      difficulty: 'moderate',
      duration: '7',
      maxGroupSize: 12,
      rating: 4.8,
      reviews: 120,
    },
    {
      _id: '2',
      name: 'Everest Base Camp',
      location: 'Nepal',
      description: 'Classic Everest trek.',
      difficulty: 'hard',
      duration: '12',
      maxGroupSize: 10,
      rating: 4.9,
      reviews: 200,
    },
  ];

  beforeEach(() => {
    useTreks.mockReturnValue({ treks: mockTreks });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders page title and subtitle', () => {
    renderWithRouter(<TreksPage />);
    expect(screen.getByRole('heading', { name: /Explore Treks/i })).toBeInTheDocument();
    expect(screen.getByText(/breathtaking adventures/i)).toBeInTheDocument();
  });

  test('renders both trek titles', () => {
    renderWithRouter(<TreksPage />);
    expect(screen.getByText(/Annapurna Base Camp/i)).toBeInTheDocument();
    expect(screen.getByText(/Everest Base Camp/i)).toBeInTheDocument();
  });

  test('renders correct number of trek cards', () => {
    renderWithRouter(<TreksPage />);
    const trekCards = screen.getAllByRole('article');
    expect(trekCards.length).toBe(2);
  });

  test('filters treks by search input', () => {
    renderWithRouter(<TreksPage />);
    const searchInput = screen.getByPlaceholderText(/search treks/i);
    fireEvent.change(searchInput, { target: { value: 'Everest' } });

    expect(screen.queryByText(/Annapurna Base Camp/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Everest Base Camp/i)).toBeInTheDocument();
  });

  test('filters treks by difficulty', () => {
    renderWithRouter(<TreksPage />);
    const difficultySelect = screen.getByDisplayValue(/All Difficulties/i);
    fireEvent.change(difficultySelect, { target: { value: 'hard' } });

    expect(screen.queryByText(/Annapurna Base Camp/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Everest Base Camp/i)).toBeInTheDocument();
  });

  test('toggles dark mode button', () => {
    renderWithRouter(<TreksPage />);
    const toggleBtn = screen.getByRole('button', { name: /dark mode/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toMatch(/light mode/i);

    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toMatch(/dark mode/i);
  });

  test('shows correct trek count text', () => {
    renderWithRouter(<TreksPage />);
    expect(screen.getByText(/showing 2 trek\(s\)/i)).toBeInTheDocument();
  });

  test('renders view details links', () => {
    renderWithRouter(<TreksPage />);
    const viewLinks = screen.getAllByRole('link', { name: /view details/i });
    expect(viewLinks.length).toBe(2);
  });

  test('renders meta info in trek card', () => {
    renderWithRouter(<TreksPage />);
    expect(screen.getByText(/7 days/i)).toBeInTheDocument();
    expect(screen.getByText(/max 12/i)).toBeInTheDocument();
    expect(screen.getByText(/4.8 \(120 reviews\)/i)).toBeInTheDocument();
  });

  test('filters treks by location', () => {
    renderWithRouter(<TreksPage />);
    const locationSelect = screen.getByDisplayValue(/All Locations/i);
    fireEvent.change(locationSelect, { target: { value: 'nepal' } });

    expect(screen.getByText(/Annapurna Base Camp/i)).toBeInTheDocument();
    expect(screen.getByText(/Everest Base Camp/i)).toBeInTheDocument();

    fireEvent.change(locationSelect, { target: { value: 'peru' } });
    expect(screen.queryByText(/Annapurna Base Camp/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Everest Base Camp/i)).not.toBeInTheDocument();
  });

  test('filters treks by duration (long)', () => {
    renderWithRouter(<TreksPage />);
    const durationSelect = screen.getByDisplayValue(/All Durations/i);
    fireEvent.change(durationSelect, { target: { value: 'long' } });

    expect(screen.queryByText(/Annapurna Base Camp/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Everest Base Camp/i)).toBeInTheDocument();
  });
});
