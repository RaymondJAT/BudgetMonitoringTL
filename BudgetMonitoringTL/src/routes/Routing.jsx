import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// EMPLOYEE
import MyExpenses from "../pages/employee/MyExpenses";
import EmpLiquidation from "../pages/employee/EmpLiquidation";
import ViewCashRequestForm from "../components/ViewCashRequestForm";
import ViewLiquidationForm from "../components/ViewLiquidationForm";

// TEAM LEADER
import Expenses from "../pages/team-leader/Expenses";
import Approval from "../pages/team-leader/Approval";
import Reject from "../pages/team-leader/Reject";
import CashApprovalForm from "../components/layout/team-leader/cash-request/CashApprovalForm";
import LiquidApprovalForm from "../components/layout/team-leader/liquidation/LiquidApprovalForm";
import Liquidation from "../pages/team-leader/Liquidation";
import TLHistory from "../pages/team-leader/TLHistory";
import Reviewed from "../pages/team-leader/Reviewed";
import RejectLiquidation from "../pages/team-leader/RejectLiquidation";

// FINANCE
import FnceExpenses from "../pages/finance/FnceExpenses";
import Processing from "../pages/finance/Processing";
import Released from "../pages/finance/Released";
import Verify from "../pages/finance/Verify";
import Verified from "../pages/finance/Verified";
import RejectedRequest from "../pages/finance/RejectedRequest";
import FinanceLiquidForm from "../components/layout/finance/liquidation/FinanceLiquidForm";
import FinanceApprovalForm from "../components/layout/finance/cash-request/FinanceApprovalForm";
import BudgetAllocation from "../pages/admin/BudgetAllocation";
import RevolvingFund from "../pages/finance/RevolvingFund";
import CashDisbursement from "../pages/finance/CashDisbursement";
import History from "../pages/finance/History";
import RejectedLiquidation from "../pages/finance/RejectedLiquidation";

// ADMIN
import FinalApproval from "../pages/admin/FinalApproval";
import AllRequest from "../pages/admin/AllRequest";
import Users from "../pages/admin/Users";
import Access from "../pages/admin/Access";
import LiquidationForm from "../components/layout/common/LiquidationForm";
import AdminLiquidForm from "../components/layout/admin/AdminLiquidForm";
import CompletedLiquidation from "../pages/admin/CompletedLiquidation";

export const routeConfig = [
  // EMPLOYEE
  { path: "/employee_request", element: <MyExpenses /> },
  { path: "/employee_liquidation", element: <EmpLiquidation /> },
  { path: "/view_cash_request", element: <ViewCashRequestForm /> },
  { path: "/view_liquidation_form", element: <ViewLiquidationForm /> },

  // TEAM LEADER
  { path: "/teamlead_pendings", element: <Expenses /> },
  { path: "/my_approvals", element: <Approval /> },
  { path: "/rejected_requests", element: <Reject /> },
  { path: "/liquidation_review", element: <Liquidation /> },
  { path: "/liquidation_reviewed", element: <Reviewed /> },
  { path: "/reject_liquidations", element: <RejectLiquidation /> },
  { path: "/lead_history", element: <TLHistory /> },
  { path: "/cash_approval_form", element: <CashApprovalForm /> },
  { path: "/liquid_approval_form", element: <LiquidApprovalForm /> },

  // FINANCE
  { path: "/finance_dashboard", element: <FnceExpenses /> },
  { path: "/finance_processing", element: <Processing /> },
  { path: "/finance_released", element: <Released /> },
  { path: "/finance_rejected", element: <RejectedRequest /> },
  { path: "/finance_verify", element: <Verify /> },
  { path: "/finance_verified", element: <Verified /> },
  { path: "/finance_rejected_liquidations", element: <RejectedLiquidation /> },
  { path: "/finance_liquid_form", element: <FinanceLiquidForm /> },
  { path: "/finance_approval_form", element: <FinanceApprovalForm /> },
  { path: "/budget_allocation", element: <BudgetAllocation /> },
  { path: "/revolving_fund", element: <RevolvingFund /> },
  { path: "/cash_disbursement", element: <CashDisbursement /> },
  { path: "/finance_history", element: <History /> },

  // ADMIN
  { path: "/final_approval", element: <FinalApproval /> },
  { path: "/all_request", element: <AllRequest /> },
  { path: "/users", element: <Users /> },
  { path: "/access", element: <Access /> },
  { path: "/liquidation_form", element: <LiquidationForm /> },
  { path: "/admin_liquid_form", element: <AdminLiquidForm /> },
  { path: "/completed_liquidations", element: <CompletedLiquidation /> },
];

const Routing = () => {
  return (
    <Routes>
      {routeConfig.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute path={path}>{element}</ProtectedRoute>}
        />
      ))}
    </Routes>
  );
};

export default Routing;
