import { Routes, Route } from "react-router-dom";
import Expenses from "../pages/team-leader/Expenses";
import Approval from "../pages/team-leader/Approval";
import Reject from "../pages/team-leader/Reject";
import Archive from "../pages/team-leader/Archive";
import Trash from "../pages/team-leader/Trash";
import Important from "../pages/team-leader/Important";
import ApprovalForm from "../components/layout/ApprovalForm";

const TeamLeadRoutes = () => (
  <Routes>
    <Route path="/" element={<Expenses />} />
    <Route path="/my-approvals" element={<Approval />} />
    <Route path="/rejected-requests" element={<Reject />} />
    <Route path="/archive" element={<Archive />} />
    <Route path="/important" element={<Important />} />
    <Route path="/trash" element={<Trash />} />
    <Route path="/approval-form" element={<ApprovalForm />} />
  </Routes>
);

export default TeamLeadRoutes;
