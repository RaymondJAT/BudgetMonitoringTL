import { useState } from "react";
import { Row, Col, FloatingLabel, Form, Table, Button } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import AppButton from "../AppButton";

const LiquidForm = ({ formData = {}, onChange = () => {} }) => {
  const [tableRows, setTableRows] = useState([
    {
      date: "",
      rtNumber: "",
      storeName: "",
      particulars: "",
      from: "",
      to: "",
      modeOfTransport: "",
      amount: "",
    },
  ]);

  const preventInvalidKeys = (e, type) => {
    if (
      type === "number" &&
      (["e", "E", "+", "-"].includes(e.key) || (e.ctrlKey && e.key === "v"))
    ) {
      e.preventDefault();
    }
  };

  const handleNumberInput = (e, type) => {
    if (type === "number") {
      const value = e.target.value;
      if (parseFloat(value) < 0) {
        e.target.value = "0";
      }
    }
    onChange(e);
  };

  const handleTableChange = (index, field, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index][field] = value;
    setTableRows(updatedRows);
  };

  const handleAddRow = () => {
    setTableRows([
      ...tableRows,
      {
        date: "",
        rtNumber: "",
        storeName: "",
        particulars: "",
        from: "",
        to: "",
        modeOfTransport: "",
        amount: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = tableRows.filter((_, i) => i !== index);
    setTableRows(updated);
  };

  return (
    <>
      {/* FORM SECTION */}
      <div className="request-container border p-3 mb-2">
        <Row>
          <Col md={6}>
            <FloatingLabel
              controlId="employee"
              label="Employee"
              className="mb-2"
            >
              <Form.Control
                type="text"
                name="employee"
                value={formData.employee || ""}
                onChange={onChange}
                placeholder="Employee"
                className="form-control-sm small-input"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="department"
              label="Department"
              className="mb-2"
            >
              <Form.Control
                type="text"
                name="department"
                value={formData.department || ""}
                onChange={onChange}
                placeholder="Department"
                className="form-control-sm small-input"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="date"
              label="Date of Liquidation"
              className="mb-2"
            >
              <Form.Control
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={onChange}
                placeholder="Date of Liquidation"
                className="form-control-sm small-input"
              />
            </FloatingLabel>
          </Col>

          <Col md={6}>
            <FloatingLabel
              controlId="amountObtained"
              label="Amount Obtained"
              className="mb-2"
            >
              <Form.Control
                type="number"
                name="amountObtained"
                value={formData.amountObtained || ""}
                onChange={(e) => handleNumberInput(e, "number")}
                onKeyDown={(e) => preventInvalidKeys(e, "number")}
                placeholder="Amount Obtained"
                className="form-control-sm small-input"
                min={0}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="amountExpended"
              label="Amount Expended"
              className="mb-2"
            >
              <Form.Control
                type="number"
                name="amountExpended"
                value={formData.amountExpended || ""}
                onChange={(e) => handleNumberInput(e, "number")}
                onKeyDown={(e) => preventInvalidKeys(e, "number")}
                placeholder="Amount Expended"
                className="form-control-sm small-input"
                min={0}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="reimburseOrReturn"
              label="Reimburse / Return"
              className="mb-2"
            >
              <Form.Control
                type="number"
                name="reimburseOrReturn"
                value={formData.reimburseOrReturn || ""}
                onChange={(e) => handleNumberInput(e, "number")}
                onKeyDown={(e) => preventInvalidKeys(e, "number")}
                placeholder="Reimburse / Return"
                className="form-control-sm small-input"
                min={0}
              />
            </FloatingLabel>
          </Col>
        </Row>
      </div>

      {/* TABLE SECTION */}
      <div className="request-table-wrapper border">
        <Table size="sm" className="request-table text-center">
          <thead className="table-light small-input">
            <tr>
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
                {[
                  "date",
                  "rtNumber",
                  "storeName",
                  "particulars",
                  "from",
                  "to",
                  "modeOfTransport",
                ].map((field) => (
                  <td key={field}>
                    <Form.Control
                      type={field === "date" ? "date" : "text"}
                      value={row[field]}
                      onChange={(e) =>
                        handleTableChange(index, field, e.target.value)
                      }
                      className="form-control-sm"
                    />
                  </td>
                ))}
                <td>
                  <Form.Control
                    type="number"
                    min={0}
                    value={row.amount}
                    onChange={(e) =>
                      handleTableChange(index, "amount", e.target.value)
                    }
                    onKeyDown={(e) => preventInvalidKeys(e, "number")}
                    className="form-control-sm"
                  />
                </td>
                <td className="text-center">
                  {index === 0 ? (
                    <AppButton
                      label={<FiTrash2 />}
                      variant="outline-danger"
                      size="sm"
                      disabled
                    />
                  ) : (
                    <AppButton
                      label={<FiTrash2 />}
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveRow(index)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center mt-5">
          <AppButton
            label="+"
            variant="outline-dark"
            size="sm"
            onClick={handleAddRow}
            className="add-circle-btn"
          />
        </div>
      </div>
    </>
  );
};

export default LiquidForm;
