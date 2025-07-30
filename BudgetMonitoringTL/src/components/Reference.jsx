const Reference = ({ data }) => {
  return (
    <div className="custom-container border p-3 rounded h-100">
      <p className="small-input fw-bold mb-1">Transportation Reference</p>
      {data?.transportReferences?.length > 0 ? (
        <ul className="list-unstyled">
          {data.transportReferences.map((item, index) => (
            <li key={index} className="mb-3 border-bottom pb-2">
              <div>
                <strong>From:</strong> {item.from}
              </div>
              <div>
                <strong>To:</strong> {item.to}
              </div>
              <div>
                <strong>Amount:</strong> ₱{item.amount}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="small-input text-muted">
          No transportation data available.
        </p>
      )}
    </div>
  );
};

export default Reference;
