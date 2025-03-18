import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import { numberToWords } from "../js/numberToWords";
import { tableData } from "../mock-data/tableData";

const DataTable = ({ employeeName, setAmountInWords, setParticulars }) => {
  // Find transactions for the selected employee
  const employeeData = tableData.find((e) => e.employee === employeeName);
  const [data] = useState(employeeData ? employeeData.transactions : []);

  useEffect(() => {
    setParticulars(
      data.map((item) => ({
        label: item.label,
        quantity: item.quantity,
        price: item.price,
        amount: item.quantity * item.price,
      }))
    );
  }, [setParticulars, data]);

  // total dynamically
  const total = data.reduce((sum, row) => sum + row.quantity * row.price, 0);

  // total amount to words
  useEffect(() => {
    setAmountInWords(numberToWords(total));
  }, [total, setAmountInWords]);

  return (
    <Container className="table-wrapper border border-black p-3">
      <Table responsive>
        <thead className="tableHead text-center">
          <tr>
            <th>Label</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody className="tableBody text-center">
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.label || "N/A"}</td>
              <td>{row.quantity ?? 0}</td>
              <td>{row.price ? row.price.toFixed(2) : "0.00"}</td>
              <td className="border">
                {(row.quantity * row.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="custom-col text-end border-end">
              <strong>Total:</strong>
            </td>
            <td className="text-center border-end">
              <strong>₱{total.toFixed(2)}</strong>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
};

export default DataTable;
