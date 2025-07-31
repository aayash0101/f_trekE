// src/__tests__/AdminDashboard.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard'; // adjust the path as needed

// Helper to render with router context
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('AdminDashboard', () => {
    beforeEach(() => {
        renderWithRouter(<AdminDashboard />);
    });

    test('renders sidebar title and welcome message', () => {
        expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
        expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument();
        expect(
            screen.getByText(/use the sidebar to manage treks/i)
        ).toBeInTheDocument();
    });

    test('renders all sidebar navigation links', () => {
        expect(screen.getByRole('link', { name: /add trek/i })).toHaveAttribute('href', '/add');
        expect(screen.getByRole('link', { name: /view treks/i })).toHaveAttribute('href', '/trek');
        expect(screen.getByRole('link', { name: /manage users/i })).toHaveAttribute('href', '/users');
        expect(screen.getByRole('link', { name: /view reviews/i })).toHaveAttribute('href', '/all-reviews');
    });

    test('renders dashboard cards with correct titles and buttons', () => {
        // Check card headings
        expect(screen.getByText(/add new trek/i)).toBeInTheDocument();
        expect(screen.getByText(/^Manage Treks$/i)).toBeInTheDocument();
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
        expect(screen.getByText(/^Reviews$/i)).toBeInTheDocument();


        // Check card descriptions
        expect(screen.getByText(/create a new trek listing/i)).toBeInTheDocument();
        expect(screen.getByText(/view, edit or delete existing treks/i)).toBeInTheDocument();
        expect(screen.getByText(/view or delete registered users/i)).toBeInTheDocument();
        expect(screen.getByText(/check reviews and feedback/i)).toBeInTheDocument();

        // Check "Go" buttons
        const goButtons = screen.getAllByRole('link', { name: /go/i });
        expect(goButtons).toHaveLength(4);
        expect(goButtons[0]).toHaveAttribute('href', '/add');
        expect(goButtons[1]).toHaveAttribute('href', '/trek');
        expect(goButtons[2]).toHaveAttribute('href', '/users');
        expect(goButtons[3]).toHaveAttribute('href', '/all-reviews');
    });
});
