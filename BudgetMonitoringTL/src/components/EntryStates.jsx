import { useState, useEffect } from "react";
import { Container, Table, Form } from "react-bootstrap";
import AppButton from "../components/AppButton";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_TRASH = "trashData";

const EntryStates = ({ trashItems, setTrashItems }) => {
  const [selectedRows, setSelectedRows] = useState({});
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    // Initialize selection when trashItems change
    const initialSelection = {};
    trashItems.forEach((item) => {
      initialSelection[item.id] = false;
    });
    setSelectedRows(initialSelection);
    setAllSelected(false);
  }, [trashItems]);

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
    setAllSelected(Object.values(updated).every((val) => val));
  };

  const handlePermanentDelete = (item) => {
    const updatedTrash = trashItems.filter((t) => t.id !== item.id);
    setTrashItems(updatedTrash);
    localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(updatedTrash));
  };

  const handleRestore = (item) => {
    const updatedTrash = trashItems.filter((t) => t.id !== item.id);
    setTrashItems(updatedTrash);
    localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(updatedTrash));

    const activeData = JSON.parse(localStorage.getItem(LOCAL_KEY_ACTIVE)) || [];
    const updatedActive = [...activeData, item];
    localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(updatedActive));
  };

  const trashColumns = [
    { header: "Employee", accessor: "employee" },
    { header: "Department", accessor: "department" },
    { header: "Description", accessor: "description" },
    { header: "Category", accessor: "category" },
    // { header: "Paid By", accessor: "paidBy" },
    { header: "Total", accessor: "total" },
    { header: "Status", accessor: "status" },
  ];

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
              {trashColumns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trashItems.length > 0 ? (
              trashItems.map((entry) => (
                <tr key={entry.id}>
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
                  {trashColumns.map((col, i) => (
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
                  <td
                    style={{
                      width: "160px",
                      paddingRight: "0.75rem",
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <AppButton
                        label="Restore"
                        variant="success"
                        size="sm"
                        className="trash-button btn-responsive"
                        onClick={() => handleRestore(entry)}
                      />
                      <AppButton
                        label="Delete"
                        variant="danger"
                        size="sm"
                        className="trash-button btn-responsive"
                        onClick={() => handlePermanentDelete(entry)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={trashColumns.length + 2} className="text-center">
                  No deleted entries.
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
