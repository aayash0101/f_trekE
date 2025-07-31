import React from 'react';
import '@testing-library/jest-dom'; 
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserList from '../pages/admin/Users/UserList';  // adjust path accordingly
import * as userApi from '../api/Admin/userapi';  

jest.mock('../api/Admin/userapi');

describe('UserList Component', () => {
  const mockUsers = [
    { _id: '1', username: 'user1', userType: 'admin' },
    { _id: '2', username: 'user2', userType: 'user' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders users after fetching from API', async () => {
    userApi.getAllUsers.mockResolvedValue(mockUsers);

    render(<UserList />);

    // Wait for the users to be loaded and rendered
    for (const user of mockUsers) {
      await waitFor(() => {
        expect(screen.getByText(user.username)).toBeInTheDocument();
        expect(screen.getByText(user.userType)).toBeInTheDocument();
      });
    }
  });

  test('shows "No users found." if no users', async () => {
    userApi.getAllUsers.mockResolvedValue([]);

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });
  });

  test('deletes a user when delete button is clicked and confirmed', async () => {
    userApi.getAllUsers.mockResolvedValue(mockUsers);
    userApi.deleteUser.mockResolvedValue({}); // simulate successful delete

    // Mock window.confirm to always return true
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<UserList />);

    // Wait for users to appear
    await waitFor(() => screen.getByText('user1'));

    const deleteButtons = screen.getAllByText(/delete/i);

    // Click delete for first user
    fireEvent.click(deleteButtons[0]);

    // Expect deleteUser API called with correct id
    expect(userApi.deleteUser).toHaveBeenCalledWith('1');

    // Wait for user to be removed from UI
    await waitFor(() => {
      expect(screen.queryByText('user1')).not.toBeInTheDocument();
    });

    // Restore confirm mock
    window.confirm.mockRestore();
  });

  test('does not delete user if confirmation is cancelled', async () => {
    userApi.getAllUsers.mockResolvedValue(mockUsers);
    userApi.deleteUser.mockResolvedValue({}); 

    // Mock confirm to cancel
    jest.spyOn(window, 'confirm').mockImplementation(() => false);

    render(<UserList />);

    await waitFor(() => screen.getByText('user1'));

    const deleteButtons = screen.getAllByText(/delete/i);

    fireEvent.click(deleteButtons[0]);

    // deleteUser should NOT be called because confirmation cancelled
    expect(userApi.deleteUser).not.toHaveBeenCalled();

    // user should still be present
    expect(screen.getByText('user1')).toBeInTheDocument();

    window.confirm.mockRestore();
  });
});
