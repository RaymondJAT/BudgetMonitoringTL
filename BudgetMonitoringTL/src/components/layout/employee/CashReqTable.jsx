import { Table, Form } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import AppButton from "../../ui/AppButton";

const CashReqTable = ({ rows, onRowChange, onAddRow, onRemoveRow }) => {
  const total = rows.reduce((sum, row) => {
    const price = parseFloat(row.price) || 0;
    const quantity = parseFloat(row.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  return (
    <div className="request-table-wrapper">
      <Table className="request-table">
        <thead className="tableHead text-center">
          <tr>
            <th>Label</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="tableBody text-center">
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  value={row.label}
                  onChange={(e) => onRowChange(index, "label", e.target.value)}
                  size="sm"
                  className="small-input"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  min="0"
                  value={row.price}
                  onChange={(e) => onRowChange(index, "price", e.target.value)}
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
                <Form.Control
                  type="number"
                  min="0"
                  value={row.quantity}
                  onChange={(e) =>
                    onRowChange(index, "quantity", e.target.value)
                  }
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
                {(
                  parseFloat(row.quantity || 0) * parseFloat(row.price || 0)
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td>
                <AppButton
                  label={<FiTrash2 className="trash-icon" />}
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onRemoveRow(index)}
                  className="custom-app-button text-center"
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              <strong>Total:</strong>
            </td>
            <td className="text-center">
              <strong>
                ₱
                {total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </td>
            <td />
          </tr>
        </tfoot>
      </Table>

      <div className="d-flex justify-content-center mt-4 mb-3">
        <AppButton
          label="+"
          onClick={onAddRow}
          variant="outline-dark"
          size="sm"
          className="add-circle-btn"
        />
      </div>
    </div>
  );
};

export default CashReqTable;
