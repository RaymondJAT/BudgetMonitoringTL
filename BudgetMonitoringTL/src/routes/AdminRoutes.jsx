import { Routes, Route } from "react-router-dom";
import AdmExpenses from "../pages/admin/AdmExpenses";
import AdmArchive from "../pages/admin/AdmArchive";
import AdmImportant from "../pages/admin/AdmImportant";
import AdmTrash from "../pages/admin/AdmTrash";
import FinalApproval from "../pages/admin/FinalApproval";
import AllRequest from "../pages/admin/AllRequest";
import BudgetAllocation from "../pages/admin/BudgetAllocation";
import BudgetReport from "../pages/admin/BudgetReport";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdmExpenses />} />
      <Route path="/final-approval" element={<FinalApproval />} />
      <Route path="/all-request" element={<AllRequest />} />
      <Route path="/budget-allocation" element={<BudgetAllocation />} />
      <Route path="/budget-report" element={<BudgetReport />} />

      <Route path="/admin-archive" element={<AdmArchive />} />
      <Route path="/admin-important" element={<AdmImportant />} />
      <Route path="/admin-trash" element={<AdmTrash />} />
    </Routes>
  );
};

export default AdminRoutes;
