import { Routes, Route } from "react-router-dom";
import FnceExpenses from "../pages/finance/FnceExpenses";
import Processing from "../pages/finance/Processing";
import Released from "../pages/finance/Released";
import Verify from "../pages/finance/Verify";
import Verified from "../pages/finance/Verified";
import BudgetAllocation from "../pages/admin/BudgetAllocation";
import RevolvingFund from "../pages/finance/RevolvingFund";
import CashDisbursement from "../pages/finance/CashDisbursement";
import History from "../pages/finance/History";
import MyExpenses from "../pages/employee/MyExpenses";
import EmpLiquidation from "../pages/employee/EmpLiquidation";
import ViewCashRequestForm from "../components/ViewCashRequestForm";
import Expenses from "../pages/team-leader/Expenses";
import Approval from "../pages/team-leader/Approval";
import Reject from "../pages/team-leader/Reject";
import FinalApproval from "../pages/admin/FinalApproval";
import AllRequest from "../pages/admin/AllRequest";
import AdmExpenses from "../pages/admin/AdmExpenses";
import CashApprovalForm from "../components/layout/team-leader/cash-request/CashApprovalForm";
import LiquidApprovalForm from "../components/layout/team-leader/liquidation/LiquidApprovalForm";
import Liquidation from "../pages/team-leader/Liquidation";
import TLHistory from "../pages/team-leader/TLHistory";

const FinanceRoutes = () => {
  return (
    <Routes>
      {/* EMEPLOYEE */}
      <Route path="/employee_requests" element={<MyExpenses />} />
      <Route path="/employee_liquidation" element={<EmpLiquidation />} />
      <Route path="/cash_form" element={<ViewCashRequestForm />} />

      {/* TEAM LEADER */}
      <Route path="/teamlead_pendings" element={<Expenses />} />
      <Route path="/my_approvals" element={<Approval />} />
      <Route path="/rejected_requests" element={<Reject />} />
      <Route path="/approval_form" element={<CashApprovalForm />} />
      <Route path="/liquidation_form" element={<LiquidApprovalForm />} />
      <Route path="/liquidation_note" element={<Liquidation />} />
      <Route path="/lead_history" element={<TLHistory />} />

      {/* FINANCE */}
      <Route path="/finance_dashboard" element={<FnceExpenses />} />
      <Route path="/finance_processing" element={<Processing />} />
      <Route path="/finance_released" element={<Released />} />
      <Route path="/finance_verify" element={<Verify />} />
      <Route path="/finance_verified" element={<Verified />} />
      <Route path="/budget_allocation" element={<BudgetAllocation />} />
      <Route path="/revolving_fund" element={<RevolvingFund />} />
      <Route path="/cash_disbursement" element={<CashDisbursement />} />
      <Route path="/finance_history" element={<History />} />

      {/* ADMIN */}
      <Route path="/admin_dashboard" element={<AdmExpenses />} />
      <Route path="/final_approval" element={<FinalApproval />} />
      <Route path="/all_request" element={<AllRequest />} />
    </Routes>
  );
};

export default FinanceRoutes;
