import React from "react";
import { Table, Card } from "react-bootstrap";

const TeamLead = () => {
  return (
    <Card className="w-auto">
      <Card.Header as="h5" className="text-center">
        Approval Table
      </Card.Header>
      <Card.Body className="p-0">
        <Table hover className="admin-table m-0">
          <thead>
            <tr className="text-center">
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
          <tbody></tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default TeamLead;
