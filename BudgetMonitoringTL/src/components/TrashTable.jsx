import React from "react";
import { Card } from "react-bootstrap";

const TrashTable = ({
  data,
  selectedRows,
  handleCheckBoxChange,
  handleSelectAll,
}) => {
  return (
    <Card className="w-auto">
      <Card.Body className="p-0">
        <div className="content-containers">
          <div className="content-container">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>
                      {/* Select All Checkbox */}
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedRows.length === data.length && data.length > 0
                        }
                      />
                    </th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Description</th>
                    <th>Expense Date</th>
                    <th>Category</th>
                    <th>Paid By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => {
                    const isSelected = selectedRows.includes(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`custom-table-row text-center ${
                          isSelected ? "highlighted-row" : ""
                        }`}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => handleCheckBoxChange(row.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td>{row.employee}</td>
                        <td>{row.department}</td>
                        <td>{row.description}</td>
                        <td>{row.expenseDate}</td>
                        <td>{row.category}</td>
                        <td>{row.paidBy}</td>
                        <td>{row.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TrashTable;
