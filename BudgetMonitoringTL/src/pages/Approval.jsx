import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { mockData } from "../mock-data/mockData";

const Approval = () => {
  const location = useLocation();
  const approvedData = location.state?.approvedData || [];
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [data, setData] = useState(mockData);

  // delete button function
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prevData) => {
          const rowsToDelete = filteredData.filter((row) =>
            selectedRows.includes(row)
          );
          const updatedData = prevData.filter(
            (row) => !rowsToDelete.includes(row)
          );
          setSelectedRows([]);
          return updatedData;
        });

        Swal.fire({
          title: "Deleted!",
          text: "Selected items have been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    });
  };

  // react-to-print
  const handlePrint = () => {
    reactToPrintFn();
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredData = useMemo(() => {
    return data
      .filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter(
        (row) =>
          selectedStatuses.length === 0 || selectedStatuses.includes(row.status)
      );
  }, [searchTerm, selectedStatuses, data]);

  return (
    <div>
      <Header
        selectedRows={selectedRows}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handlePrint={handlePrint}
        handleDelete={handleDelete}
      />
      <h2>My Approvals</h2>
      {approvedData.length === 0 ? (
        <p>No approved items available.</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Description</th>
              <th>Expense Date</th>
              <th>Category</th>
              <th>Paid By</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {approvedData.map((row, index) => (
              <tr key={index}>
                <td>{row.employee}</td>
                <td>{row.department}</td>
                <td>{row.description}</td>
                <td>{row.expenseDate}</td>
                <td>{row.category}</td>
                <td>{row.paidBy}</td>
                <td>
                  ₱
                  {row.total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td>
                  <span className={`status-badge approved`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Approval;
