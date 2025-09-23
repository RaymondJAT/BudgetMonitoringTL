import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import DataTable from "../../components/layout/DataTable";
import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/buttons/AppButton";
import { FaPlus, FaEdit } from "react-icons/fa";
import NewUser from "../../components/ui/modal/admin/NewUser";
import EditUser from "../../components/ui/modal/admin/EditUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [accessMap, setAccessMap] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const columns = [
    { label: "Employee ID", accessor: "employeeId" },
    { label: "Full Name", accessor: "fullName" },
    { label: "Username", accessor: "username" },
    { label: "Access Level", accessor: "accessLevel" },
    { label: "Status", accessor: "status" },
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
                setSelectedUser({
                  id: rowData.id,
                  employee_id: rowData.employeeId,
                  fullname: rowData.fullName,
                  username: rowData.username,
                  access_id: rowData.accessId,
                  status: rowData.status?.toLowerCase() || "active",
                });
                setShowEditModal(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  //   FETCH
  const fetchData = async () => {
    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // GET ACCESS LIST
      const accessRes = await fetch("/api5001/access/getaccess", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!accessRes.ok) throw new Error("Failed to fetch access list");
      const accessResult = await accessRes.json();
      const map = {};
      (accessResult.data || []).forEach((a) => {
        map[a.id] = a.name;
      });
      setAccessMap(map);

      // GET USERS
      const userRes = await fetch("/api5001/users/getusers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!userRes.ok) throw new Error("Failed to fetch users");
      const userResult = await userRes.json();

      const mapped = (userResult.data || []).map((u) => ({
        id: u.id,
        employeeId: u.employee_id,
        fullName: u.fullname,
        username: u.username,
        accessId: u.access,
        accessLevel: map[u.access] || `#${u.access}`,
        status: u.status
          ? u.status.charAt(0).toUpperCase() + u.status.slice(1)
          : "",
      }));
      setUsers(mapped);
    } catch (error) {
      console.error("Fetch data error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = () => {
    fetchData(); // REFRESH AFTER ADDING
  };

  return (
    <Container fluid className="mt-3">
      <div className="custom-container shadow-sm rounded p-3">
        <ToolBar
          // leftContent={
          //   <AppButton
          //     label={
          //       <>
          //         <FaPlus />
          //         <span className="d-none d-sm-inline ms-1">User</span>
          //       </>
          //     }
          //     variant="outline-dark"
          //     size="sm"
          //     className="custom-app-button"
          //     onClick={() => setShowModal(true)}
          //   />
          // }
          showFilter={false}
        />

        {loading ? (
          <p className="text-muted">Loading users...</p>
        ) : (
          <DataTable
            data={users}
            columns={columns}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            showActions={false}
            showCheckbox={false}
            height="400px"
          />
        )}
      </div>

      <NewUser
        show={showModal}
        onHide={() => setShowModal(false)}
        onAdd={handleAddUser}
      />

      <EditUser
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={selectedUser}
        onSuccess={fetchData}
      />
    </Container>
  );
};

export default Users;
