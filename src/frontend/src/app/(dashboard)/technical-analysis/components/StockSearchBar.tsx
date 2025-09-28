'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Star } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface StockSearchBarProps {
  onStockSelect: (symbol: string) => void;
  selectedStock: string;
}

const StockSearchBar: React.FC<StockSearchBarProps> = ({ onStockSelect, selectedStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock stock data - in real app, this would come from an API
  const mockStocks: Stock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.23, changePercent: -0.88 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: 4.32, changePercent: 1.15 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.86, change: 1.89, changePercent: 1.31 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44 },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 325.67, change: -2.34, changePercent: -0.71 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 445.23, change: 8.91, changePercent: 2.04 },
  ];

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockStocks.filter(
        stock =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions(mockStocks.filter(stock => popularStocks.includes(stock.symbol)));
      setIsOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStockSelect = (stock: Stock) => {
    setSearchTerm(stock.symbol);
    onStockSelect(stock.symbol);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (searchTerm.length === 0) {
      setSuggestions(mockStocks.filter(stock => popularStocks.includes(stock.symbol)));
    }
    setIsOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Search className="mr-2 h-5 w-5 text-blue-600" />
          Stock Search
        </h2>
        <div className="text-sm text-gray-500">
          Currently analyzing: <span className="font-medium text-blue-600">{selectedStock}</span>
        </div>
      </div>

      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search stocks by symbol or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
            >
              {searchTerm.length === 0 && (
                <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  Popular Stocks
                </div>
              )}
              
              {suggestions.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => handleStockSelect(stock)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{stock.symbol}</div>
                      <div className="text-sm text-gray-600 truncate">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${stock.price.toFixed(2)}</div>
                      <div className={`text-sm flex items-center ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`h-3 w-3 mr-1 ${
                          stock.change < 0 ? 'rotate-180' : ''
                        }`} />
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {suggestions.length === 0 && searchTerm.length > 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No stocks found matching "{searchTerm}"</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Access Buttons */}
      <div className="mt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Quick Access:</div>
        <div className="flex flex-wrap gap-2">
          {popularStocks.map((symbol) => (
            <button
              key={symbol}
              onClick={() => {
                const stock = mockStocks.find(s => s.symbol === symbol);
                if (stock) handleStockSelect(stock);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedStock === symbol
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StockSearchBar;