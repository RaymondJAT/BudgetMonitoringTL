import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import { numberToWords } from "../js/numberToWords";

const DataTable = ({ setAmountInWords, setParticulars }) => {
  const [tableData] = useState([
    { label: "Ticket", quantity: 3, price: 250 },
    { label: "Food", quantity: 2, price: 100 },
    { label: "Others", quantity: 1, price: 50.87 },
    { label: "Food", quantity: 2, price: 100 },
    { label: "Ticket", quantity: 3, price: 250 },
    { label: "Ticket", quantity: 3, price: 250 },
    { label: "Ticket", quantity: 3, price: 250 },
  ]);

  useEffect(() => {
    // Update particulars in ApprovalForm
    setParticulars(
      tableData.map((item) => ({
        label: item.label,
        quantity: item.quantity,
        price: item.price,
        amount: item.quantity * item.price,
      }))
    );
  }, [setParticulars, tableData]);

  // computing total dynamically
  const total = tableData.reduce(
    (sum, row) => sum + row.quantity * row.price,
    0
  );

  // amount in words
  useEffect(() => {
    setAmountInWords(numberToWords(total));
  }, [total, setAmountInWords]);

  return (
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
              <td>{row.label || "N/A"}</td>
              <td>{row.quantity ?? 0}</td>
              <td>{row.price ? row.price.toFixed(2) : "0.00"}</td>
              <td>{(row.quantity * row.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="custom-col text-end">
              <strong>Total:</strong>
            </td>
            <td>
              <strong>₱{total.toFixed(2)}</strong>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
};

export default DataTable;
