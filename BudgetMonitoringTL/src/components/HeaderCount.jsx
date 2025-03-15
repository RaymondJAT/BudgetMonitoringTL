import React from "react";

const HeaderCount = ({ pendingCount, approvedCount, postCount }) => {
  return (
    <div className="text-center bg-white border-bottom p-3">
      <div className="approval-steps">
        <div className="step">
          <div className="count">{pendingCount}</div>
          <span>To Approve</span>
        </div>
        <div className="step">
          <div className="count">{approvedCount}</div>
          <span>Waiting Reimbursement</span>
        </div>
        <div className="step">
          <div className="count">{postCount}</div>
          <span>In Payment</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderCount;
