'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RealTimeMarketOverview from './components/RealTimeMarketOverview';
import StockSearchBar from './components/StockSearchBar';
import InteractiveStockChart from './components/InteractiveStockChart';
import AIStockInsights from './components/AIStockInsights';
import FundamentalsFinancials from './components/FundamentalsFinancials';

const TechnicalAnalysisPage = () => {
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [stockData, setStockData] = useState<any>(null);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    // Fetch stock data here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Technical Analysis Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive stock analysis with real-time data, AI insights, and interactive charts
          </p>
        </div>

        {/* Stock Search */}
        <StockSearchBar onStockSelect={handleStockSelect} selectedStock={selectedStock} />

        {/* Real-Time Market Overview */}
        <RealTimeMarketOverview />

        {/* Main Analysis Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Interactive Chart - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <InteractiveStockChart symbol={selectedStock} />
          </div>

          {/* AI Insights - Takes 1 column */}
          <div className="xl:col-span-1">
            <AIStockInsights symbol={selectedStock} />
          </div>
        </div>

        {/* Fundamentals & Financials */}
        <FundamentalsFinancials symbol={selectedStock} />
      </motion.div>
    </div>
  );
};

export default TechnicalAnalysisPage;