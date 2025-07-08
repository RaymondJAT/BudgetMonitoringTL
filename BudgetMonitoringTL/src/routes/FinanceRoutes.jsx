import { Routes, Route } from "react-router-dom";
import FnceExpenses from "../pages/finance/FnceExpenses";
import Processing from "../pages/finance/Processing";

const FinanceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FnceExpenses />} />
      <Route path="/finance-processing" element={<Processing />} />
    </Routes>
  );
};

export default FinanceRoutes;
