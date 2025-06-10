import { Routes, Route } from "react-router-dom";
import MyExpenses from "../pages/employee/MyExpenses";

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/my-expenses" element={<MyExpenses />} />
    </Routes>
  );
};

export default EmployeeRoutes;
