import React from "react";

const HeaderCount = ({ pendingTotal, approvedTotal, postTotal }) => {
  return (
    <div className="text-center bg-white border-bottom p-3">
      <div className="approval-steps">
        <div className="step">
          <div className="count">
            ₱
            {pendingTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span>To Approve</span>
        </div>
        <div className="step">
          <div className="count">
            ₱
            {approvedTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <span>Waiting Reimbursement</span>
        </div>
        <div className="step">
          <div className="count">
            ₱{postTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span>In Payment</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderCount;
