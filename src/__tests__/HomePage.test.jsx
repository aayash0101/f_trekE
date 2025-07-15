// src/__tests__/HomePage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from '../pages/HomePage'; // adjust path if needed

describe('HomePage', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  });

  test('renders main title and subtitle', () => {
    expect(screen.getByRole('heading', { level: 1, name: /TrekEnhance/i })).toBeInTheDocument();
    expect(screen.getByText(/Explore\. Elevate\. Experience the Himalayas\./i)).toBeInTheDocument();
  });

  test('renders hero section title and description', () => {
    expect(screen.getByRole('heading', { level: 2, name: /Find the Perfect Trek for You/i })).toBeInTheDocument();
    expect(screen.getByText(/Whether you're a seasoned mountaineer or a casual explorer/i)).toBeInTheDocument();
  });

  test('renders navigation links with correct text and href', () => {
    const journalsLink = screen.getByRole('link', { name: /Journals/i });
    const exploreLink = screen.getByRole('link', { name: /Explore Treks/i });
    const profileLink = screen.getByRole('link', { name: /Profile/i });

    expect(journalsLink).toBeInTheDocument();
    expect(journalsLink).toHaveAttribute('href', '/journals');

    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute('href', '/trekker');

    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  test('renders feature cards with titles and descriptions', () => {
    const features = [
      {
        title: /Curated Treks/i,
        description: /Access handpicked trekking trails with detailed descriptions and difficulty levels\./i,
      },
      {
        title: /Track Progress/i,
        description: /Track your completed treks, set goals, and review your experience\./i,
      },
      {
        title: /Community Reviews/i,
        description: /Read real reviews from fellow trekkers to plan your journey better\./i,
      },
    ];

    features.forEach(({ title, description }) => {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });
});
