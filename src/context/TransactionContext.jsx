import { createContext, useState, useEffect } from "react";

export const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [allData, setAllData] = useState(() => {
    const storedData = localStorage.getItem("transactionData");
    console.log("Initializing context with stored data:", storedData); // Debugging
    return storedData ? JSON.parse(storedData) : { Expenses: 0, Income: 0, Remaining: 0 };
  });

  useEffect(() => {
    console.log("Updating localStorage with:", allData); // Debugging
    localStorage.setItem("transactionData", JSON.stringify(allData));
  }, [allData]);

  return (
    <TransactionContext.Provider value={{ allData, setAllData }}>
      {children}
    </TransactionContext.Provider>
  );
}