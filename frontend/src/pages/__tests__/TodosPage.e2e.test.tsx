import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodosPage from '../TodosPage';
import { AuthProvider } from '../../context/AuthContext';
import client from '../../api/client';

vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: { id: 1, title: 'My Todo', completed: false } }),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('TodosPage E2E flow (component-level)', () => {
  it('adds a todo from input to list', async () => {
    const user = userEvent.setup();
    render(<AuthProvider><TodosPage /></AuthProvider>);

    await user.type(screen.getByRole('textbox'), 'My Todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText('My Todo')).toBeInTheDocument();
    });
    expect(client.post).toHaveBeenCalledWith('/todos', { title: 'My Todo' });
  });
});
