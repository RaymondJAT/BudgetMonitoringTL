import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import { numberToWords } from "../js/numberToWords";
import { mockData } from "../mock-data/mockData";

const DataTables = ({ employeeName, setAmountInWords, setParticulars }) => {
  // Find transactions for the selected employee, default to empty array if not found
  const employeeData = mockData.find((e) => e.employee === employeeName) || {
    transactions: [],
  };
  const [data] = useState(employeeData.transactions);

  useEffect(() => {
    if (data.length > 0) {
      setParticulars(
        data.map((item) => ({
          label: item.label ?? "N/A",
          quantity: item.quantity ?? 0,
          price: item.price ?? 0,
          amount: (item.quantity ?? 0) * (item.price ?? 0),
        }))
      );
    } else {
      setParticulars([]);
    }
  }, [setParticulars, data]);

  const total = data.reduce(
    (sum, row) => sum + (row.quantity ?? 0) * (row.price ?? 0),
    0
  );

  // Convert total to words if valid
  useEffect(() => {
    if (!isNaN(total)) {
      setAmountInWords(numberToWords(total));
    }
  }, [total, setAmountInWords]);

  return (
    <Container fluid className="table-wrapper border border-black p-3">
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
              <td>
                {row.price
                  ? `₱${row.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`
                  : "₱0.00"}
              </td>
              <td className="border">
                {`₱${((row.quantity ?? 0) * (row.price ?? 0)).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`}
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
              <strong>
                ₱{total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </strong>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
};

export default DataTables;
