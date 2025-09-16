import { useState, useEffect, useCallback, Fragment } from "react";
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
  downloadRef,
  selectedRows = {},
  onSelectionChange,
  setPrintData,
  showCheckbox = true,
  showActions = true,
  actionType = "meatball",
  renderActionButton,
  noDataMessage = "No transactions available",
}) => {
  const [allSelected, setAllSelected] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // GENERATE ACTION MENU ITEMS
  const meatballItems = meatballActions({
    downloadRef,
    setPrintData,
  });

  // UPDATE SELECT ALL STATE
  useEffect(() => {
    setAllSelected(
      data.length > 0 && data.every((entry) => selectedRows[entry?.id])
    );
  }, [data, selectedRows]);

  // SELECTION HANDLERS
  const handleSelectAll = (checked) => {
    const newSelection = {};
    data.forEach((entry) => {
      if (entry?.id !== undefined) newSelection[entry.id] = checked;
    });
    onSelectionChange?.(newSelection);
  };

  const toggleRowSelection = (entryId) => {
    onSelectionChange?.({
      ...selectedRows,
      [entryId]: !selectedRows[entryId],
    });
  };

  // CELL RENDERING
  const renderCell = useCallback((entry, col) => {
    const value = entry[col.accessor];

    if (typeof col.Cell === "function") return col.Cell({ value, row: entry });

    switch (col.accessor) {
      case "status":
        return (
          <span className={`status-badge ${String(value).toLowerCase()}`}>
            {value}
          </span>
        );
      case "total": {
        const totalValue =
          entry.formType === "Liquidation" ? entry.amountObtained : entry.total;
        return formatCurrency(totalValue);
      }
      case "quantity":
        return entry.transactions?.map((item, i) => (
          <div key={i}>{item.quantity}</div>
        ));
      case "price":
        return entry.transactions?.map((item, i) => (
          <div key={i}>{formatCurrency(item.price)}</div>
        ));
      default:
        return value ?? "";
    }
  }, []);

  const formatCurrency = (amount) =>
    `₱ ${parseFloat(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // MEATBALL DROPDOWN ACTIONS
  const ActionMenu = ({ entry, index }) => (
    <Dropdown
      align="end"
      show={openDropdownIndex === index}
      onToggle={(isOpen) => setOpenDropdownIndex(isOpen ? index : null)}
    >
      <Dropdown.Toggle
        variant="link"
        bsPrefix="p-0 border-0 bg-transparent"
        style={{ boxShadow: "none" }}
        onClick={(e) => {
          e.stopPropagation();
          setOpenDropdownIndex(openDropdownIndex === index ? null : index);
        }}
      >
        <GoKebabHorizontal
          style={{ cursor: "pointer", fontSize: "0.9rem", color: "black" }}
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
  );

  // ACTION BUTTON (ALTERNATIVE)
  const ActionButton = ({ entry }) =>
    renderActionButton ? (
      renderActionButton(entry)
    ) : (
      <AppButton
        label={<FaEye />}
        size="sm"
        variant="outline-dark"
        onClick={(e) => {
          e.stopPropagation();
          onRowClick?.(entry);
        }}
      />
    );

  // RENDER ROWS
  const renderTableRows = () =>
    data.filter(Boolean).map((entry, index) => (
      <tr
        key={entry.id ?? index}
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
                toggleRowSelection(entry.id);
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
            {actionType === "meatball" ? (
              <ActionMenu entry={entry} index={index} />
            ) : (
              <ActionButton entry={entry} />
            )}
          </td>
        )}
      </tr>
    ));

  // RENDER MOBILE CARDS
  const renderMobileCards = () =>
    data.map((entry, index) => (
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
              onChange={() => toggleRowSelection(entry.id)}
              style={{ marginRight: "0.5rem" }}
            />
          )}
          {showActions &&
            (actionType === "meatball" ? (
              <ActionMenu entry={entry} index={index} />
            ) : (
              <ActionButton entry={entry} />
            ))}
        </div>
      </div>
    ));

  return (
    <div className="table-wrapper" style={{ maxHeight: height }}>
      {/* DESKTOP VIEW */}
      <Table hover className="expense-table mb-0 d-none d-lg-table">
        <thead>
          <tr>
            {showCheckbox && (
              <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                <Form.Check
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
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
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* MOBILE VIEW */}
      <div className="d-lg-none">
        {data.length > 0 ? (
          renderMobileCards()
        ) : (
          <div className="text-center mt-4">{noDataMessage}</div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
