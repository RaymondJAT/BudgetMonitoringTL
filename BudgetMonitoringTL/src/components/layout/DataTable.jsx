import { useState, useEffect, useCallback } from "react";
import { Table, Form, Dropdown } from "react-bootstrap";
import { GoKebabHorizontal } from "react-icons/go";
import { FaEye } from "react-icons/fa";

import { meatballActions } from "../../handlers/actionMenuItems";
import AppButton from "../ui/buttons/AppButton";

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
  batchSize = 11,
}) => {
  const [allSelected, setAllSelected] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(batchSize);

  const visibleData = data.slice(0, visibleCount);

  // GENERATE ACTION MENU ITEMS
  const meatballItems = meatballActions({ downloadRef, setPrintData });

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
    onSelectionChange?.({ ...selectedRows, [entryId]: !selectedRows[entryId] });
  };

  // CELL RENDERING
  const formatCurrency = (amount) =>
    `₱ ${parseFloat(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

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
      case "total":
        const totalValue =
          entry.formType === "Liquidation" ? entry.amountObtained : entry.total;
        return formatCurrency(totalValue);
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
  const renderTableRows = (rows = visibleData) =>
    rows.filter(Boolean).map((entry, index) => (
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
  const renderMobileCards = (rows = visibleData) =>
    rows.map((entry, index) => (
      <div
        key={entry.id || index}
        className={`mobile-card p-3 mb-3 border rounded shadow-sm ${
          selectedRows[entry.id] ? "highlighted-row" : ""
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => onRowClick?.(entry)}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <strong>{entry.description || entry.name || entry.id}</strong>
          </div>
          {showCheckbox && (
            <Form.Check
              type="checkbox"
              checked={selectedRows[entry.id] || false}
              onClick={(e) => e.stopPropagation()}
              onChange={() => toggleRowSelection(entry.id)}
            />
          )}
        </div>

        {columns.map((col, i) => {
          if (col.accessor === "price" || col.accessor === "quantity")
            return null;
          let value = entry[col.accessor];

          switch (col.accessor) {
            case "status":
              value = (
                <span className={`status-badge ${String(value).toLowerCase()}`}>
                  {value}
                </span>
              );
              break;
            case "total":
              value = formatCurrency(entry.total || entry.amountObtained);
              break;
            case "quantity":
              value = entry.transactions?.map((item, i) => (
                <div key={i}>{item.quantity}</div>
              ));
              break;
            case "price":
              value = entry.transactions?.map((item, i) => (
                <div key={i}>{formatCurrency(item.price)}</div>
              ));
              break;
            default:
              value = value ?? "";
          }

          return (
            <div key={i} className="d-flex justify-content-between mb-1">
              <span>{col.label}:</span>
              <span>{value}</span>
            </div>
          );
        })}

        {showActions && (
          <div className="d-flex justify-content-end mt-2">
            {actionType === "meatball" ? (
              <ActionMenu entry={entry} index={index} />
            ) : (
              <ActionButton entry={entry} />
            )}
          </div>
        )}
      </div>
    ));

  // SCROLL HANDLER FOR INFINITE LOAD
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setVisibleCount((prev) => Math.min(prev + batchSize, data.length));
    }
  };

  return (
    <div
      className="table-wrapper"
      style={{ maxHeight: height, overflowY: "auto" }}
      onScroll={handleScroll}
    >
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
          {visibleData.length > 0 ? (
            renderTableRows(visibleData)
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
        {visibleData.length > 0 ? (
          renderMobileCards(visibleData)
        ) : (
          <div className="text-center mt-4">{noDataMessage}</div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
