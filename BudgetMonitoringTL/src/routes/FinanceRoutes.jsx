import { Routes, Route } from "react-router-dom";
import FnceExpenses from "../pages/finance/FnceExpenses";
import Processing from "../pages/finance/Processing";
import Released from "../pages/finance/Released";
import Verify from "../pages/finance/Verify";
import Verified from "../pages/finance/Verified";
import BudgetAllocation from "../pages/admin/BudgetAllocation";
import RevolvingFund from "../pages/finance/RevolvingFund";
import CashDisbursement from "../pages/finance/CashDisbursement";
import FnceArchive from "../pages/finance/FnceArchive";
import FnceImportant from "../pages/finance/FnceImportant";
import FnceTrash from "../pages/finance/FnceTrash";

const FinanceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FnceExpenses />} />
      <Route path="/finance-processing" element={<Processing />} />
      <Route path="/finance-released" element={<Released />} />
      <Route path="/finance-verify" element={<Verify />} />
      <Route path="/finance-verified" element={<Verified />} />
      <Route path="/budget-allocation" element={<BudgetAllocation />} />
      <Route path="/revolving-fund" element={<RevolvingFund />} />
      <Route path="/cash-disbursement" element={<CashDisbursement />} />
      <Route path="/finance-archive" element={<FnceArchive />} />
      <Route path="/finance-important" element={<FnceImportant />} />
      <Route path="/finance-trash" element={<FnceTrash />} />
    </Routes>
  );
};

export default FinanceRoutes;
