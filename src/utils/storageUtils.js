// Retrieve data from localStorage with a default fallback
export function getStoredData(key, defaultValue) {
  const storedData = localStorage.getItem(key);
  try {
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

// Save data to localStorage
export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Delete a specific transaction from localStorage
export function deleteTransaction(key, transactionId) {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    parsedData.transactions = parsedData.transactions.filter(
      (transaction) => transaction.id !== transactionId
    );
    localStorage.setItem(key, JSON.stringify(parsedData));
  }
}

// Initialize graphData in localStorage if not present
export function initializeGraphData() {
  const graphData = getStoredData("graphData", null);
  if (!graphData) {
    const defaultGraphData = [
    ];
    saveData("graphData", defaultGraphData);
  }
}
