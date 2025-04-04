import React, { createContext, useContext, useState } from "react";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [file, setFile] = useState([]);

  const addToFile = (item) => {
    setFile((prev) => [...prev, item]);
  };

  const restoreFromFile = (itemId) => {
    setFile((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearFile = () => {
    setFile([]);
  };

  return (
    <FileContext.Provider
      value={{ file, addToFile, restoreFromFile, clearFile }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  return useContext(FileContext);
};
