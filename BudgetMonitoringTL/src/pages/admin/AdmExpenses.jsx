import { useMemo, useState } from "react";
import ToolBar from "../../components/layout/ToolBar";

const AdmExpenses = () => {
  const [searchValue, setSearchValue] = useState("");

  //   const filteredData = useMemo(
  //     () =>
  //       tableData
  //         .filter(
  //           (item) =>
  //             item.status !== STATUS.APPROVED && item.status !== STATUS.REJECTED
  //         )
  //         .filter((item) => isMatch(item, searchValue, columns)),
  //     [tableData, searchValue]
  //   );

  return (
    <>
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
    </>
  );
};

export default AdmExpenses;
