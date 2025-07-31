import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';  // <-- Import MemoryRouter
import AllJournalsPage from '../pages/AllJournalsPage';  // Adjust path if needed
import * as journalApi from '../api/journalApi';
import * as savedAndFavoriteApi from '../api/savedAndFavoriteApi';

jest.mock('../api/journalApi');
jest.mock('../api/savedAndFavoriteApi');

const mockJournals = [
  {
    _id: 'j1',
    userId: { username: 'Alice' },
    trekId: { _id: 't1', name: 'Annapurna Circuit' },
    date: '2025-07-30T00:00:00Z',
    text: 'Amazing trek!',
    photos: ['/uploads/photo1.jpg'],
  },
  {
    _id: 'j2',
    userId: { username: 'Bob' },
    trekId: { _id: 't2', name: 'Everest Base Camp' },
    date: '2025-07-29T00:00:00Z',
    text: 'Challenging but rewarding.',
    photos: [],
  },
  {
    _id: 'j3',
    userId: { username: 'Charlie' },
    trekId: { _id: 't1', name: 'Annapurna Circuit' },
    date: '2025-07-28T00:00:00Z',
    text: 'Beautiful views!',
    photos: ['/uploads/photo2.jpg', '/uploads/photo3.jpg'],
  },
];

const renderWithRouter = () => {
  journalApi.getAllJournals.mockResolvedValue(mockJournals);
  savedAndFavoriteApi.getSavedJournals.mockResolvedValue([]);
  savedAndFavoriteApi.getFavoriteJournals.mockResolvedValue([]);

  return render(
    <MemoryRouter>
      <AllJournalsPage />
    </MemoryRouter>
  );
};

describe('AllJournalsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

    test('renders journal entries and filters correctly', async () => {
        renderWithRouter();

        expect(await screen.findByText(/trek journals/i)).toBeInTheDocument();

        expect(screen.getByText(/amazing trek!/i)).toBeInTheDocument();
        expect(screen.getByText(/challenging but rewarding/i)).toBeInTheDocument();
        expect(screen.getByText(/beautiful views!/i)).toBeInTheDocument();

        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveTextContent('All Treks');
        expect(screen.getByRole('combobox')).toHaveTextContent('Annapurna Circuit');
    });

    test('toggles save and favorite buttons', async () => {
        savedAndFavoriteApi.addSavedJournal.mockResolvedValue({});
        savedAndFavoriteApi.removeSavedJournal.mockResolvedValue({});
        savedAndFavoriteApi.addFavoriteJournal.mockResolvedValue({});
        savedAndFavoriteApi.removeFavoriteJournal.mockResolvedValue({});

        renderWithRouter();
        await screen.findByText(/trek journals/i);

        const aliceCard = screen.getByText(/amazing trek!/i).closest('.journal-card');

        const saveBtn = within(aliceCard).getByText(/save/i);
        fireEvent.click(saveBtn);

        const favoriteBtn = within(aliceCard).getByText(/favorite/i);
        fireEvent.click(favoriteBtn);

        // (Optional: add assertions or mocks to verify API calls)
    });
});
