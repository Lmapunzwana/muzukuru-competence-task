import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';

function Harness() {
  const { token, login, logout } = useAuth();
  return <div>
    <span data-testid="token">{token ?? 'none'}</span>
    <button onClick={() => login('abc123', null)}>login</button>
    <button onClick={logout}>logout</button>
  </div>;
}

describe('AuthContext', () => {
  it('stores and clears token', async () => {
    const user = userEvent.setup();
    render(<AuthProvider><Harness /></AuthProvider>);
    expect(screen.getByTestId('token')).toHaveTextContent('none');
    await user.click(screen.getByText('login'));
    expect(screen.getByTestId('token')).toHaveTextContent('abc123');
    await user.click(screen.getByText('logout'));
    expect(screen.getByTestId('token')).toHaveTextContent('none');
  });
});
