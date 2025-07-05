import { Routes, Route } from "react-router-dom";
import FnceExpenses from "../pages/finance/FnceExpenses";

const FinanceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FnceExpenses />} />
    </Routes>
  );
};

export default FinanceRoutes;
