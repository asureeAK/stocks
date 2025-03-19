import { stockManager } from "./app.js";

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ww8fOrw18Wy8mbst28S_lW7mKr-gfgbk0y3oOL-8yg8FH7a3g-adq_BiDFc3UqETJtmV7WscIVDc/pub?gid=894347633&single=true&output=csv"; // 🔹 Replace with your actual published CSV URL

async function fetchStockData() {
    const stocks = await stockManager.fetchStockDataFromCSV(SHEET_CSV_URL);
    updateStockTable(stocks);
    updatePortfolioSummary(stocks);
}

function updateStockTable(stocks) {
    const stockTableBody = document.getElementById("stockTableBody");
    stockTableBody.innerHTML = stocks.map(stock => `
        <tr class="border-b" data-symbol="${stock.symbol}">
            <td class="p-3">${stock.name} (${stock.symbol})</td>
            <td class="p-3 text-right current-price">₹${stock.currentPrice.toFixed(2)}</td>
            <td class="p-3 text-right ${stock.changePercent > 0 ? 'text-green-600' : 'text-red-600'}">
                ${stock.changePercent}%
            </td>
            <td class="p-3 text-right">₹${stock.marketCap} Cr</td>
            <td class="p-3 text-center status-${stock.status}">${stock.status}</td>
        </tr>
    `).join("");
}

function updatePortfolioSummary(stocks) {
    const totalValue = stocks.reduce((sum, stock) => sum + stock.currentPrice, 0);
    const totalGain = stocks.reduce((sum, stock) => sum + (stock.changePercent * stock.currentPrice / 100), 0);

    document.getElementById("totalValue").textContent = `₹${totalValue.toFixed(2)}`;
    document.getElementById("totalGain").textContent = `₹${totalGain.toFixed(2)}`;
}

document.getElementById("refreshBtn").addEventListener("click", fetchStockData);
document.getElementById("searchInput").addEventListener("input", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll("#stockTableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? "" : "none";
    });
});

// 🔹 Auto-load stock data when the page loads
fetchStockData();
