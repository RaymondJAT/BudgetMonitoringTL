import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Table, Form } from "react-bootstrap";
import AppButton from "../../../ui/buttons/AppButton";

const LiquidTable = ({ tableRows, onRowChange, onAddRow, onRemoveRow }) => {
  const [focusedRowIndex, setFocusedRowIndex] = useState(null);
  const [firstRowData, setFirstRowData] = useState({
    date: "",
    rt: "",
    store_name: "",
    particulars: "",
  });

  const formatPeso = (val) =>
    "₱" +
    Number(val || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // TRACK FIRST ROW DATA
  useEffect(() => {
    if (tableRows.length > 0) {
      const firstCompleteRow = tableRows.find(
        (row) => row.date && row.rt && row.store_name && row.particulars
      );
      if (firstCompleteRow && !firstRowData.date) {
        setFirstRowData({
          date: firstCompleteRow.date,
          rt: firstCompleteRow.rt,
          store_name: firstCompleteRow.store_name,
          particulars: firstCompleteRow.particulars,
        });
      }
    }
  }, [tableRows, firstRowData]);

  const handleRowChange = (index, field, value) => {
    onRowChange(index, field, value);

    // UPDATE HIDDEN ROWS TO THE SAME GROUP
    if (["date", "rt", "store_name", "particulars"].includes(field)) {
      const baseRow = tableRows[index];
      // PROPAGATE WITHIN THE SAME GROUP
      for (let i = index + 1; i < tableRows.length; i++) {
        if (tableRows[i].isHiddenRow) {
          onRowChange(i, field, value);
        } else break;
      }
    }
  };

  const handleAddRow = (baseRow, isBottomAdd = false, clickedIndex = null) => {
    let newRow = {
      date: "",
      rt: "",
      store_name: "",
      particulars: "",
      from: "",
      to: "",
      mode_of_transportation: "",
      amount: "",
      isHiddenRow: false,
    };

    if (!isBottomAdd) {
      // INHERIT FROM CLICKED ROW
      const clickedBase = tableRows[clickedIndex];
      newRow = {
        ...newRow,
        date: clickedBase.date || "",
        rt: clickedBase.rt || "",
        store_name: clickedBase.store_name || "",
        particulars: clickedBase.particulars || "",
        isHiddenRow: true,
      };

      let insertAt = clickedIndex + 1;
      for (let i = clickedIndex + 1; i < tableRows.length; i++) {
        if (tableRows[i].isHiddenRow) insertAt = i + 1;
        else break;
      }
      onAddRow(newRow, insertAt);
    } else {
      onAddRow(newRow);
    }
  };

  const handleRemoveRow = (index) => onRemoveRow(index);

  return (
    <div className="request-table-wrapper border table-responsive-md">
      <Table size="sm" className="request-table align-middle d-none d-md-table">
        <thead className="table-light small-input">
          <tr className="text-center">
            <th>Date</th>
            <th>RT#</th>
            <th>Store Name</th>
            <th>Particulars</th>
            <th>From</th>
            <th>To</th>
            <th>Mode of Transportation</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              {/* DATE */}
              <td className="text-center p-1">
                {!row.isHiddenRow ? (
                  <Form.Control
                    type={row.date === "N/A" ? "text" : "date"}
                    value={row.date}
                    placeholder="N/A"
                    onChange={(e) =>
                      handleRowChange(index, "date", e.target.value)
                    }
                    className="form-control-sm mx-auto"
                    style={{ width: "105px" }}
                  />
                ) : (
                  <input type="hidden" value={row.date} />
                )}
              </td>

              {/* RT */}
              <td className="text-center p-1">
                {!row.isHiddenRow ? (
                  <Form.Control
                    type="text"
                    value={row.rt}
                    onChange={(e) =>
                      handleRowChange(index, "rt", e.target.value)
                    }
                    className="form-control-sm mx-auto"
                    style={{ width: "60px" }}
                  />
                ) : (
                  <input type="hidden" value={row.rt} />
                )}
              </td>

              {/* STORE NAME */}
              <td className="text-center p-1">
                {!row.isHiddenRow ? (
                  <Form.Control
                    type="text"
                    value={row.store_name}
                    onChange={(e) =>
                      handleRowChange(index, "store_name", e.target.value)
                    }
                    className="form-control-sm mx-auto"
                  />
                ) : (
                  <input type="hidden" value={row.store_name} />
                )}
              </td>

              {/* PARTICULARS */}
              <td className="text-center p-1">
                {!row.isHiddenRow ? (
                  <Form.Control
                    type="text"
                    value={row.particulars}
                    onChange={(e) =>
                      handleRowChange(index, "particulars", e.target.value)
                    }
                    className="form-control-sm mx-auto"
                  />
                ) : (
                  <input type="hidden" value={row.particulars} />
                )}
              </td>

              {/* FROM */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  value={row.from}
                  onChange={(e) =>
                    handleRowChange(index, "from", e.target.value)
                  }
                  className="form-control-sm mx-auto"
                  style={{ width: "80px" }}
                />
              </td>

              {/* TO */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  value={row.to}
                  onChange={(e) => handleRowChange(index, "to", e.target.value)}
                  className="form-control-sm mx-auto"
                  style={{ width: "80px" }}
                />
              </td>

              {/* TRANSPORTATION */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  value={row.mode_of_transportation}
                  onChange={(e) =>
                    handleRowChange(
                      index,
                      "mode_of_transportation",
                      e.target.value
                    )
                  }
                  className="form-control-sm mx-auto"
                />
              </td>

              {/* AMOUNT */}
              <td className="text-center p-1">
                <Form.Control
                  type="text"
                  placeholder="₱0.00"
                  value={
                    focusedRowIndex === index
                      ? row.amount ?? ""
                      : row.amount == null ||
                        row.amount === "" ||
                        row.amount === "N/A"
                      ? ""
                      : formatPeso(row.amount)
                  }
                  onChange={(e) => {
                    const input = e.target.value.trim();
                    if (/^[Nn][\/-]?[Aa]$/.test(input)) {
                      handleRowChange(index, "amount", "N/A");
                    } else {
                      let raw = input.replace(/[^0-9.]/g, "");
                      const parts = raw.split(".");
                      if (parts.length > 2) raw = parts[0] + "." + parts[1];
                      handleRowChange(index, "amount", raw);
                    }
                  }}
                  onBlur={() => {
                    // N/A OR CONVERT VALID NUMBERS
                    if (row.amount !== "" && !isNaN(row.amount)) {
                      handleRowChange(index, "amount", parseFloat(row.amount));
                    } else if (row.amount === "" || row.amount == null) {
                      handleRowChange(index, "amount", "N/A");
                    }
                    setFocusedRowIndex(null);
                  }}
                  onFocus={() => setFocusedRowIndex(index)}
                  size="sm"
                  className="form-control-sm text-center mx-auto"
                  style={{ width: "90px" }}
                />
              </td>

              <td className="text-center p-2 d-flex justify-content-center gap-1">
                {/* ADD ROW BUTTON */}
                <AppButton
                  label="+"
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleAddRow(row, false, index)}
                  className="custom-app-button"
                />

                {/* DELETE ROW BUTTON */}
                <AppButton
                  label={<FiTrash2 className="trash-icon" />}
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveRow(index)}
                  className="custom-app-button"
                />
              </td>
            </tr>
          ))}

          {/* ADD BOTTOM BUTTON */}
          <tr>
            <td colSpan="9" className="text-center p-1">
              <AppButton
                label="+"
                variant="outline-dark"
                size="sm"
                onClick={() => handleAddRow(null, true)}
                className="add-circle-btn mx-auto"
              />
            </td>
          </tr>
        </tbody>
      </Table>

      {/* MOBILE VIEW */}
      <div className="d-md-none">
        {tableRows.map((row, index) => (
          <div
            key={index}
            className="liquid-card border rounded-3 p-2 mb-2"
            style={{ fontSize: "0.875rem" }}
          >
            <div
              className="mb-2 text-center"
              style={{ fontSize: "1.2rem", lineHeight: "1" }}
            >
              •••
            </div>

            <div className="d-flex flex-column gap-1 small">
              {/* SHOW ONLY IF NOT HIDDEN ROW */}
              {!row.isHiddenRow && (
                <>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type={row.date === "N/A" ? "text" : "date"}
                      value={row.date}
                      onChange={(e) =>
                        handleRowChange(index, "date", e.target.value)
                      }
                      size="sm"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>RT#</Form.Label>
                    <Form.Control
                      type="text"
                      value={row.rt}
                      onChange={(e) =>
                        handleRowChange(index, "rt", e.target.value)
                      }
                      size="sm"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Store Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={row.store_name}
                      onChange={(e) =>
                        handleRowChange(index, "store_name", e.target.value)
                      }
                      size="sm"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Particulars</Form.Label>
                    <Form.Control
                      type="text"
                      value={row.particulars}
                      onChange={(e) =>
                        handleRowChange(index, "particulars", e.target.value)
                      }
                      size="sm"
                    />
                  </Form.Group>
                </>
              )}

              <Form.Group>
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="text"
                  value={row.from}
                  onChange={(e) =>
                    handleRowChange(index, "from", e.target.value)
                  }
                  size="sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="text"
                  value={row.to}
                  onChange={(e) => handleRowChange(index, "to", e.target.value)}
                  size="sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Mode of Transportation</Form.Label>
                <Form.Control
                  type="text"
                  value={row.mode_of_transportation}
                  onChange={(e) =>
                    handleRowChange(
                      index,
                      "mode_of_transportation",
                      e.target.value
                    )
                  }
                  size="sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="₱0.00"
                  value={
                    focusedRowIndex === index
                      ? row.amount ?? ""
                      : row.amount == null ||
                        row.amount === "" ||
                        row.amount === "N/A"
                      ? ""
                      : formatPeso(row.amount)
                  }
                  onChange={(e) => {
                    const input = e.target.value.trim();
                    if (/^[Nn][\/-]?[Aa]$/.test(input)) {
                      handleRowChange(index, "amount", "N/A");
                    } else {
                      let raw = input.replace(/[^0-9.]/g, "");
                      const parts = raw.split(".");
                      if (parts.length > 2) raw = parts[0] + "." + parts[1];
                      handleRowChange(index, "amount", raw);
                    }
                  }}
                  onBlur={() => {
                    if (row.amount !== "" && !isNaN(row.amount)) {
                      handleRowChange(index, "amount", parseFloat(row.amount));
                    } else if (row.amount === "" || row.amount == null) {
                      handleRowChange(index, "amount", "N/A");
                    }
                    setFocusedRowIndex(null);
                  }}
                  onFocus={() => setFocusedRowIndex(index)}
                  size="sm"
                />
              </Form.Group>

              {/* ACTION BUTTONS BELOW FORM */}
              <div className="d-flex justify-content-center gap-2 mt-2">
                <AppButton
                  label="+"
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleAddRow(row, false, index)}
                />
                <AppButton
                  label={<FiTrash2 className="trash-icon" />}
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveRow(index)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* ADD BOTTOM BUTTON) */}
        <div className="text-center my-2">
          <AppButton
            label="+"
            variant="outline-dark"
            size="sm"
            onClick={() => handleAddRow(null, true)}
            className="add-circle-btn"
          />
        </div>
      </div>
    </div>
  );
};

export default LiquidTable;
