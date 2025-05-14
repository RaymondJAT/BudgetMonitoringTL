import React, { useState, useEffect } from "react";
import { Table, Form, Container, Dropdown } from "react-bootstrap";
import { GoKebabHorizontal } from "react-icons/go";

const DataTable = ({ data, columns, onRowClick }) => {
  const [selectedRows, setSelectedRows] = useState({});
  const [allSelected, setAllSelected] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(false);

  useEffect(() => {
    const initialSelection = {};
    data.forEach((entry, index) => {
      initialSelection[index] = false;
    });
    setSelectedRows(initialSelection);
    setAllSelected(false);
  }, [data]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelection = {};
    Object.keys(selectedRows).forEach((key) => {
      newSelection[key] = checked;
    });
    setSelectedRows(newSelection);
    setAllSelected(checked);
  };

  const handleRowCheck = (index) => {
    const updated = { ...selectedRows, [index]: !selectedRows[index] };
    setSelectedRows(updated);
    setAllSelected(Object.values(updated).every((val) => val));
  };

  const meatballActions = [
    { label: "Delete", onClick: (entry) => console.log("Delete", entry) },
    { label: "Duplicate", onClick: (entry) => console.log("Duplicate", entry) },
    { label: "Download", onClick: (entry) => console.log("Download", entry) },
    {
      label: "Mark as Important",
      onClick: (entry) => console.log("Mark", entry),
    },
    {
      label: "Change Status",
      onClick: (entry) => console.log("Change Status", entry),
    },
    { label: "Print", onClick: (entry) => console.log("Print", entry) },
  ];

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
              <th className="sticky-header" style={{ width: "30px" }}></th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((entry, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick(entry)}
                  className={`clickable-row ${
                    selectedRows[index] ? "highlighted-row" : ""
                  }`}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows[index] || false}
                      onChange={() => handleRowCheck(index)}
                    />
                  </td>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.accessor === "status" ? (
                        <span
                          className={`status-badge ${entry[
                            col.accessor
                          ].toLowerCase()}`}
                        >
                          {entry[col.accessor]}
                        </span>
                      ) : col.accessor === "total" ? (
                        `₱ ${parseFloat(entry[col.accessor]).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      ) : (
                        entry[col.accessor]
                      )}
                    </td>
                  ))}
                  <td onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      align="end"
                      show={openDropdownIndex === index}
                      onToggle={(isOpen) =>
                        setOpenDropdownIndex(isOpen ? index : null)
                      }
                    >
                      <Dropdown.Toggle
                        variant="link"
                        bsPrefix="p-0 border-0 bg-transparent"
                        style={{ boxShadow: "none" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownIndex(
                            openDropdownIndex === index ? null : index
                          );
                        }}
                      >
                        <GoKebabHorizontal
                          style={{
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            color: "black",
                          }}
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="black-dropdown">
                        {meatballActions.map((action, i) => (
                          <Dropdown.Item
                            key={i}
                            onClick={() => action.onClick(entry)}
                          >
                            {action.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 2} className="text-center">
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
