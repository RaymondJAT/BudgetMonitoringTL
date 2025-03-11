import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ApprovalForm from "./components/ApprovalForm";

function App() {
  const requestData = {
    employee: "John Doe",
    position: "IT Field Associate",
    department: "IT",
    paidBy: "Employee (To reimburse)",
    category: "Business trip",
    expenseDate: "03/07/2025",
    total: "500.00",
    teamLead: "Jane Smith",
    description: "Trip to Hong Kong to meet Mickey Mouse.",
    amountInWords: "Five Hundred Pesos Only",
  };

  return (
    <>
      <ApprovalForm data={requestData} />
    </>
  );
}

export default App;
