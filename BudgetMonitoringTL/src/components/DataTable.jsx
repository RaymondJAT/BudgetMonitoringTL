import { useState, useEffect } from "react";
import { Table, Form, Container, Dropdown } from "react-bootstrap";
import { GoKebabHorizontal } from "react-icons/go";
import { meatballActions } from "../mock-data/meatballActions";

const DataTable = ({
  data,
  columns,
  onRowClick,
  onDelete,
  onArchive,
  onToggleImportant,
}) => {
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

  const handleDelete = (entryToDelete) => {
    if (typeof onDelete === "function") {
      onDelete(entryToDelete);
    }
  };

  const meatballItems = meatballActions({
    onDelete: handleDelete,
    onArchive,
    onToggleImportant,
  });

  return (
    <Container fluid>
      <div className="table-wrapper">
        <Table hover className="expense-table mb-0">
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map((col, index) => (
                <th key={index} style={{ width: col.width || "auto" }}>
                  {col.header}
                </th>
              ))}
              <th style={{ width: "30px" }}></th>
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
                    <td
                      key={colIndex}
                      style={
                        col.accessor === "description"
                          ? {
                              maxWidth: "200px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }
                          : {}
                      }
                    >
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
                        {meatballItems.map((action, i) => (
                          <Dropdown.Item
                            key={i}
                            onClick={() => action.onClick(entry)}
                            className="meat-dropdown"
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
