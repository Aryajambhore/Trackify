import { useState, useEffect } from "react";
import { Trash2, X, Plus, Minus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getStoredData, saveData, deleteTransaction, initializeGraphData } from "../utils/storageUtils";

function Transaction() {
  const [allData, setAllData] = useState(() =>
    getStoredData("transactionData", { Expenses: 0, Income: 0, Remaining: 0, transactions: [] })
  );
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState(true);
  const [transaction, setTransaction] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [payee, setPayee] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    initializeGraphData(); // Ensure graphData is initialized
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionAmount = parseFloat(transaction);
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      alert("Please enter a valid transaction amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type: transactionType ? "Income" : "Expense",
      amount: transactionAmount,
      date: startDate.toISOString(),
      category,
      account,
      payee,
      note,
    };

    const updatedData = transactionType
      ? {
          ...allData,
          Income: allData.Income + transactionAmount,
          Remaining: allData.Remaining + transactionAmount,
          transactions: [...allData.transactions, newTransaction],
        }
      : {
          ...allData,
          Expenses: allData.Expenses + transactionAmount,
          Remaining: allData.Remaining - transactionAmount,
          transactions: [...allData.transactions, newTransaction],
        };

    setAllData(updatedData);
    saveData("transactionData", updatedData);

    try {
      // Calculate graph data for the last 30 days
      const today = new Date();
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return {
          date: date.toISOString().split("T")[0],
          Income: 0,
          Expenses: 0,
        };
      });

      updatedData.transactions.forEach((transaction) => {
        const transactionDate = transaction.date.split("T")[0];
        const dayEntry = last30Days.find((entry) => entry.date === transactionDate);
        if (dayEntry) {
          if (transaction.type === "Income") {
            dayEntry.Income += transaction.amount;
          } else if (transaction.type === "Expense") {
            dayEntry.Expenses += transaction.amount;
          }
        }
      });

      const filteredGraphData = last30Days.reverse(); // Ensure the graph data is in chronological order
      saveData("graphData", filteredGraphData);
    } catch (error) {
      console.error("Error updating graph data:", error);
    }

    setTransaction(0);
    setCategory("");
    setAccount("");
    setPayee("");
    setNote("");
  };

  const handleDelete = (transactionId) => {
    const transactionToDelete = allData.transactions.find(
      (transaction) => transaction.id === transactionId
    );

    const updatedTransactions = allData.transactions.filter(
      (transaction) => transaction.id !== transactionId
    );

    const updatedIncome = updatedTransactions
      .filter((transaction) => transaction.type === "Income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const updatedExpenses = updatedTransactions
      .filter((transaction) => transaction.type === "Expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const updatedRemaining = updatedIncome - updatedExpenses;

    const updatedData = {
      ...allData,
      Income: updatedIncome,
      Expenses: updatedExpenses,
      Remaining: updatedRemaining,
      transactions: updatedTransactions,
    };

    setAllData(updatedData);
    saveData("transactionData", updatedData);

    try {
      const graphData = getStoredData("graphData", []);
      const month = new Date(transactionToDelete.date).toLocaleString("default", { month: "short" });
      const updatedGraphData = graphData.map((entry) =>
        entry.name === month
          ? {
              ...entry,
              Income: transactionToDelete.type === "Income" ? entry.Income - transactionToDelete.amount : entry.Income,
              Expenses: transactionToDelete.type === "Expense" ? entry.Expenses - transactionToDelete.amount : entry.Expenses,
            }
          : entry
      );
      saveData("graphData", updatedGraphData);
    } catch (error) {
      console.error("Error updating graph data:", error);
    }

    deleteTransaction("transactionData", transactionId);
  };

  const toggleTransactionType = () => {
    setTransactionType(!transactionType);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      {isOpen && (
        <div className="fixed text-black top-0 right-0 h-full w-120 bg-white shadow-lg z-40 p-6 ">
          <div className="flex justify-between items-center ">
            <h2 className="text-2xl text-black font-bold mb-4">
              Add Transaction
            </h2>
            <X
              className="text-black w-5 h-5 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="space-y-4">
            <div>
              <p className="mb-1">Add a new transaction</p>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                wrapperClassName="w-full"
                className="w-full p-2 border rounded-lg"
                dateFormat="dd-MM-yyyy"
                placeholderText="Select a date"
              />
            </div>

            <div>
              <h1 className="text-md mb-1">Account</h1>
              <select
                className="w-full p-2 border rounded-lg"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              >
                <option value="">Select an account</option>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div>
              <h1 className="text-md mb-1">Category</h1>
              <select
                className="w-full p-2 border rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
            <div>
              <h1 className="text-md mb-1">Payee</h1>
              <input
                className="w-full p-2 border rounded-lg"
                placeholder="Add a Payee"
                type="text"
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
              />
            </div>
            <div>
              <h1 className="text-md mb-1">Amount</h1>
              <div className="relative w-full">
                {transactionType ? (
                  <Plus
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 bg-green-200 rounded-sm w-7 h-7"
                    onClick={toggleTransactionType}
                  />
                ) : (
                  <Minus
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 bg-red-200 rounded-sm w-7 h-7"
                    onClick={toggleTransactionType}
                  />
                )}
                <input
                  className="w-full py-2 pl-12 border rounded-lg"
                  placeholder="e.g. $ 250.00"
                  type="number"
                  value={transaction}
                  onChange={(e) => setTransaction(e.target.value)}
                ></input>
              </div>
            </div>
            <div>
              <h1 className="mb-1">Notes</h1>
              <textarea
                placeholder="Optional notes"
                className="w-full p-2 border rounded-lg resize-none h-20"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 w-full text-white rounded-md p-2"
              onClick={handleSubmit}
            >
              Add
            </button>
          </div>
        </div>
      )}
      <div className="p-8">
        <div className="flex justify-between my-8">
          <h1 className="text-lg font-bold">Transaction History</h1>
          <button
            onClick={toggleSidebar}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            Add new
          </button>
        </div>
        <div className="flex justify-between">
          <input className="border-white px-2" placeholder="Search"></input>
        </div>
        <div className="mt-4">
          {allData.transactions && allData.transactions.length > 0 ? (
            <ul className="space-y-4">
              {allData.transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-bold">{transaction.type}</p>
                    <p>${transaction.amount}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">Category: {transaction.category}</p>
                    <p className="text-sm text-gray-500">Account: {transaction.account}</p>
                    <p className="text-sm text-gray-500">Payee: {transaction.payee}</p>
                    <p className="text-sm text-gray-500">Notes: {transaction.note}</p>
                  </div>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </div>
    </>
  );
}
export default Transaction;
