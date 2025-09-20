import { useState, useEffect } from "react";
import { Modal, Spinner, Alert } from "react-bootstrap";
import AppButton from "../../buttons/AppButton";
import DataTable from "../../../layout/DataTable";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";

const accessOptions = [
  { value: "Full Access", label: "Full Access" },
  { value: "No Access", label: "No Access" },
];

const EditRouteAccess = ({ show, onHide, accessId, onSuccess }) => {
  const [routeAccessList, setRouteAccessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  /** Fetch route access list */
  const fetchRouteAccess = async () => {
    if (!accessId) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api5012/route_access/getroute_access_table?access_id=${accessId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to fetch data (${res.status})`);

      const { data } = await res.json();
      const mapped = (Array.isArray(data) ? data : []).map((item) => ({
        id: item.id,
        route: item.name,
        access: item.status || "No Access",
      }));

      setRouteAccessList(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setRouteAccessList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && accessId) {
      fetchRouteAccess();
    }
  }, [show, accessId]);

  /** Update route access */
  const handleUpdate = async (rowData, newStatus) => {
    setSavingId(rowData.id);

    try {
      const token = localStorage.getItem("token");
      const payload = { id: rowData.id, status: newStatus };

      const res = await fetch("/api5012/route_access/update_status", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update route access");

      // Refresh parent or just update local state
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Update error:", err);
      alert(err.message || "Failed to save changes");
    } finally {
      setSavingId(null);
    }
  };

  /** Table columns */
  const columns = [
    { label: "Route", accessor: "route" },
    {
      label: "Access",
      accessor: "access",
      Cell: ({ row }) => {
        const rowData = row.original || row;
        const currentValue = rowData.access || "No Access";

        if (savingId === rowData.id) {
          return <Spinner animation="border" size="sm" />;
        }

        return (
          <Select
            options={accessOptions}
            value={{ value: currentValue, label: currentValue }}
            onChange={(selected) => {
              const newStatus = selected?.value ?? "No Access";
              setRouteAccessList((prev) =>
                prev.map((r) =>
                  r.id === rowData.id ? { ...r, access: newStatus } : r
                )
              );
              handleUpdate(rowData, newStatus);
            }}
            styles={customStyles}
            isClearable={false}
            isDisabled={savingId === rowData.id}
          />
        );
      },
    },
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-lg"
      centered
      scrollable
    >
      <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
        <Modal.Title
          className="text-uppercase"
          style={{ letterSpacing: "4px" }}
        >
          Edit Route Access
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#800000" }}>
        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" variant="light" />
            <div className="mt-2 text-light">Loading route access...</div>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="my-2">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <DataTable
            data={routeAccessList}
            columns={columns}
            showCheckbox={false}
            showActions={false}
            height="425px"
          />
        )}
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
        <AppButton
          label="Close"
          variant="outline-danger"
          onClick={onHide}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default EditRouteAccess;
