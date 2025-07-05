import { Routes, Route } from "react-router-dom";
import Expenses from "../pages/team-leader/Expenses";
import Approval from "../pages/team-leader/Approval";
import Reject from "../pages/team-leader/Reject";
import Archive from "../pages/team-leader/Archive";
import Trash from "../pages/team-leader/Trash";
import Important from "../pages/team-leader/Important";
import CashApprovalForm from "../components/layout/team-leader/cash-request/CashApprovalForm";
import LiquidApprovalForm from "../components/layout/team-leader/liquidation/LiquidApprovalForm";
import Liquidation from "../pages/team-leader/Liquidation";
import History from "../pages/team-leader/History";

const TeamLeadRoutes = () => (
  <Routes>
    <Route path="/" element={<Expenses />} />
    <Route path="/my-approvals" element={<Approval />} />
    <Route path="/rejected-requests" element={<Reject />} />
    <Route path="/archive" element={<Archive />} />
    <Route path="/important" element={<Important />} />
    <Route path="/trash" element={<Trash />} />
    <Route path="/approval-form" element={<CashApprovalForm />} />
    <Route path="/liquidation-form" element={<LiquidApprovalForm />} />
    <Route path="/liquidation-note" element={<Liquidation />} />
    <Route path="/lead-history" element={<History />} />
  </Routes>
);

export default TeamLeadRoutes;
