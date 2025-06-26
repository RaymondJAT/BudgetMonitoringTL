import { useState } from "react";
import ToolBar from "../../components/layout/ToolBar";
import TotalForAdmin from "../../components/layout/TotalAdmin";

const AdmExpenses = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <TotalForAdmin />
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
    </>
  );
};

export default AdmExpenses;
