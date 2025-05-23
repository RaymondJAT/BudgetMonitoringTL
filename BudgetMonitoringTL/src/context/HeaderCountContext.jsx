import { createContext, useState, useEffect } from "react";
import { mockData } from "../mock-data/mockData";

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const [expensesData, setExpensesData] = useState([]);
  const [totals, setTotals] = useState({ pending: 0, approved: 0, post: 0 });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("expensesData")) || [];
    setExpensesData(storedData);

    const getTotalAmountByStatus = (status) => {
      return storedData
        .filter((row) => row.status === status)
        .reduce((sum, row) => {
          const transaction =
            mockData.find((emp) => emp.employee === row.employee)
              ?.transactions || [];
          return (
            sum +
            transaction.reduce(
              (total, item) => total + item.quantity * item.price,
              0
            )
          );
        }, 0);
    };

    setTotals({
      pending: getTotalAmountByStatus("Pending"),
      approved: getTotalAmountByStatus("Approved"),
      post: getTotalAmountByStatus("Post"),
    });
  }, []);

  return (
    <ExpensesContext.Provider value={{ expensesData, totals }}>
      {children}
    </ExpensesContext.Provider>
  );
};
