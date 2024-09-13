import itemsReducer, { setSearchTerm, setCurrentPage, fetchItems } from './itemsSlice';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('itemsSlice reducers and actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      items: [],
      searchTerm: '',
      isLoading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test('should return the initial state', () => {
    const initialState = {
      items: [],
      searchTerm: '',
      isLoading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
    };
    expect(itemsReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle setSearchTerm', () => {
    const previousState = {
      items: [],
      searchTerm: '',
      isLoading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
    };
    expect(itemsReducer(previousState, setSearchTerm('test'))).toEqual({
      ...previousState,
      searchTerm: 'test',
    });
  });

  test('should handle setCurrentPage', () => {
    const previousState = {
      items: [],
      searchTerm: '',
      isLoading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
    };
    expect(itemsReducer(previousState, setCurrentPage(2))).toEqual({
      ...previousState,
      currentPage: 2,
    });
  });

  describe('async thunk fetchItems', () => {
    test('should dispatch fetchItems.pending and fetchItems.fulfilled', async () => {
      const mockData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];

      mockAxios.onGet('http://localhost:8050/items').reply(200, mockData);

      await store.dispatch(fetchItems());

      const actions = store.getActions();
      expect(actions[0].type).toEqual(fetchItems.pending.type);
      expect(actions[1].type).toEqual(fetchItems.fulfilled.type);
      expect(actions[1].payload).toEqual(mockData);
    });

    test('should dispatch fetchItems.pending and fetchItems.rejected on failure', async () => {
      mockAxios.onGet('http://localhost:8050/items').reply(500);

      await store.dispatch(fetchItems());

      const actions = store.getActions();
      expect(actions[0].type).toEqual(fetchItems.pending.type);
      expect(actions[1].type).toEqual(fetchItems.rejected.type);
      expect(actions[1].error.message).toBeDefined();
    });
  });
});
