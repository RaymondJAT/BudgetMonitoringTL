import React from "react";
import { Table, Form, Container } from "react-bootstrap";

const DataTable = ({ data, columns, onRowClick }) => {
  return (
    <Container fluid>
      <div className="table-wrapper">
        <Table hover className="expense-table mb-0">
          <thead>
            <tr>
              <th className="sticky-header">
                <Form.Check type="checkbox" />
              </th>
              {columns.map((col, index) => (
                <th key={index} className="sticky-header">
                  {col.header}
                </th>
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

export default DataTable;
