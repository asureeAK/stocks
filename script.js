// ✅ Google Sheets CSV Link
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ww8fOrw18Wy8mbst28S_lW7mKr-gfgbk0y3oOL-8yg8FH7a3g-adq_BiDFc3UqETJtmV7WscIVDc/pub?gid=894347633&single=true&output=csv";

// ✅ Fetch stock data from Google Sheets
async function fetchStockData() {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const csvText = await response.text();
        const rows = csvText.split("\n").map(row => row.split(",")); // Convert CSV to array
        const headers = rows[0]; // Extract column names
        const dataRows = rows.slice(1); // Skip header row

        let stockTable = document.getElementById("stock-table");
        stockTable.innerHTML = ""; // Clear table before inserting new data

        let totalValue = 0;
        let totalGainLoss = 0;

        dataRows.forEach(cols => {
            if (cols.length < 12) return; // Ensure all columns exist

            let [highLow, stockName, sector, price, change, weekHigh, lowPercent, weekLow, highPercent, peRatio, marketCap, eps, lowBased] = cols;

            price = parseFloat(price);
            change = parseFloat(change);
            marketCap = marketCap.trim(); // Remove spaces
            peRatio = peRatio.trim();
            eps = eps.trim();

            totalValue += price;
            totalGainLoss += (price * change) / 100;

            let status = change >= 0 ? "🟢 Up" : "🔴 Down";

            let rowHtml = `
                <tr>
                    <td>${highLowPercent}%</td>
                    <td>${stockName}</td>
                    <td>${sector}</td>
                    <td>${nseBse}</td>
                    <td>₹${price.toFixed(2)}</td>
                    <td style="color: ${change >= 0 ? 'green' : 'red'};">${change.toFixed(2)}%</td>
                    <td>${weekHigh}</td>
                    <td>${lowPercent}%</td>
                    <td>${weekLow}</td>
                    <td>${highPercent}%</td>
                    <td>${peRatio}</td>
                    <td>${marketCapCore}</td>
                    <td>${eps}</td>
                    <td>${lowBased}%</td>
                </tr>

            `;
            stockTable.innerHTML += rowHtml;
        });

//        document.getElementById("total-value").textContent = `₹${totalValue.toFixed(2)}`;
//        document.getElementById("total-gain-loss").textContent = `₹${totalGainLoss.toFixed(2)}`;

    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

// ✅ Filter stocks dynamically
function filterStocks() {
    let searchValue = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#stock-table tr");

    rows.forEach(row => {
        let stockName = row.cells[0].textContent.toLowerCase();
        row.style.display = stockName.includes(searchValue) ? "" : "none";
    });
}

// ✅ Fetch data on page load
window.onload = fetchStockData;
