import React, { useState } from "react";
import { Table, Container, Button } from "react-bootstrap";

const DataTable = () => {
  const [tableData, setTableData] = useState([
    { label: "Ticket", quantity: 1, price: 250, amount: 250 },
    { label: "Food", quantity: 2, price: 100, amount: 200 },
    { label: "Others", quantity: 1, price: 50, amount: 50 },
  ]);

  // calculate total amount
  const calculateTotal = () => {
    return tableData.reduce((sum, row) => sum + row.amount, 0);
  };

  // add new row
  const addRow = () => {
    setTableData([
      ...tableData,
      { label: "New Item", quantity: 1, price: 0.0, amount: 0.0 },
    ]);
  };

  return (
    <div>
      <Container className="table-wrapper border border-black p-3">
        <Table responsive>
          <thead className="tableHead">
            <tr>
              <th>Label</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody className="tableBody">
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.label}</td>
                <td>{row.quantity}</td>
                <td>{row.price.toFixed(2)}</td>
                <td>{row.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          {/* Total and Amount Due */}
          <tfoot>
            <tr>
              <td colSpan="3" className="custom-col text-end">
                <strong>Total:</strong>
              </td>
              <td>
                <strong>{calculateTotal().toFixed(2)}</strong>
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="custom-col text-end">
                <strong>Amount Due:</strong>
              </td>
              <td>
                <strong>{calculateTotal().toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Container>

      {/* Add Button */}
      {/* <div className="d-flex justify-content-end mt-2">
        <Button variant="primary" onClick={addRow}>
          Add Row
        </Button>
      </div> */}
    </div>
  );
};

export default DataTable;
