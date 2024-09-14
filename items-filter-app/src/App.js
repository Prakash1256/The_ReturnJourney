import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import ItemList from "./components/ItemList";

const App = () => {
  const dispatch = useDispatch();

  return (
    <div>
    <ItemList />
    </div>
  );
};

export default App;
