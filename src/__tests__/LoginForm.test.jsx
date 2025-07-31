// src/__tests__/LoginForm.test.jsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm';  // adjust the path if needed
import { BrowserRouter } from 'react-router-dom';

// Mock API
jest.mock('../api/authapi', () => ({
  login: jest.fn(),
}));

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...original,
    useNavigate: jest.fn(),
  };
});

import { login } from '../api/authapi';
import { useNavigate } from 'react-router-dom';

// Helper to render with router
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('LoginForm', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders login form inputs and button', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('admin login navigates to admindashboard', () => {
    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'admin' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admindashboard');
  });

  test('successful login stores data and navigates', async () => {
    login.mockResolvedValueOnce({
      data: {
        token: 'test-token',
        user: { id: '123', username: 'testuser' },
      },
    });

    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'testpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toContain('testuser');
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  test('shows alert on login error', async () => {
    window.alert = jest.fn();
    login.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid username or password');
    });
  });

  test('redirect link to signup exists', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/signup');
  });
});
