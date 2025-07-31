// src/__tests__/TrekList.test.jsx
import React from 'react';
import '@testing-library/jest-dom';  // << Import this!
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TrekList from '../pages/Treks/trekList'; // adjust path if needed
import useTreks from '../hooks/Trek/useTreks';
import { deleteTrek } from '../api/Trek/trekApi';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../hooks/Trek/useTreks');
jest.mock('../api/Trek/trekApi');

describe('TrekList component', () => {
  const mockFetchTreks = jest.fn();

  beforeEach(() => {
    mockFetchTreks.mockClear();
    deleteTrek.mockClear();

    useTreks.mockReturnValue({
      treks: [
        {
          _id: '1',
          name: 'Everest Base Camp',
          location: 'Nepal',
          description: 'Famous trek',
          difficulty: 'HARD',
          distance: 130,
        },
        {
          _id: '2',
          name: 'Annapurna Circuit',
          location: 'Nepal',
          description: '',
          difficulty: 'MODERATE',
          distance: 200,
        },
      ],
      fetchTreks: mockFetchTreks,
    });
  });

  test('renders trek list correctly', () => {
    render(
      <MemoryRouter>
        <TrekList />
      </MemoryRouter>
    );

    expect(screen.getByText(/treks/i)).toBeInTheDocument();
    expect(screen.getByText(/everest base camp/i)).toBeInTheDocument();
    expect(screen.getByText(/annapurna circuit/i)).toBeInTheDocument();
    expect(screen.getAllByText(/edit/i)).toHaveLength(2);
    expect(screen.getAllByText(/delete/i)).toHaveLength(2);
  });

  test('shows message when no treks exist', () => {
    useTreks.mockReturnValueOnce({
      treks: [],
      fetchTreks: mockFetchTreks,
    });

    render(
      <MemoryRouter>
        <TrekList />
      </MemoryRouter>
    );

    expect(screen.getByText(/no treks found/i)).toBeInTheDocument();
  });

  test('calls deleteTrek and fetchTreks on confirm delete', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <MemoryRouter>
        <TrekList />
      </MemoryRouter>
    );

    const deleteButtons = screen.getAllByText(/delete/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteTrek).toHaveBeenCalledWith('1');
      expect(mockFetchTreks).toHaveBeenCalled();
    });

    window.confirm.mockRestore();
  });

  test('does not call deleteTrek if delete is cancelled', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <MemoryRouter>
        <TrekList />
      </MemoryRouter>
    );

    const deleteButtons = screen.getAllByText(/delete/i);
    fireEvent.click(deleteButtons[0]);

    expect(deleteTrek).not.toHaveBeenCalled();
    expect(mockFetchTreks).not.toHaveBeenCalled();

    window.confirm.mockRestore();
  });
});
