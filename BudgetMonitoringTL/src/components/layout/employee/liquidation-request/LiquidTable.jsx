import { FiTrash2 } from "react-icons/fi";
import { Table, Form } from "react-bootstrap";
import AppButton from "../../../ui/AppButton";

const LiquidTable = ({ tableRows, onRowChange, onAddRow, onRemoveRow }) => {
  return (
    <div className="request-table-wrapper border">
      <Table size="sm" className="request-table">
        <thead className="table-light small-input">
          <tr className="text-center">
            <th className="text-center">Date</th>
            <th className="text-center">RT#</th>
            <th className="text-center">Store Name</th>
            <th className="text-center">Particulars</th>
            <th className="text-center">From</th>
            <th className="text-center">To</th>
            <th className="text-center">Mode of Transportation</th>
            <th className="text-center">Amount</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              {/* DATE */}
              <td className="text-center p-1">
                <Form.Control
                  type="date"
                  value={row.date}
                  onChange={(e) => onRowChange(index, "date", e.target.value)}
                  className="form-control-sm small-input mx-auto"
                  style={{ width: "105px" }}
                />
              </td>

              {/* RT */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  value={row.rt}
                  onChange={(e) => onRowChange(index, "rt", e.target.value)}
                  className="form-control-sm small-input mx-auto"
                  style={{ width: "60px" }}
                />
              </td>

              {/* STORE NAME */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  value={row.store_name}
                  onChange={(e) =>
                    onRowChange(index, "store_name", e.target.value)
                  }
                  className="form-control-sm small-input mx-auto"
                />
              </td>

              {/* PARTICULARS */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  value={row.particulars}
                  onChange={(e) =>
                    onRowChange(index, "particulars", e.target.value)
                  }
                  className="form-control-sm small-input mx-auto"
                />
              </td>

              {/* FROM */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  value={row.from}
                  onChange={(e) => onRowChange(index, "from", e.target.value)}
                  className="form-control-sm small-input mx-auto"
                  style={{ width: "80px" }}
                />
              </td>

              {/* TO */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  value={row.to}
                  onChange={(e) => onRowChange(index, "to", e.target.value)}
                  className="form-control-sm small-input mx-auto"
                  style={{ width: "80px" }}
                />
              </td>

              {/* TRANSPORTATION */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  value={row.mode_of_transportation}
                  onChange={(e) =>
                    onRowChange(index, "mode_of_transportation", e.target.value)
                  }
                  className="form-control-sm small-input mx-auto"
                />
              </td>

              {/* AMOUNT */}
              <td className="text-center p-1">
                <Form.Control
                  type="number"
                  min={0}
                  value={row.amount}
                  onChange={(e) => onRowChange(index, "amount", e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      ["e", "E", "+", "-"].includes(e.key) ||
                      (e.ctrlKey && e.key === "v")
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="form-control-sm small-input mx-auto"
                  style={{ width: "65px" }}
                />
              </td>

              {/* REMOVE */}
              <td className="text-center p-1">
                <AppButton
                  label={<FiTrash2 className="trash-icon" />}
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onRemoveRow(index)}
                  className="custom-app-button mx-auto"
                  disabled={tableRows.length === 1}
                />
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan="9" className="text-center p-1">
              <AppButton
                label="+"
                variant="outline-dark"
                size="sm"
                onClick={onAddRow}
                className="add-circle-btn mx-auto"
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default LiquidTable;
