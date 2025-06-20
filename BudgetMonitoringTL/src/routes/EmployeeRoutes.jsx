import { Routes, Route } from "react-router-dom";
import MyExpenses from "../pages/employee/MyExpenses";
import EmpArchive from "../pages/employee/EmpArchive";
import EmpImportant from "../pages/employee/EmpImportant";
import EmpTrash from "../pages/employee/EmpTrash";

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MyExpenses />} />
      <Route path="/employee-archive" element={<EmpArchive />} />
      <Route path="/employee-important" element={<EmpImportant />} />
      <Route path="/employee-trash" element={<EmpTrash />} />
    </Routes>
  );
};

export default EmployeeRoutes;
