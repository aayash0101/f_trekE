// src/__tests__/EditTrek.test.jsx
import React from 'react';
import '@testing-library/jest-dom'; // for toBeInTheDocument etc
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTrek from '../pages/Treks/EditTrek'; // adjust path
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as trekApi from '../api/Trek/trekApi';
import axios from 'axios';
import * as ReactRouterDom from 'react-router-dom';

// Mock react-router-dom's useNavigate once here
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../api/Trek/trekApi');
jest.mock('axios');

const sampleTrek = {
  name: 'Annapurna Circuit',
  location: 'Nepal',
  smallDescription: 'Beautiful trek',
  description: 'Full description here',
  difficulty: 'MODERATE',
  distance: 200,
  bestSeason: 'Spring',
  imageUrl: '/uploads/annapurna.jpg',
  highlights: ['Mountain views', 'Local culture']
};

describe('EditTrek component', () => {
  const mockedNavigate = jest.fn();

  beforeEach(() => {
    trekApi.getTrek.mockResolvedValue({ data: sampleTrek });
    trekApi.updateTrek.mockResolvedValue({});
    axios.post.mockResolvedValue({ data: { imageUrl: '/uploads/newimage.jpg' } });
    ReactRouterDom.useNavigate.mockImplementation(() => mockedNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('loads and displays trek data', async () => {
    render(
      <MemoryRouter initialEntries={['/edit/123']}>
        <Routes>
          <Route path="/edit/:id" element={<EditTrek />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue(/Annapurna Circuit/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Nepal/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Beautiful trek/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Full description here/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('MODERATE')).toBeInTheDocument();
    expect(screen.getByDisplayValue('200')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Spring/i)).toBeInTheDocument();

    sampleTrek.highlights.forEach((highlight) => {
      expect(screen.getByDisplayValue(highlight)).toBeInTheDocument();
    });

    // Image preview src includes your backend path
    expect(screen.getByAltText(/preview/i)).toHaveAttribute('src', expect.stringContaining(sampleTrek.imageUrl));
  });

  test('updates form fields and highlights', async () => {
    render(
      <MemoryRouter initialEntries={['/edit/123']}>
        <Routes>
          <Route path="/edit/:id" element={<EditTrek />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue(sampleTrek.name));

    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'New Trek Name' } });
    expect(screen.getByDisplayValue('New Trek Name')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'HARD' } });
    expect(screen.getByDisplayValue('HARD')).toBeInTheDocument();

    fireEvent.click(screen.getByText('+ Add Highlight'));
    const highlightInputs = screen.getAllByPlaceholderText(/Highlight \d+/i);
    expect(highlightInputs.length).toBe(sampleTrek.highlights.length + 1);

    fireEvent.click(screen.getAllByText('✕')[0]);
    expect(screen.getAllByPlaceholderText(/Highlight \d+/i).length).toBe(sampleTrek.highlights.length);
  });


  test('submits form and calls updateTrek API', async () => {
    render(
      <MemoryRouter initialEntries={['/edit/123']}>
        <Routes>
          <Route path="/edit/:id" element={<EditTrek />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue(sampleTrek.name));

    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Updated Trek' } });
    fireEvent.click(screen.getByText(/update trek/i));

    await waitFor(() => {
      expect(trekApi.updateTrek).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalledWith('/trek');
    });
  });

  test('handles error gracefully on fetch failure', async () => {
    trekApi.getTrek.mockRejectedValueOnce(new Error('Failed to fetch trek'));
    // mock console.error to silence error logs in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/edit/123']}>
        <Routes>
          <Route path="/edit/:id" element={<EditTrek />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();

    // Form fields should NOT appear on fetch failure
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Name/i)).not.toBeInTheDocument();
    });

    console.error.mockRestore();
  });
});
