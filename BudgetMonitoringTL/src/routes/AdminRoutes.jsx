import { Routes, Route } from "react-router-dom";
import AdmExpenses from "../pages/admin/AdmExpenses";
import AdmArchive from "../pages/admin/AdmArchive";
import AdmImportant from "../pages/admin/AdmImportant";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdmExpenses />} />

      <Route path="/admin-archive" element={<AdmArchive />} />
      <Route path="/admin-important" element={<AdmImportant />} />
    </Routes>
  );
};

export default AdminRoutes;
