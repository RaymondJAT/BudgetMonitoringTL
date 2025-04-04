import React, { createContext, useContext, useEffect, useState } from "react";
import { mockData } from "../mock-data/mockData";

const HeaderCountContext = createContext();

export const HeaderCountProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("expensesData"));
    setData(storedData || mockData);
  }, []);

  const getEmployeeTransactions = (employeeName) => {
    return (
      mockData.find((emp) => emp.employee === employeeName)?.transactions || []
    );
  };

  const getTotalAmountByStatus = (status) => {
    return data
      .filter((row) => row.status === status)
      .reduce((sum, row) => {
        const transactions = getEmployeeTransactions(row.employee);
        return (
          sum +
          transactions.reduce(
            (total, item) => total + item.quantity * item.price,
            0
          )
        );
      }, 0);
  };

  return (
    <HeaderCountContext.Provider
      value={{
        pendingTotal: getTotalAmountByStatus("Pending"),
        approvedTotal: getTotalAmountByStatus("Approved"),
        postTotal: getTotalAmountByStatus("Post"),
        refreshData: () => {
          const storedData = JSON.parse(localStorage.getItem("expensesData"));
          setData(storedData || mockData);
        },
      }}
    >
      {children}
    </HeaderCountContext.Provider>
  );
};

export const useHeaderCount = () => useContext(HeaderCountContext);
