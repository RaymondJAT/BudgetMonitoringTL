import { useEffect, useState } from "react";
import ToolBar from "../components/ToolBar";
import { Container, Table } from "react-bootstrap";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_TRASH = "trashData";

const Trash = () => {
  const [trashItems, setTrashItems] = useState([]);

  // Load trash on mount
  useEffect(() => {
    const storedTrash = JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];
    setTrashItems(storedTrash);
  }, []);

  const handleRestore = (item) => {
    const updatedTrash = trashItems.filter((t) => t.id !== item.id);
    setTrashItems(updatedTrash);
    localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(updatedTrash));

    const activeData = JSON.parse(localStorage.getItem(LOCAL_KEY_ACTIVE)) || [];
    const updatedActive = [...activeData, item];
    localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(updatedActive));
  };

  const handlePermanentDelete = (item) => {
    const updatedTrash = trashItems.filter((t) => t.id !== item.id);
    setTrashItems(updatedTrash);
    localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(updatedTrash));
  };

  return (
    <div>
      <ToolBar />
      <Container fluid>
        {trashItems.length === 0 ? (
          <p>No deleted entries.</p>
        ) : (
          <Table
            border="1"
            cellPadding="10"
            style={{ width: "100%", marginTop: "10px" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trashItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.employee}</td>
                  <td>{item.status}</td>
                  <td>{item.amount}</td>
                  <td>
                    <button onClick={() => handleRestore(item)}>Restore</button>{" "}
                    <button
                      onClick={() => handlePermanentDelete(item)}
                      style={{ color: "red" }}
                    >
                      Delete Forever
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default Trash;
