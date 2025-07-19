import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { getStoredData, initializeGraphData } from "../utils/storageUtils";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function logLocalStorage() {
  console.log("Local Storage Contents:");
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      try {
        console.log(`${key}:`, JSON.parse(localStorage.getItem(key)));
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
      }
    }
  }
}

function Home() {
  const [allData, setAllData] = useState(() =>
    getStoredData("transactionData", { Expenses: 0, Income: 0, Remaining: 0, transactions: [] })
  );

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    logLocalStorage(); // Log local storage contents for debugging

    const storedData = getStoredData("transactionData", {
      Expenses: 0,
      Income: 0,
      Remaining: 0,
      transactions: [],
    });
    setAllData(storedData);

    // Calculate graphData for the last 30 days
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

    storedData.transactions.forEach((transaction) => {
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

    setGraphData(last30Days.reverse()); // Ensure the graph data is in chronological order
  }, []);

  return (
    <div>
      <div className="mt-16 mx-31">
        <h1 className="text-4xl font-bold mb-4">Welcome, [Name]</h1>
        <p className="text-blue-100">This is your Financial Overview Report</p>
      </div>
      <div className="my-3 mx-31 flex gap-3">
        <select className="bg-blue-200 rounded-md text-black px-3 py-2">
          <option>All accounts</option>
        </select>
        <select className="bg-blue-200 rounded-md text-black px-3 py-2">
          <option>Jan 1 - Feb 1, 2025</option>
        </select>
      </div>

      <section className="grid grid-cols-3 gap-8 text-black mx-31 my-1">
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <div className="flex justify-between mb-4">
            <div>
              <h1 className="font-bold text-xl">Remaining</h1>
              <p className="text-sm">Jan 1 - Feb 1, 2025</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg p-2">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-2xl mb-2">${allData.Remaining}</h1>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl">
          <div className="flex justify-between mb-4">
            <div>
              <h1 className="font-bold text-xl">Income</h1>
              <p className="text-sm">Jan 1 - Feb 1, 2025</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg p-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-2xl mb-2">${allData.Income}</h1>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl">
          <div className="flex justify-between mb-4">
            <div>
              <h1 className="font-bold text-xl">Expenses</h1>
              <p className="text-sm">Jan 1 - Feb 1, 2025</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg p-2">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-2xl mb-2">${allData.Expenses}</h1>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl col-span-2 font-bold text-xl">
          Transactions
          {graphData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Income" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Expenses" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available for the graph.</p>
        )}
        </div>
        <div className="bg-white p-4 rounded-xl font-bold text-xl">
          Categories
        </div>
      </section>
    </div>
  );
}

export default Home;
