import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { numberToWords } from "../../../../utils/numberToWords";
import { cashReqFields } from "../../../../handlers/columnHeaders";
import RequestForm from "../cash-request/RequestForm";
import CashReqTable from "./CashReqTable";

const CashReqForm = ({ data = {}, onChange = () => {} }) => {
  const today = new Date().toISOString().split("T")[0];
  const loggedInUser = localStorage.getItem("employee_fullname") || "";
  const employeeId = localStorage.getItem("employee_id") || "";
  const departmentName = localStorage.getItem("department_name") || "";
  const positionName = localStorage.getItem("position_name") || "";

  // SINGLE AMOUNT
  const [amount, setAmount] = useState(
    data.amount ? parseFloat(data.amount) : ""
  );

  const amountInWords = amount ? numberToWords(amount) : "Zero Pesos Only";

  // FORM DATA
  const [formData, setFormData] = useState({
    employee_id: employeeId,
    employee: loggedInUser,
    requested_by: loggedInUser,
    department: departmentName,
    position: positionName,
    request_date: data.request_date?.split("T")[0] || today,
    team_lead: data.team_lead || "",
    description: data.description || "",
    remarks: data.remarks || "",
  });

  useEffect(() => {
    const mapped = {
      description: formData.description || "",
      team_lead: formData.team_lead || "",
      employee: formData.employee || "",
      employee_id: formData.employee_id || "",
      department: formData.department || "",
      position: formData.position || "",
      amount,
      remarks: formData.remarks || "",
      requested_by: formData.requested_by || "",
    };

    onChange(mapped);
  }, [formData, amount, onChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearAmount = () => setAmount("");

  return (
    <Container fluid>
      <RequestForm
        fields={cashReqFields}
        formData={formData}
        onChange={handleInputChange}
        amountInWords={amountInWords}
      />

      <CashReqTable
        amount={amount}
        onAmountChange={setAmount}
        onClear={handleClearAmount}
      />
    </Container>
  );
};

export default CashReqForm;
