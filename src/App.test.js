import { render, screen } from '@testing-library/react';
import SciencePortalApp from './App';

test('renders learn react link', () => {
  render(<SciencePortalApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
