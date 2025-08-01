import { useState, useEffect } from "react";
import { Table, Form, Dropdown } from "react-bootstrap";
import { GoKebabHorizontal } from "react-icons/go";

import { meatballActions } from "../../handlers/actionMenuItems";
import { FaEye } from "react-icons/fa";
import AppButton from "../ui/AppButton";

const DataTable = ({
  data,
  height,
  columns,
  onRowClick,
  onDelete,
  onArchive,
  onToggleImportant,
  downloadRef,
  selectedRows = {},
  onSelectionChange,
  setPrintData,
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
    onSelectionChange?.(newSelection);
  };

  const handleRowCheck = (entryId) => {
    const updated = { ...selectedRows, [entryId]: !selectedRows[entryId] };
    onSelectionChange?.(updated);
  };

  const handleDelete = (entry) => onDelete?.(entry);

  const meatballItems = meatballActions({
    onDelete: handleDelete,
    onArchive,
    onToggleImportant,
    downloadRef,
    setPrintData,
  });

  return (
    <>
      <div className="table-wrapper" style={{ maxHeight: height }}>
        <Table hover className="expense-table mb-0">
          <thead>
            <tr>
              <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                <Form.Check
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map((col, index) => (
                <th
                  key={index}
                  style={{
                    width: col.width || "auto",
                    textAlign: "center", // <-- Center horizontally
                    verticalAlign: "middle", // <-- Center vertically
                  }}
                  className={
                    col.accessor === "price" || col.accessor === "quantity"
                      ? "d-none"
                      : ""
                  }
                >
                  {col.label}
                </th>
              ))}
              <th style={{ width: "30px" }}></th>
            </tr>
          </thead>

          <tbody>
            {data?.length > 0 ? (
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
                        (() => {
                          const value =
                            entry.formType === "Liquidation"
                              ? entry.amountObtained
                              : entry.total;

                          return `₱ ${parseFloat(value || 0).toLocaleString(
                            "en-PH",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`;
                        })()
                      ) : col.accessor === "quantity" ? (
                        entry.transactions?.map((item, i) => (
                          <div key={i}>{item.quantity}</div>
                        ))
                      ) : col.accessor === "price" ? (
                        entry.transactions?.map((item, i) => (
                          <div key={i}>
                            ₱{" "}
                            {parseFloat(item.price).toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        ))
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
                            <action.Icon {...action.iconProps} />
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

        {/* Mobile/Tablet View */}
        <div className="d-lg-none">
          {data?.length > 0 ? (
            data.map((entry, index) => (
              <div
                key={entry.id || index}
                className={`mobile-card ${
                  selectedRows[entry.id] ? "highlighted-row" : ""
                }`}
              >
                <div className="mobile-card-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows[entry.id] || false}
                      onChange={() => handleRowCheck(entry.id)}
                      style={{ marginRight: "0.5rem" }}
                    />
                  </div>

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
                          <action.Icon {...action.iconProps} />
                          {action.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                {/* Main Details */}
                <div className="mobile-card-item">
                  <span className="mobile-card-label">ID:</span> {entry.id}
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Employee:</span>{" "}
                  <span className="mobile-card-value">{entry.employee}</span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Department:</span>{" "}
                  <span className="mobile-card-value">{entry.department}</span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Description:</span>{" "}
                  <span className="mobile-card-value">{entry.description}</span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Amount:</span>{" "}
                  <span className="mobile-card-value">
                    ₱{" "}
                    {parseFloat(entry.total || 0).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Status:</span>{" "}
                  <span
                    className={`mobile-card-value status-badge ${String(
                      entry.status
                    ).toLowerCase()}`}
                  >
                    {entry.status}
                  </span>
                </div>

                {/* View Button */}
                <div className="mobile-card-view-btn">
                  <AppButton
                    label={
                      <>
                        <FaEye />
                      </>
                    }
                    size="sm"
                    variant="outline-dark"
                    onClick={() => onRowClick(entry)}
                    className="custom-app-button btn-responsive"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-4 d-block d-lg-none">
              No data available
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DataTable;
