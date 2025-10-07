import { useState } from "react";
import { Table, Form } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import AppButton from "../../../ui/buttons/AppButton";

const CashReqTable = ({ amount, onAmountChange, onClear }) => {
  const [focused, setFocused] = useState(false);

  const formatPeso = (val) => {
    if (val === "" || val == null || isNaN(val)) return "";
    return (
      "₱" +
      Number(val).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

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
            {/* AMOUNT INPUT */}
            <td>
              <Form.Control
                type="text"
                placeholder="₱0.00"
                value={
                  focused
                    ? amount ?? ""
                    : amount != null && amount !== ""
                    ? formatPeso(amount)
                    : ""
                }
                onChange={(e) => {
                  let raw = e.target.value.replace(/[^0-9.]/g, "");
                  const parts = raw.split(".");
                  if (parts.length > 2) raw = parts[0] + "." + parts[1];
                  onAmountChange(raw === "" ? "" : raw);
                }}
                onBlur={() => {
                  if (amount !== "" && !isNaN(amount)) {
                    onAmountChange(parseFloat(amount));
                  }
                  setFocused(false);
                }}
                onFocus={() => setFocused(true)}
                size="sm"
                className="small-input text-center"
              />
            </td>

            {/* TOTAL */}
            <td>
              {amount === "" || isNaN(amount) ? "₱0.00" : formatPeso(amount)}
            </td>

            {/* REMOVE */}
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
