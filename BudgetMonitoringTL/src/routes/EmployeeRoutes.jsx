import { Routes, Route } from "react-router-dom";
import MyExpenses from "../pages/employee/MyExpenses";
import EmpArchive from "../pages/employee/EmpArchive";
import EmpImportant from "../pages/employee/EmpImportant";
import EmpTrash from "../pages/employee/EmpTrash";
import ViewCashRequestForm from "../components/ViewCashRequestForm";
import EmpLiquidation from "../pages/employee/EmpLiquidation";

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MyExpenses />} />
      <Route path="/employee-liquidation" element={<EmpLiquidation />} />
      <Route path="/employee-archive" element={<EmpArchive />} />
      <Route path="/employee-important" element={<EmpImportant />} />
      <Route path="/employee-trash" element={<EmpTrash />} />
      <Route path="/cash-form" element={<ViewCashRequestForm />} />
    </Routes>
  );
};

export default EmployeeRoutes;
