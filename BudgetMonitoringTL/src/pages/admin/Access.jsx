import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import DataTable from "../../components/layout/DataTable";
import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";
import { FaEdit, FaCog, FaPlus } from "react-icons/fa";
import NewAccess from "../../components/ui/modal/admin/NewAccess";
import EditAccess from "../../components/ui/modal/admin/EditAccess";
import EditRouteAccess from "../../components/ui/modal/admin/EditRouteAccess";

const Access = () => {
  const [accessList, setAccessList] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState(null);
  const [showEditRouteModal, setShowEditRouteModal] = useState(false);

  const token = localStorage.getItem("token");

  const columns = [
    { label: "ID", accessor: "id" },
    { label: "Access Name", accessor: "name" },
    { label: "Status", accessor: "status" },
    { label: "Created At", accessor: "createdAt" },
    { label: "Created By", accessor: "createdBy" },
    {
      label: "Actions",
      accessor: "actions",
      Cell: ({ row }) => {
        const rowData = row.original || row;
        return (
          <div className="d-flex gap-1 justify-content-center">
            <AppButton
              label={<FaEdit />}
              variant="outline-dark"
              className="custom-app-button"
              onClick={() => {
                setSelectedAccess(rowData);
                setShowEditModal(true);
              }}
            />
            <AppButton
              label={<FaCog />}
              variant="outline-secondary"
              className="custom-app-button"
              onClick={() => {
                setSelectedAccess(rowData);
                setShowEditRouteModal(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  const fetchData = async () => {
    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api5012/access/getaccess_table", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch access list");

      const result = await res.json();
      const mapped = (result.data || []).map((a) => ({
        id: a.id,
        name: a.name,
        status: a.status ? a.status.toLowerCase() : "active",
        statusLabel: a.status
          ? a.status.charAt(0).toUpperCase() + a.status.slice(1)
          : "",
        createdAt: a.created_at,
        createdBy: a.created_by,
      }));

      setAccessList(mapped);
    } catch (error) {
      console.error("Fetch Access error:", error);
      setAccessList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAccess = () => fetchData();
  const handleEditAccess = () => fetchData();

  return (
    <Container fluid className="mt-3">
      <div className="custom-container shadow-sm rounded p-3">
        <ToolBar
          leftContent={
            <AppButton
              label={
                <>
                  <FaPlus />
                  <span className="d-none d-sm-inline ms-1">Access</span>
                </>
              }
              variant="outline-dark"
              size="sm"
              className="custom-app-button"
              onClick={() => setShowNewModal(true)}
            />
          }
          showFilter={false}
        />

        {loading ? (
          <p className="text-muted">Loading access records...</p>
        ) : (
          <DataTable
            data={accessList}
            columns={columns}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            showActions={false}
            showCheckbox={false}
            height="400px"
          />
        )}

        <NewAccess
          show={showNewModal}
          onHide={() => setShowNewModal(false)}
          onAdd={handleAddAccess}
        />

        <EditAccess
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          access={selectedAccess}
          onSuccess={handleEditAccess}
        />

        <EditRouteAccess
          show={showEditRouteModal}
          onHide={() => setShowEditRouteModal(false)}
          accessId={selectedAccess?.id}
          onSuccess={fetchData}
        />
      </div>
    </Container>
  );
};

export default Access;
