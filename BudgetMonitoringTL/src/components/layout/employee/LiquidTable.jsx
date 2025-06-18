import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Table, Form } from "react-bootstrap";
import AppButton from "../../ui/AppButton";

const LiquidTable = () => {
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

  const handleTableChange = (index, field, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index][field] = value;
    setTableRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    const updated = tableRows.filter((_, i) => i !== index);
    setTableRows(updated);
  };

  return (
    <>
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
                {/* Date */}
                <td className="text-center p-1">
                  <Form.Control
                    type="date"
                    value={row.date}
                    onChange={(e) =>
                      handleTableChange(index, "date", e.target.value)
                    }
                    className="form-control-sm small-input mx-auto"
                    style={{ width: "105px" }}
                  />
                </td>

                {/* RT# */}
                <td className="text-center p-1">
                  <Form.Control
                    type="text"
                    value={row.rtNumber}
                    onChange={(e) =>
                      handleTableChange(index, "rtNumber", e.target.value)
                    }
                    className="form-control-sm small-input mx-auto"
                    style={{ width: "60px" }}
                  />
                </td>

                {/* Store Name */}
                <td className="text-center p-1">
                  <Form.Control
                    type="text"
                    value={row.storeName}
                    onChange={(e) =>
                      handleTableChange(index, "storeName", e.target.value)
                    }
                    className="form-control-sm small-input mx-auto"
                  />
                </td>

                {/* Particulars */}
                <td className="text-center p-1">
                  <Form.Control
                    type="text"
                    value={row.particulars}
                    onChange={(e) =>
                      handleTableChange(index, "particulars", e.target.value)
                    }
                    className="form-control-sm small-input mx-auto"
                  />
                </td>

                {/* From */}
                <td className="text-center p-1">
                  <Form.Control
                    type="text"
                    value={row.from}
                    onChange={(e) =>
                      handleTableChange(index, "from", e.target.value)
                    }
                    className="form-control-sm small-input mx-auto"
                    style={{ width: "80px" }}
                  />
                </td>

                {/* To */}
                <td className="text-center p-1">
                  <Form.Control
                    type="text"
                    value={row.to}
                    onChange={(e) =>
                      handleTableChange(index, "to", e.target.value)
                    }
                    className="form-control-sm small-input mx-auto"
                    style={{ width: "80px" }}
                  />
                </td>

                {/* Mode of Transportation */}
                <td className="text-center p-1">
                  <Form.Control
                    type="text"
                    value={row.modeOfTransport}
                    onChange={(e) =>
                      handleTableChange(
                        index,
                        "modeOfTransport",
                        e.target.value
                      )
                    }
                    className="form-control-sm small-input mx-auto"
                  />
                </td>

                {/* Amount */}
                <td className="text-center p-1">
                  <Form.Control
                    type="number"
                    min={0}
                    value={row.amount}
                    onChange={(e) =>
                      handleTableChange(index, "amount", e.target.value)
                    }
                    onKeyDown={(e) => preventInvalidKeys(e, "number")}
                    className="form-control-sm small-input mx-auto"
                    style={{ width: "65px" }}
                  />
                </td>

                <td className="text-center p-1">
                  {index === 0 ? (
                    <AppButton
                      label={<FiTrash2 className="trash-icon" />}
                      variant="outline-danger"
                      size="sm"
                      disabled
                      className="custom-app-button mx-auto"
                    />
                  ) : (
                    <AppButton
                      label={<FiTrash2 className="trash-icon" />}
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveRow(index)}
                      className="custom-app-button mx-auto"
                    />
                  )}
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan="9" className="text-center p-1">
                <AppButton
                  label="+"
                  variant="outline-dark"
                  size="sm"
                  onClick={handleAddRow}
                  className="add-circle-btn mx-auto"
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default LiquidTable;
