// Replace with your Google Sheets published CSV link
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ww8fOrw18Wy8mbst28S_lW7mKr-gfgbk0y3oOL-8yg8FH7a3g-adq_BiDFc3UqETJtmV7WscIVDc/pub?gid=894347633&single=true&output=csv";

// Fetch stock data from Google Sheets
async function fetchStockData() {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const csvText = await response.text();
        const rows = csvText.split("\n").slice(1); // Remove headers
        let stockTable = document.getElementById("stock-table");
        stockTable.innerHTML = "";

        let totalValue = 0;
        let totalGainLoss = 0;

        rows.forEach(row => {
            let cols = row.split(",");
            if (cols.length < 4) return;

            let [stockName, price, change, marketCap] = cols;
            price = parseFloat(price);
            change = parseFloat(change);

            totalValue += price;
            totalGainLoss += (price * change) / 100;

            let status = change >= 0 ? "🟢 Up" : "🔴 Down";

            let rowHtml = `
                <tr>
                    <td>${stockName}</td>
                    <td>₹${price.toFixed(2)}</td>
                    <td style="color: ${change >= 0 ? 'green' : 'red'};">${change.toFixed(2)}%</td>
                    <td>${marketCap}</td>
                    <td>${status}</td>
                </tr>
            `;
            stockTable.innerHTML += rowHtml;
        });

        document.getElementById("total-value").textContent = `₹${totalValue.toFixed(2)}`;
        document.getElementById("total-gain-loss").textContent = `₹${totalGainLoss.toFixed(2)}`;

    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

// Filter stocks based on search input
function filterStocks() {
    let searchValue = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#stock-table tr");

    rows.forEach(row => {
        let stockName = row.cells[0].textContent.toLowerCase();
        row.style.display = stockName.includes(searchValue) ? "" : "none";
    });
}

// Fetch data on load
window.onload = fetchStockData;
