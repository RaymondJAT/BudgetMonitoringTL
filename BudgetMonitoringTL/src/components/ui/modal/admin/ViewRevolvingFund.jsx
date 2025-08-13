import { useState } from "react";

import { Modal, Row, Col, Container } from "react-bootstrap";

import AppButton from "../../AppButton";
import ToolBar from "../../../layout/ToolBar";
import AllocationTable from "../../../layout/AllocationTable";

const ViewRevolvingFund = ({ show, onHide, budgetId, tableData = [] }) => {
  const budgetItem = tableData.find((item) => item.id === budgetId);
  const {
    revolvingFund,
    amount = 0,
    used = 0,
    transactions = [],
  } = budgetItem || {};

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        dialogClassName="modal-xl"
        centered
        scrollable
      >
        <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
          <Modal.Title
            className="text-uppercase"
            style={{ letterSpacing: "4px" }}
          >
            {revolvingFund}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          className="cashreq-scroll"
          style={{ backgroundColor: "#800000" }}
        ></Modal.Body>
        <Container>ViewRevolvingFund</Container>
      </Modal>
    </>
  );
};

export default ViewRevolvingFund;
