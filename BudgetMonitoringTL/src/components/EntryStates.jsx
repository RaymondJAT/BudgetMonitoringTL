import { useState, useEffect } from "react";
import { Container, Table, Form } from "react-bootstrap";
import AppButton from "../components/AppButton";

const EntryStates = ({
  columns,
  items,
  onRowClick,
  showRestore = false,
  showDelete = false,
  onRestore,
  onDelete,
}) => {
  const [selectedRows, setSelectedRows] = useState({});
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    const initialSelection = {};
    items.forEach((item) => {
      initialSelection[item.id] = false;
    });
    setSelectedRows(initialSelection);
    setAllSelected(false);
  }, [items]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelection = {};
    Object.keys(selectedRows).forEach((id) => {
      newSelection[id] = checked;
    });
    setSelectedRows(newSelection);
    setAllSelected(checked);
  };

  const handleRowCheck = (id) => {
    const updated = { ...selectedRows, [id]: !selectedRows[id] };
    setSelectedRows(updated);
    setAllSelected(Object.values(updated).every(Boolean));
  };

  return (
    <Container fluid>
      <div className="trash-wrapper">
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
                <th key={index}>{col.header}</th>
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
                    selectedRows[entry.id] ? "highlighted-row" : ""
                  }`}
                >
                  <td
                    style={{ width: "40px", paddingLeft: "0.5rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows[entry.id] || false}
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
      </div>
    </Container>
  );
};

export default EntryStates;
