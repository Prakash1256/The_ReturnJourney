import React, { useCallback, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage, setSearchTerm } from "../features/itemsSlice";

// Memoized Search Input component
const SearchBar = memo(({ searchTerm, handleSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search items..."
      value={searchTerm}
      onChange={handleSearch}
      className="search-bar"
      aria-label="Search items"
    />
  );
});

// Memoized Item List component
const ItemListDisplay = memo(({ paginatedItems }) => {
  return (
    <ul className="item-list">
      {paginatedItems.length > 0 ? (
        paginatedItems.map((item) => <li key={item.id}>{item.name}</li>)
      ) : (
        <li style={{ fontWeight: "bold" }}>
          Item is not present, search another item 😊..
        </li>
      )}
    </ul>
  );
});

// Memoized Pagination Controls
const PaginationControls = memo(
  ({ currentPage, totalPages, handlePageChange }) => {
    return (
      <div className="pagination-controls">
        <button
          className={`pagination-button ${
            currentPage === 1 ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Previous
        </button>

        <span className="pagination-page-number">{currentPage}</span>

        <button
          className={`pagination-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    );
  }
);

const ItemList = () => {
  // Extract state from Redux store
  const items = useSelector((state) => state.items.items);
  const searchTerm = useSelector((state) => state.items.searchTerm);
  const isLoading = useSelector((state) => state.items.isLoading);
  const error = useSelector((state) => state.items.error);
  const currentPage = useSelector((state) => state.items.currentPage);
  const itemsPerPage = useSelector((state) => state.items.itemsPerPage);

  const dispatch = useDispatch();

  // Filter and paginate items
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  // Reset page number when search term changes
  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [searchTerm, dispatch]);

  // Update search term but ignore space key
  const handleSearch = useCallback(
    (e) => {
      const input = e.target.value;
      if (e.nativeEvent.data === " ") {
        // Prevent search operation if space key is pressed
        e.preventDefault();
        return;
      }
      dispatch(setSearchTerm(input));
    },
    [dispatch]
  );

  return (
    <div className="item-list-container">
      <h1 className="title">ItemList</h1>

      {/* Memoized Search Bar */}
      <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          {/* Memoized Item List */}
          <ItemListDisplay paginatedItems={paginatedItems} />

          {/* Memoized Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ItemList;
