import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchItems } from "./features/itemsSlice";
import ItemList from "./components/ItemList";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchItems());
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      
      <ItemList />
    </div>
  );
};

export default App;
