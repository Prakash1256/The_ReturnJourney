import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  items: [],
  searchTerm: '',
  isLoading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
};

// Async thunk to fetch data from JSON server
export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  try {
    const response = await axios.get('http://localhost:8050/items');
    return response.data;
  } catch (error) {
    throw error;
  }
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, setCurrentPage } = itemsSlice.actions;
export default itemsSlice.reducer;
