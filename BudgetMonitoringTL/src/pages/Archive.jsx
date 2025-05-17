import ToolBar from "../components/ToolBar";
import DataTable from "../components/DataTable";
import { mockData } from "../mock-data/mockData";

const columns = [
  { header: "Employee", accessor: "employee" },
  { header: "Department", accessor: "department" },
  { header: "Description", accessor: "description" },
  { header: "Category", accessor: "category" },
  { header: "Paid By", accessor: "paidby" },
  { header: "Total", accessor: "total" },
  { header: "Status", accessor: "status" },
];

const Archive = () => {
  // Only show items with status "Archived"
  const archivedData = mockData.filter((entry) => entry.status === "Archived");

  const handleRowClick = (entry) => {
    console.log("Archived row clicked:", entry);
  };

  return (
    <div>
      <ToolBar />
      <div>
        <DataTable
          data={archivedData}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default Archive;
