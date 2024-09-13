import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ItemList from './ItemList';
import '@testing-library/jest-dom/extend-expect'; // for the matchers like toBeInTheDocument

// Mock data
const mockItems = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' }
];

const initialState = {
  items: {
    items: mockItems,
    searchTerm: '',
    isLoading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 2
  }
};

const mockStore = configureStore([]);
let store;

describe('ItemList Component', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders loading state', () => {
    const loadingState = {
      ...initialState,
      items: { ...initialState.items, isLoading: true }
    };
    store = mockStore(loadingState);
    render(
      <Provider store={store}>
        <ItemList />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    const errorState = {
      ...initialState,
      items: { ...initialState.items, error: 'Failed to fetch items' }
    };
    store = mockStore(errorState);
    render(
      <Provider store={store}>
        <ItemList />
      </Provider>
    );

    expect(screen.getByText('Error: Failed to fetch items')).toBeInTheDocument();
  });

  test('renders items correctly and handles pagination', () => {
    render(
      <Provider store={store}>
        <ItemList />
      </Provider>
    );

    // Initially, the first two items should be displayed
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    // Check that the second page is not rendered initially
    expect(screen.queryByText('Item 3')).not.toBeInTheDocument();

    // Click the "Next" button to move to the next page
    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);

    // Now the next two items should be displayed
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByText('Item 4')).toBeInTheDocument();
  });

  test('handles search functionality', () => {
    render(
      <Provider store={store}>
        <ItemList />
      </Provider>
    );

    // Simulate a search input
    const searchInput = screen.getByPlaceholderText('Search items...');
    fireEvent.change(searchInput, { target: { value: 'Item 3' } });

    // Now only 'Item 3' should be displayed
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  test('displays message when no items are found', () => {
    render(
      <Provider store={store}>
        <ItemList />
      </Provider>
    );

    // Simulate a search input that doesn't match any items
    const searchInput = screen.getByPlaceholderText('Search items...');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Item' } });

    // The "no items" message should be displayed
    expect(screen.getByText(/Item is not present search another item 😊/)).toBeInTheDocument();
  });

  test('disables previous button on the first page', () => {
    render(
      <Provider store={store}>
        <ItemList />
      </Provider>
    );

    // Check that the "Previous" button is disabled on the first page
    const previousButton = screen.getByRole('button', { name: /previous page/i });
    expect(previousButton).toBeDisabled();
  });

  test('disables next button on the last page', () => {
    const customState = {
      ...initialState,
      items: { ...initialState.items, currentPage: 2 }
    };
    store = mockStore(customState);
    render(
      <Provider store={store}>
        <ItemList />
      </Provider>
    );

    // Check that the "Next" button is disabled on the last page
    const nextButton = screen.getByRole('button', { name: /next page/i });
    expect(nextButton).toBeDisabled();
  });
});
