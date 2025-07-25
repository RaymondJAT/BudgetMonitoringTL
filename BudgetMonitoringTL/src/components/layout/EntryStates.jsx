import { useEffect, useState } from "react";
import { Table, Form, Dropdown } from "react-bootstrap";
import { GoKebabHorizontal } from "react-icons/go";
import AppButton from "../ui/AppButton";

const EntryStates = ({
  columns,
  items,
  onRowClick,
  showRestore = false,
  showDelete = false,
  onRestore,
  onDelete,
  selectedItems = [],
  setSelectedItems = () => {},
}) => {
  const [selectedRows, setSelectedRows] = useState({});
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  useEffect(() => {
    const initialSelection = {};
    items.forEach((item) => {
      initialSelection[item.id] = false;
    });
    setSelectedRows(initialSelection);
  }, [items]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelected = checked ? items.map((item) => item.id) : [];
    setSelectedItems(newSelected);
  };

  const handleRowCheck = (id) => {
    let newSelected = [];
    if (selectedItems.includes(id)) {
      newSelected = selectedItems.filter((itemId) => itemId !== id);
    } else {
      newSelected = [...selectedItems, id];
    }
    setSelectedItems(newSelected);
  };

  return (
    <>
      <div className="table-wrapper">
        <Table hover className="expense-table mb-0 d-none d-lg-table">
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={
                    selectedItems.length === items.length && items.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map((col, index) => (
                <th key={index}>{col.label}</th>
              ))}
              {(showRestore || showDelete) && <th></th>}
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((entry) => (
                <tr
                  key={entry.id}
                  onClick={() => onRowClick(entry)}
                  className={`clickable-row ${
                    selectedItems.includes(entry.id) ? "highlighted-row" : ""
                  }`}
                >
                  <td
                    style={{ width: "40px", paddingLeft: "0.5rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Form.Check
                      type="checkbox"
                      checked={selectedItems.includes(entry.id)}
                      onChange={() => handleRowCheck(entry.id)}
                    />
                  </td>
                  {columns.map((col, i) => (
                    <td key={i}>
                      {col.accessor === "status" ? (
                        <span
                          className={`status-badge ${entry[col.accessor]
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
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
                  {(showRestore || showDelete) && (
                    <td
                      style={{
                        width: "160px",
                        paddingRight: "0.75rem",
                        textAlign: "right",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        {showRestore && (
                          <AppButton
                            label="Restore"
                            variant="success"
                            size="sm"
                            className="trash-button btn-responsive"
                            onClick={() => onRestore(entry)}
                          />
                        )}
                        {showDelete && (
                          <AppButton
                            label="Delete"
                            variant="danger"
                            size="sm"
                            className="trash-button btn-responsive"
                            onClick={() => onDelete(entry)}
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 2} className="text-center">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* ✅ Mobile View */}
        <div className="d-lg-noner">
          {items.length > 0 ? (
            items.map((entry, index) => (
              <div key={entry.id || index} className="mobile-card">
                <div className="mobile-card-header d-flex justify-content-between align-items-center">
                  <div>
                    <Form.Check
                      type="checkbox"
                      checked={selectedItems.includes(entry.id)}
                      onChange={() => handleRowCheck(entry.id)}
                      style={{ marginRight: "8px" }}
                    />
                    <span className="mobile-card-label">ID:</span> {entry.id}
                  </div>
                  {(showRestore || showDelete) && (
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
                        {showRestore && (
                          <Dropdown.Item
                            className="meat-dropdown"
                            onClick={() => onRestore(entry)}
                          >
                            Restore
                          </Dropdown.Item>
                        )}
                        {showDelete && (
                          <Dropdown.Item
                            className="meat-dropdown"
                            onClick={() => onDelete(entry)}
                          >
                            Delete
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>

                {columns.map((col, i) => (
                  <div key={i} className="mobile-card-item">
                    <span className="mobile-card-label">{col.label}:</span>{" "}
                    <span className="mobile-card-value">
                      {col.accessor === "status" ? (
                        <span
                          className={`status-badge ${entry[col.accessor]
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
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
                        entry[col.accessor]
                      )}
                    </span>
                  </div>
                ))}

                <div className="mobile-card-view-btn mt-2 text-end">
                  <button
                    className="custom-app-button"
                    onClick={() => onRowClick(entry)}
                  >
                    👁 View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-4">No entries found.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default EntryStates;
