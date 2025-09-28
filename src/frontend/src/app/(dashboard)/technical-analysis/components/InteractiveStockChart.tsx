'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Settings } from 'lucide-react';

interface InteractiveStockChartProps {
  symbol: string;
}

const InteractiveStockChart: React.FC<InteractiveStockChartProps> = ({ symbol }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState<string[]>(['SMA', 'Volume']);
  const [isLoading, setIsLoading] = useState(false);

  const timeframes = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'];
  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick' },
    { value: 'line', label: 'Line' },
    { value: 'area', label: 'Area' },
    { value: 'ohlc', label: 'OHLC' }
  ];
  
  const availableIndicators = [
    { value: 'SMA', label: 'Simple Moving Average' },
    { value: 'EMA', label: 'Exponential Moving Average' },
    { value: 'RSI', label: 'Relative Strength Index' },
    { value: 'MACD', label: 'MACD' },
    { value: 'BB', label: 'Bollinger Bands' },
    { value: 'Volume', label: 'Volume' },
    { value: 'Stochastic', label: 'Stochastic Oscillator' }
  ];

  // Mock chart data - in real app, this would be fetched from API
  const generateMockData = () => {
    const data = [];
    let price = 175 + Math.random() * 50;
    
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * 5;
      price += change;
      data.push({
        time: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString(),
        open: price - Math.random() * 2,
        high: price + Math.random() * 3,
        low: price - Math.random() * 3,
        close: price,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    return data;
  };

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [symbol, timeframe]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
          Interactive Stock Chart - {symbol}
        </h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Timeframe Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
          <div className="flex flex-wrap gap-2">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Type and Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {chartTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technical Indicators</label>
            <div className="flex flex-wrap gap-2">
              {availableIndicators.slice(0, 4).map((indicator) => (
                <button
                  key={indicator.value}
                  onClick={() => toggleIndicator(indicator.value)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                    indicators.includes(indicator.value)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {indicator.value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {isLoading ? (
          <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading chart data for {symbol}...</p>
            </div>
          </div>
        ) : (
          <div className="h-96 bg-gray-50 rounded-lg p-4 relative overflow-hidden">
            {/* Mock Chart Visualization */}
            <div className="h-full flex items-end justify-between space-x-1">
              {Array.from({ length: 50 }, (_, i) => {
                const height = Math.random() * 80 + 10;
                const isPositive = Math.random() > 0.5;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: i * 0.02 }}
                    className={`w-2 rounded-t ${
                      isPositive ? 'bg-green-500' : 'bg-red-500'
                    } opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
                    title={`Price: $${(175 + Math.random() * 50).toFixed(2)}`}
                  />
                );
              })}
            </div>

            {/* Chart Overlay Info */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-sm">
              <div className="text-sm space-y-1">
                <div className="font-semibold text-gray-900">Current Price: $175.43</div>
                <div className="text-green-600">+2.15 (+1.24%)</div>
                <div className="text-gray-600">Volume: 45.2M</div>
              </div>
            </div>

            {/* Technical Indicators Panel */}
            {indicators.length > 0 && (
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-sm">
                <div className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                  <Settings className="h-3 w-3 mr-1" />
                  Active Indicators
                </div>
                <div className="space-y-1">
                  {indicators.map((indicator) => (
                    <div key={indicator} className="text-xs text-gray-600">
                      {indicator}: {Math.random() > 0.5 ? 'Bullish' : 'Bearish'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart Analysis Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Technical Analysis Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Trend:</span>
            <span className="ml-2 text-green-600">Bullish</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Support:</span>
            <span className="ml-2 text-blue-700">$170.25</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Resistance:</span>
            <span className="ml-2 text-blue-700">$180.50</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveStockChart;