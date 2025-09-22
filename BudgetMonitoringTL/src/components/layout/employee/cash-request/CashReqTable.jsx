import { Table, Form } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import AppButton from "../../../ui/buttons/AppButton";

const CashReqTable = ({ amount, onAmountChange, onClear }) => {
  const formatPeso = (num, withCents = false) => {
    if (num === "" || isNaN(num)) return "";
    return (
      "₱" +
      Number(num).toLocaleString("en-PH", {
        minimumFractionDigits: withCents ? 2 : 0,
        maximumFractionDigits: 2,
      })
    );
  };

  const handleChange = (e) => {
    let raw = e.target.value.replace(/[^0-9.]/g, "");
    const parts = raw.split(".");

    if (parts.length > 2) {
      raw = parts[0] + "." + parts[1];
    }

    if (raw === "" || raw === ".") {
      onAmountChange("");
    } else {
      onAmountChange(raw);
    }
  };

  const handleBlur = () => {
    if (amount !== "" && !isNaN(amount)) {
      onAmountChange(parseFloat(amount).toFixed(2));
    }
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
            <td>
              <Form.Control
                type="text"
                value={
                  amount === ""
                    ? ""
                    : formatPeso(
                        amount,
                        document.activeElement !== null &&
                          document.activeElement.tagName === "INPUT"
                          ? false
                          : true
                      )
                }
                onChange={handleChange}
                onBlur={handleBlur}
                size="sm"
                className="small-input text-center"
                placeholder="₱0.00"
              />
            </td>
            <td>
              {amount === "" || isNaN(amount)
                ? "₱0.00"
                : formatPeso(amount, true)}
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
