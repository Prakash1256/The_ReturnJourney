import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ItemList from './ItemList';

describe('ItemList component', () => {
  test('renders a list of items', () => {
    // Mock items to pass as props
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];

    // Render the component
    render(<ItemList items={items} />);

    // Assert that each item is rendered in the document
    items.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  test('renders empty list when no items are passed', () => {
    // Render the component with an empty items array
    render(<ItemList items={[]} />);

    // Assert that no list items are rendered
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });
});
