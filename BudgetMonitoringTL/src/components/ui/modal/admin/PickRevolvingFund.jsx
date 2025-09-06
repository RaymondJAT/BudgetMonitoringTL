import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { customStyles } from "../../../../constants/customStyles";
import AppButton from "../../AppButton";

const PickRevolvingFund = ({ show, onClose, onSelect }) => {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);

  useEffect(() => {
    if (show) {
      setSelectedFund(null);

      const fetchFunds = async () => {
        try {
          const res = await fetch(
            "/api5001/revolving_fund/getrevolving_fund_currently",
            { headers: { "Content-Type": "application/json" } }
          );
          if (!res.ok) throw new Error("Failed to fetch revolving funds");

          const data = await res.json();
          setFunds(
            (data?.data || []).map((fund) => ({
              value: fund.id,
              label: `${fund.name}`,
            }))
          );
        } catch (err) {
          console.error("Error fetching revolving funds:", err);
        }
      };

      fetchFunds();
    }
  }, [show]);

  const handleConfirm = () => {
    if (!selectedFund) return alert("Please select a revolving fund first");
    onSelect(selectedFund.value);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Revolving Fund</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#800000" }}>
        <Select
          options={funds}
          value={selectedFund}
          onChange={setSelectedFund}
          styles={customStyles}
          placeholder="-- Choose a Fund --"
          isClearable
        />
      </Modal.Body>
      <Modal.Footer>
        <AppButton
          label="Cancel"
          variant="outline-danger"
          onClick={onClose}
          size="sm"
          className="custom-app-button"
        />
        <AppButton
          label="Confirm"
          variant="outline-success"
          size="sm"
          onClick={handleConfirm}
          disabled={!selectedFund}
          className="custom-app-button"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default PickRevolvingFund;
