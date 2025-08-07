import { useState, useEffect } from "react";
import { Table, Form, Dropdown } from "react-bootstrap";
import { GoKebabHorizontal } from "react-icons/go";
import { FaEye } from "react-icons/fa";

import { meatballActions } from "../../handlers/actionMenuItems";
import AppButton from "../ui/AppButton";

const DataTable = ({
  data = [],
  height,
  columns = [],
  onRowClick,
  onDelete,
  onArchive,
  onToggleImportant,
  downloadRef,
  selectedRows = {},
  onSelectionChange,
  setPrintData,
  showCheckbox = true,
  showActions = true, // <- new prop
}) => {
  const [allSelected, setAllSelected] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  useEffect(() => {
    setAllSelected(
      data.length > 0 && data.every((entry) => selectedRows[entry?.id])
    );
  }, [data, selectedRows]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelection = {};
    data.forEach((entry) => {
      if (entry?.id !== undefined) newSelection[entry.id] = checked;
    });
    onSelectionChange?.(newSelection);
  };

  const handleRowCheck = (entryId) => {
    onSelectionChange?.({
      ...selectedRows,
      [entryId]: !selectedRows[entryId],
    });
  };

  const meatballItems = meatballActions({
    onDelete,
    onArchive,
    onToggleImportant,
    downloadRef,
    setPrintData,
  });

  const renderCell = (entry, col) => {
    const value = entry[col.accessor];

    if (typeof col.Cell === "function") {
      return col.Cell({ value, row: entry });
    }

    switch (col.accessor) {
      case "status":
        return (
          <span className={`status-badge ${String(value).toLowerCase()}`}>
            {value}
          </span>
        );
      case "total":
        const totalValue =
          entry.formType === "Liquidation" ? entry.amountObtained : entry.total;
        return `₱ ${parseFloat(totalValue || 0).toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      case "quantity":
        return entry.transactions?.map((item, i) => (
          <div key={i}>{item.quantity}</div>
        ));
      case "price":
        return entry.transactions?.map((item, i) => (
          <div key={i}>
            ₱{" "}
            {parseFloat(item.price).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        ));
      default:
        return value ?? "";
    }
  };

  const renderTableRows = () =>
    data.map((entry, index) => {
      if (!entry || typeof entry !== "object") return null;

      return (
        <tr
          key={entry.id || index}
          className={`clickable-row ${
            selectedRows[entry.id] ? "highlighted-row" : ""
          }`}
        >
          {showCheckbox && (
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
          )}

          {columns.map((col, i) => (
            <td
              key={i}
              className={
                col.accessor === "price" || col.accessor === "quantity"
                  ? "d-none"
                  : ""
              }
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
              onClick={() => onRowClick?.(entry)}
            >
              {renderCell(entry, col)}
            </td>
          ))}

          {showActions && (
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
                      <action.Icon {...action.iconProps} /> {action.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </td>
          )}
        </tr>
      );
    });

  const renderMobileCards = () =>
    data.map((entry, index) => {
      if (!entry || typeof entry !== "object") return null;

      return (
        <div
          key={entry.id || index}
          className={`mobile-card ${
            selectedRows[entry.id] ? "highlighted-row" : ""
          }`}
        >
          <div className="mobile-card-header d-flex justify-content-between align-items-center">
            {showCheckbox && (
              <Form.Check
                type="checkbox"
                checked={selectedRows[entry.id] || false}
                onChange={() => handleRowCheck(entry.id)}
                style={{ marginRight: "0.5rem" }}
              />
            )}

            {showActions && (
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
                      fontSize: "1rem",
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
                      <action.Icon {...action.iconProps} /> {action.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>

          <div className="mobile-card-item">
            <strong>ID:</strong> {entry.id}
          </div>
          <div className="mobile-card-item">
            <strong>Employee:</strong> {entry.employee}
          </div>
          <div className="mobile-card-item">
            <strong>Department:</strong> {entry.department}
          </div>
          <div className="mobile-card-item">
            <strong>Description:</strong> {entry.description}
          </div>
          <div className="mobile-card-item">
            <strong>Amount:</strong> ₱{" "}
            {parseFloat(entry.total || 0).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="mobile-card-item">
            <strong>Status:</strong>
            <span
              className={`status-badge ${String(entry.status).toLowerCase()}`}
            >
              {entry.status}
            </span>
          </div>

          <div className="mobile-card-view-btn">
            <AppButton
              label={<FaEye />}
              size="sm"
              variant="outline-dark"
              onClick={() => onRowClick(entry)}
              className="custom-app-button btn-responsive"
            />
          </div>
        </div>
      );
    });

  return (
    <div className="table-wrapper" style={{ maxHeight: height }}>
      <Table hover className="expense-table mb-0">
        <thead>
          <tr>
            {showCheckbox && (
              <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                <Form.Check
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((col, i) => (
              <th
                key={i}
                className={
                  col.accessor === "price" || col.accessor === "quantity"
                    ? "d-none"
                    : ""
                }
                style={{
                  width: col.width || "auto",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                {col.label}
              </th>
            ))}
            {showActions && <th style={{ width: "30px" }}></th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            renderTableRows()
          ) : (
            <tr>
              <td
                colSpan={
                  columns.length +
                  (showCheckbox ? 1 : 0) +
                  (showActions ? 1 : 0)
                }
                className="text-center"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Mobile View */}
      <div className="d-lg-none">
        {data.length > 0 ? (
          renderMobileCards()
        ) : (
          <div className="text-center mt-4 d-block d-lg-none">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
