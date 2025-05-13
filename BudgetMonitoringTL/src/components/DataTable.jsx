import React, { useState, useEffect } from "react";
import { Table, Form, Container } from "react-bootstrap";

const DataTable = ({ data, columns, onRowClick }) => {
  const [selectedRows, setSelectedRows] = useState({});
  const [allSelected, setAllSelected] = useState(false);

  // update rows state when data changes
  useEffect(() => {
    const initialSelection = {};
    data.forEach((entry, index) => {
      initialSelection[index] = false;
    });
    setSelectedRows(initialSelection);
    setAllSelected(false);
  }, [data]);

  // checked all checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelection = {};
    Object.keys(selectedRows).forEach((key) => {
      newSelection[key] = checked;
    });
    setSelectedRows(newSelection);
    setAllSelected(checked);
  };

  // individual checkbox
  const handleRowCheck = (index) => {
    const updated = { ...selectedRows, [index]: !selectedRows[index] };
    setSelectedRows(updated);
    setAllSelected(Object.values(updated).every((val) => val));
  };

  return (
    <Container fluid>
      <div className="table-wrapper">
        <Table hover className="expense-table mb-0">
          <thead>
            <tr>
              <th className="sticky-header">
                <Form.Check
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
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
                  <td onClick={(e) => e.stopPropagation()}>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows[index] || false}
                      onChange={() => handleRowCheck(index)}
                    />
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
