import React from "react";
import { Table, Form, Container } from "react-bootstrap";

const ExpenseTable = ({ data, columns, onRowClick }) => {
  return (
    <Container>
      <div className="table-wrapper">
        <Table responsive hover className="expense-table">
          <thead>
            <tr>
              <th>
                <Form.Check type="checkbox" />
              </th>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((entry, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick(entry)}
                  className="clickable-row"
                >
                  <td>
                    <Form.Check type="checkbox" />
                  </td>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>{entry[col.accessor]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ExpenseTable;
