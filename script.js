const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ww8fOrw18Wy8mbst28S_lW7mKr-gfgbk0y3oOL-8yg8FH7a3g-adq_BiDFc3UqETJtmV7WscIVDc/pub?gid=894347633&single=true&output=csv";

async function fetchStockData() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        const rows = csvText.split("\n").map(row => row.split(","));

        // Assuming first row is headers
        const headers = rows.shift();
        const stockData = rows.map(row => ({
            stock: row[0]?.trim() || "Unknown",
            price: parseFloat(row[1]) || 0,
            change: parseFloat(row[2]) || 0,
            marketCap: row[3]?.trim() || "N/A",
        }));

        updateTable(stockData);
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

function updateTable(data) {
    const tableBody = document.getElementById("stockTableBody");
    tableBody.innerHTML = ""; // Clear old data

    data.forEach(stock => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${stock.stock}</td>
            <td>₹${stock.price.toFixed(2)}</td>
            <td>${stock.change.toFixed(2)}%</td>
            <td>${stock.marketCap}</td>
            <td>${stock.change >= 0 ? "🟢 Up" : "🔴 Down"}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch data on page load and on "Refresh Data" button click
document.getElementById("refreshButton").addEventListener("click", fetchStockData);
fetchStockData();
