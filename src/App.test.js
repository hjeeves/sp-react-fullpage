import { render, screen } from '@testing-library/react';
import SciencePortalApp from './App';
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  container.setAttribute("id", "react-mountpoint");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});



test('renders learn react link', () => {
  render(<SciencePortalApp />);
  const linkElement = screen.getByText(/Science Portal/i);
  expect(linkElement).toBeInTheDocument();
});
