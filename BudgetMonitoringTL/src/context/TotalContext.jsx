import { createContext, useState } from "react";

export const TotalContext = createContext();

export const TotalProvider = ({ children }) => {
  const [data, setData] = useState([]);

  const addItem = (item) => {
    setData((prev) => [...prev, item]);
  };

  const deleteItem = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (updatedItem) => {
    setData((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  return (
    <TotalContext.Provider
      value={{ data, setData, addItem, deleteItem, updateItem }}
    >
      {children}
    </TotalContext.Provider>
  );
};
