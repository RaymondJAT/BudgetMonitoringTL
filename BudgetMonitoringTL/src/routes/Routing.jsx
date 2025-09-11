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

// FINANCE
import FnceExpenses from "../pages/finance/FnceExpenses";
import Processing from "../pages/finance/Processing";
import Released from "../pages/finance/Released";
import Verify from "../pages/finance/Verify";
import Verified from "../pages/finance/Verified";
import BudgetAllocation from "../pages/admin/BudgetAllocation";
import RevolvingFund from "../pages/finance/RevolvingFund";
import CashDisbursement from "../pages/finance/CashDisbursement";
import History from "../pages/finance/History";
import FinanceApprovalForm from "../components/layout/finance/cash-request/FinanceApprovalForm";
import RejectedRequest from "../pages/finance/RejectedRequest";
import FinanceLiquidForm from "../components/layout/finance/liquidation/FinanceLiquidForm";

// ADMIN
import AdmExpenses from "../pages/admin/AdmExpenses";
import FinalApproval from "../pages/admin/FinalApproval";
import AllRequest from "../pages/admin/AllRequest";
import Users from "../pages/admin/Users";
import Access from "../pages/admin/Access";
import LiquidationForm from "../components/layout/common/LiquidationForm";

const Routing = () => {
  return (
    <Routes>
      {/* EMPLOYEE */}
      <Route
        path="/employee_request"
        element={
          <ProtectedRoute path="/employee_request">
            <MyExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee_liquidation"
        element={
          <ProtectedRoute path="/employee_liquidation">
            <EmpLiquidation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view_cash_request"
        element={
          <ProtectedRoute path="/view_cash_request">
            <ViewCashRequestForm />
          </ProtectedRoute>
        }
      />

      {/* <Route
        path="/view_liquidation_form"
        element={
          <ProtectedRoute path="/view_liquidation_form">
            <ViewLiquidationForm />
          </ProtectedRoute>
        }
      /> */}

      <Route path="/view_liquidation_form" element={<ViewLiquidationForm />} />

      {/* TEAM LEADER */}
      <Route
        path="/teamlead_pendings"
        element={
          <ProtectedRoute path="/teamlead_pendings">
            <Expenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my_approvals"
        element={
          <ProtectedRoute path="/my_approvals">
            <Approval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rejected_requests"
        element={
          <ProtectedRoute path="/rejected_requests">
            <Reject />
          </ProtectedRoute>
        }
      />

      {/* <Route
        path="/liquid_approval_form"
        element={
          <ProtectedRoute path="/liquid_approval_form">
            <LiquidApprovalForm />
          </ProtectedRoute>
        }
      /> */}

      <Route path="/liquid_approval_form" element={<LiquidApprovalForm />} />

      <Route
        path="/liquidation_review"
        element={
          <ProtectedRoute path="/liquidation_review">
            <Liquidation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lead_history"
        element={
          <ProtectedRoute path="/lead_history">
            <TLHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cash_approval_form"
        element={
          <ProtectedRoute path="/cash_approval_form">
            <CashApprovalForm />
          </ProtectedRoute>
        }
      />

      {/* FINANCE */}
      <Route
        path="/finance_dashboard"
        element={
          <ProtectedRoute path="/finance_dashboard">
            <FnceExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance_processing"
        element={
          <ProtectedRoute path="/finance_processing">
            <Processing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance_released"
        element={
          <ProtectedRoute path="/finance_released">
            <Released />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance_rejected"
        element={
          <ProtectedRoute path="/finance_rejected">
            <RejectedRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance_verify"
        element={
          <ProtectedRoute path="/finance_verify">
            <Verify />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance_verified"
        element={
          <ProtectedRoute path="/finance_verified">
            <Verified />
          </ProtectedRoute>
        }
      />
      <Route
        path="/budget_allocation"
        element={
          <ProtectedRoute path="/budget_allocation">
            <BudgetAllocation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revolving_fund"
        element={
          <ProtectedRoute path="/revolving_fund">
            <RevolvingFund />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cash_disbursement"
        element={
          <ProtectedRoute path="/cash_disbursement">
            <CashDisbursement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance_history"
        element={
          <ProtectedRoute path="/finance_history">
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance_approval_form"
        element={
          <ProtectedRoute path="/finance_approval_form">
            <FinanceApprovalForm />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin_dashboard"
        element={
          <ProtectedRoute path="/admin_dashboard">
            <AdmExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/final_approval"
        element={
          <ProtectedRoute path="/final_approval">
            <FinalApproval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all_request"
        element={
          <ProtectedRoute path="/all_request">
            <AllRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute path="/users">
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/access"
        element={
          <ProtectedRoute path="/access">
            <Access />
          </ProtectedRoute>
        }
      />

      <Route path="/finance_liquid_form" element={<FinanceLiquidForm />} />
      <Route path="/liquidation_form" element={<LiquidationForm />} />
    </Routes>
  );
};

export default Routing;
