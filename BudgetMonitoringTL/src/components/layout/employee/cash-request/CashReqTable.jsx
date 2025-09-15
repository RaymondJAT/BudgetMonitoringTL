import { Table, Form } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import AppButton from "../../../ui/AppButton";

const CashReqTable = ({ amount, onAmountChange, onClear }) => {
  const numericAmount = parseFloat(amount) || 0;

  return (
    <div className="request-table-wrapper">
      <Table className="request-table">
        <thead className="tableHead text-center">
          <tr>
            <th>Amount</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="tableBody text-center">
          <tr>
            <td>
              <Form.Control
                type="number"
                min="0"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    ["e", "E", "+", "-"].includes(e.key) ||
                    (e.ctrlKey && e.key === "v")
                  ) {
                    e.preventDefault();
                  }
                }}
                size="sm"
                className="small-input"
              />
            </td>
            <td>
              ₱
              {numericAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </td>
            <td>
              <AppButton
                label={<FiTrash2 className="trash-icon" />}
                variant="outline-danger"
                size="sm"
                onClick={onClear}
                className="custom-app-button text-center"
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default CashReqTable;
