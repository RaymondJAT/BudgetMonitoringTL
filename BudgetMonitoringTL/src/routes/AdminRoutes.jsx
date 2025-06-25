import { Routes, Route } from "react-router-dom";
import AdmExpenses from "../pages/admin/AdmExpenses";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdmExpenses />} />
    </Routes>
  );
};

export default AdminRoutes;
