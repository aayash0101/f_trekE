import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddTrek from '../pages/Treks/AddTrek'; // adjust import if path is different
import { addTrek } from '../api/Trek/trekApi';

// Mock the addTrek API
jest.mock('../api/Trek/trekApi', () => ({
    addTrek: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Helper to render with router context
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('AddTrek component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all form fields', () => {
        renderWithRouter(<AddTrek />);
        expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Location/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Short Description/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Full Description/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Distance \(km\)/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Best Season/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Highlights/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Upload Trek Image/i)).toBeInTheDocument();
    });

    test('updates text inputs and select', () => {
        renderWithRouter(<AddTrek />);

        // Fill inputs as before
        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Annapurna Circuit' } });
        fireEvent.change(screen.getByPlaceholderText(/Location/i), { target: { value: 'Nepal' } });
        fireEvent.change(screen.getByPlaceholderText(/Distance \(km\)/i), { target: { value: '200' } });

        // Change select value
        const difficultySelect = screen.getByRole('combobox');
        fireEvent.change(difficultySelect, { target: { value: 'HARD' } });

        // Check inputs values
        expect(screen.getByDisplayValue('Annapurna Circuit')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Nepal')).toBeInTheDocument();
        expect(screen.getByDisplayValue('200')).toBeInTheDocument();

        // Instead of getByDisplayValue for select, check select's value directly:
        expect(difficultySelect.value).toBe('HARD');
    });


    test('submits form and calls addTrek API', async () => {
        addTrek.mockResolvedValueOnce({}); // simulate API success

        renderWithRouter(<AddTrek />);
        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Langtang Trek' } });
        fireEvent.click(screen.getByRole('button', { name: /Add Trek/i }));

        await waitFor(() => {
            expect(addTrek).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/trek');
        });
    });

    test('handles API error gracefully', async () => {
        addTrek.mockRejectedValueOnce(new Error('Failed to add'));

        renderWithRouter(<AddTrek />);
        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Ghorepani Trek' } });
        fireEvent.click(screen.getByRole('button', { name: /Add Trek/i }));

        await waitFor(() => {
            expect(addTrek).toHaveBeenCalledTimes(1);
        });

        // No crash; error logged in console (can't directly assert on console)
    });
});
