import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../components/SignupForm';
import { BrowserRouter } from 'react-router-dom';

// Mock API and useNavigate
jest.mock('../api/authapi', () => ({
  signup: jest.fn(),
}));

import { signup } from '../api/authapi';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...original,
    useNavigate: jest.fn(),
  };
});

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('SignupForm', () => {
  let mockNavigate;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    window.alert = jest.fn();
  });

  test('renders form inputs and button', () => {
    renderWithRouter(<SignupForm />);
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  test('updates form data on input change', () => {
    renderWithRouter(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'secret' } });
    
    expect(screen.getByPlaceholderText(/username/i)).toHaveValue('testuser');
    expect(screen.getByPlaceholderText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText(/password/i)).toHaveValue('secret');
  });

  test('successful signup calls navigate to login', async () => {
    signup.mockResolvedValueOnce({ data: { message: 'User registered' } });
    
    renderWithRouter(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'newpass' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpass',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('failed signup shows alert', async () => {
    signup.mockRejectedValueOnce({ response: { data: 'Error occurred' } });
    
    renderWithRouter(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'failuser' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'fail@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'failpass' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Signup failed. Please check your data.');
    });
  });

  test('login link navigates to /login', () => {
    renderWithRouter(<SignupForm />);
    const link = screen.getByText(/login/i);
    expect(link).toHaveAttribute('href', '/login');
  });
});
