import { useContext } from "react";
import { TotalContext } from "../context/TotalContext";

export const useTotalData = () => {
  const context = useContext(TotalContext);
  if (!context) {
    throw new Error("useTotalData must be used within a TotalProvider");
  }
  return context;
};
