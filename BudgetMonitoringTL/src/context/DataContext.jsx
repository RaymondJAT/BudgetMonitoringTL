import React, { createContext, useState, useEffect } from "react";
import { mockData } from "../mock-data/mockData"; // Import initial data

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Shared state for transactions
  const [data, setData] = useState(() => {
    // Load from localStorage to persist state across refresh
    const savedData = localStorage.getItem("transactions");
    return savedData ? JSON.parse(savedData) : mockData;
  });

  // Effect to store data in localStorage when updated
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(data));
  }, [data]);

  // Function to approve a pending transaction
  const approveTransaction = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: "Approved" } : item
      )
    );
  };

  // Function to delete a transaction
  const deleteTransaction = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  // Get the total amount for a given status
  const getTotalAmountByStatus = (status) => {
    return data
      .filter((row) => row.status === status)
      .reduce((sum, row) => sum + row.amount, 0); // Assuming `amount` exists
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        approveTransaction,
        deleteTransaction,
        getTotalAmountByStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
