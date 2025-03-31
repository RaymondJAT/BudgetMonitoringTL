import React, { createContext, useContext, useState } from "react";

const TrashContext = createContext();

export const TrashProvider = ({ children }) => {
  const [trash, setTrash] = useState([]);

  const addToTrash = (item) => {
    setTrash((prev) => [...prev, item]);
  };

  const restoreFromTrash = (itemId) => {
    setTrash((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearTrash = () => {
    setTrash([]);
  };

  return (
    <TrashContext.Provider
      value={{ trash, addToTrash, restoreFromTrash, clearTrash }}
    >
      {children}
    </TrashContext.Provider>
  );
};

export const useTrash = () => {
  return useContext(TrashContext);
};
