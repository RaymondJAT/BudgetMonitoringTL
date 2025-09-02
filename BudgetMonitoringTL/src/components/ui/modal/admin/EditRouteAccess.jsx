import { useState, useEffect } from "react";
import { Modal, Spinner, Alert } from "react-bootstrap";
import AppButton from "../../AppButton";
import DataTable from "../../../layout/DataTable";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";

const EditRouteAccess = ({ show, onHide, accessId }) => {
  const [routeAccessList, setRouteAccessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];

      const mapped = data.map((item) => ({
        id: item.id,
        route: item.name,
        access: item.status,
      }));

      setRouteAccessList(mapped);
    } catch (err) {
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

  const columns = [
    { label: "Route", accessor: "route" },
    {
      label: "Access",
      accessor: "access",
      Cell: ({ row }) => {
        const rowData = row.original || row;
        return (
          <Select
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            value={{
              value: rowData.access.toLowerCase(),
              label:
                rowData.access.charAt(0).toUpperCase() +
                rowData.access.slice(1),
            }}
            onChange={(selected) => {
              const updated = routeAccessList.map((r) =>
                r.id === rowData.id
                  ? { ...r, access: selected?.value ?? "inactive" }
                  : r
              );
              setRouteAccessList(updated);
            }}
            styles={customStyles}
            isClearable
          />
        );
      },
    },
  ];

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = routeAccessList.map((r) => ({
        id: r.id,
        status: r.access,
      }));

      const res = await fetch("/api5012/route_access/update_route_access", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }),
      });

      if (!res.ok) throw new Error("Failed to update route access");

      alert("Route access updated successfully!");
      onHide();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save changes");
    }
  };

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
        <AppButton
          label="Save Changes"
          variant="outline-success"
          onClick={handleSave}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default EditRouteAccess;
