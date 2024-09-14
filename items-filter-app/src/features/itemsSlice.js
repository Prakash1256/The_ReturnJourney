import { createSlice } from '@reduxjs/toolkit';

// Initial state with static data
const initialState = {
  items: [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Orange' },
    { id: 4, name: 'Grapes' },
    { id: 5, name: 'Mango' },
    { id: 6, name: 'Pineapple' },
    { id: 7, name: 'Strawberry' },
    { id: 8, name: 'Blueberry' },
    { id: 9, name: 'Watermelon' },
    { id: 10, name: 'Peach' },
    { id: 11, name: 'Kiwi' },
    { id: 12, name: 'Plum' },
    { id: 13, name: 'Cherry' },
    { id: 14, name: 'Avocado' },
    { id: 15, name: 'Pomegranate' },
    { id: 16, name: 'Raspberry' },
    { id: 17, name: 'Blackberry' },
    { id: 18, name: 'Fig' },
    { id: 19, name: 'Papaya' },
    { id: 20, name: 'Lychee' },
  ],
  searchTerm: '',
  isLoading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
};

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
});

export const { setSearchTerm, setCurrentPage } = itemsSlice.actions;
export default itemsSlice.reducer;
