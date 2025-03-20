import { STOCKS } from "./stockData.js";

class StockDataManager {
    constructor(stocks) {
        this.stocks = stocks;
    }

    async fetchStockDataFromCSV(csvUrl) {
        try {
            const response = await fetch(csvUrl);
            const text = await response.text();
            const rows = text.split("\n").map(row => row.split(","));

            // Convert CSV rows to stock data objects
            const stockData = rows.slice(1).map(row => ({
                symbol: row[0].trim(),
                currentPrice: parseFloat(row[1]) || 0 // Avoid NaN errors
            }));

            return this.mergeStockData(stockData);
        } catch (error) {
            console.error("Error fetching stock data:", error);
            return this.stocks.map(stock => ({ ...stock, currentPrice: 0 }));
        }
    }

    mergeStockData(liveData) {
        return this.stocks.map(stock => {
            const liveStock = liveData.find(s => s.symbol === stock.symbol);
            return {
                ...stock,
                currentPrice: liveStock ? liveStock.currentPrice : 0,
                changePercent: this.simulateChangePercent(),
                marketCap: this.simulateMarketCap(),
                status: this.determineStockStatus(liveStock ? liveStock.currentPrice : 0)
            };
        });
    }

    simulateChangePercent() {
        return parseFloat((Math.random() * 4 - 2).toFixed(2)); // Random -2% to +2%
    }

    simulateMarketCap() {
        return Math.floor(Math.random() * 50000) + 10000; // ₹10,000 Cr to ₹60,000 Cr
    }

    determineStockStatus(currentPrice) {
        if (currentPrice === 0) return "N/A"; // No data
        return currentPrice > 1000 ? "Buy" : currentPrice > 500 ? "Hold" : "Sell";
    }
    document.addEventListener("DOMContentLoaded", () => {
    console.log("Stock Portfolio Tracker Loaded!");
});

}


export const stockManager = new StockDataManager(STOCKS);
