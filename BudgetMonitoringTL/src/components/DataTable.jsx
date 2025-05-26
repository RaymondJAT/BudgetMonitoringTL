import { useState, useEffect } from "react";
import { Table, Form, Container, Dropdown } from "react-bootstrap";
import { GoKebabHorizontal } from "react-icons/go";
import { meatballActions } from "../handlers/actionMenuItems";

const DataTable = ({
  data,
  columns,
  onRowClick,
  onDelete,
  onArchive,
  onToggleImportant,
  selectedRows = {},
  onSelectionChange,
}) => {
  const [allSelected, setAllSelected] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  useEffect(() => {
    setAllSelected(
      data.length > 0 && data.every((entry) => selectedRows[entry.id])
    );
  }, [selectedRows, data]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelection = {};
    data.forEach((entry) => {
      newSelection[entry.id] = checked;
    });
    if (typeof onSelectionChange === "function") {
      onSelectionChange(newSelection);
    }
  };

  const handleRowCheck = (entryId) => {
    const updated = { ...selectedRows, [entryId]: !selectedRows[entryId] };
    if (typeof onSelectionChange === "function") {
      onSelectionChange(updated);
    }
  };

  const handleDelete = (entryToDelete) => {
    if (typeof onDelete === "function") {
      onDelete(entryToDelete);
    }
  };

  const getSelectedEntries = (selection) =>
    data.filter((entry) => selection[entry.id]);

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
                  key={entry.id || index}
                  className={`clickable-row ${
                    selectedRows[entry.id] ? "highlighted-row" : ""
                  }`}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows[entry.id] || false}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowCheck(entry.id);
                      }}
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
                      onClick={() => onRowClick(entry)}
                    >
                      {col.accessor === "status" ? (
                        <span
                          className={`status-badge ${String(
                            entry[col.accessor]
                          ).toLowerCase()}`}
                        >
                          {entry[col.accessor]}
                        </span>
                      ) : col.accessor === "total" ? (
                        `₱ ${parseFloat(
                          entry[col.accessor] || 0
                        ).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      ) : (
                        entry[col.accessor] ?? ""
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
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(entry);
                            }}
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
