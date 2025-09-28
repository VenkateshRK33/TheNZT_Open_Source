'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Calculator,
  Building,
  Users,
  Calendar
} from 'lucide-react';

interface FundamentalsFinancialsProps {
  symbol: string;
}

interface FinancialData {
  marketCap: number;
  peRatio: number;
  eps: number;
  revenue: number;
  revenueGrowth: number;
  profitMargin: number;
  debtToEquity: number;
  roe: number;
  dividend: number;
  dividendYield: number;
}

interface CompanyInfo {
  name: string;
  sector: string;
  industry: string;
  employees: number;
  founded: number;
  headquarters: string;
}

const FundamentalsFinancials: React.FC<FundamentalsFinancialsProps> = ({ symbol }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'ratios' | 'company'>('overview');
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from financial data API
  const generateMockData = (): { financial: FinancialData; company: CompanyInfo } => {
    const mockFinancial: FinancialData = {
      marketCap: 2800000000000, // $2.8T
      peRatio: 28.5,
      eps: 6.15,
      revenue: 394328000000, // $394.3B
      revenueGrowth: 8.2,
      profitMargin: 25.3,
      debtToEquity: 1.73,
      roe: 147.4,
      dividend: 0.96,
      dividendYield: 0.55
    };

    const mockCompany: CompanyInfo = {
      name: symbol === 'AAPL' ? 'Apple Inc.' : `${symbol} Corporation`,
      sector: 'Technology',
      industry: 'Consumer Electronics',
      employees: 164000,
      founded: 1976,
      headquarters: 'Cupertino, CA'
    };

    return { financial: mockFinancial, company: mockCompany };
  };

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      const { financial, company } = generateMockData();
      setFinancialData(financial);
      setCompanyInfo(company);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [symbol]);

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'ratios', label: 'Key Ratios', icon: Calculator },
    { id: 'company', label: 'Company Info', icon: Building }
  ];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
          Fundamentals & Financials - {symbol}
        </h2>
        <div className="text-sm text-gray-500">
          Last updated: Q4 2024
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && financialData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-800">Market Cap</div>
              <div className="text-xl font-bold text-blue-900">{formatCurrency(financialData.marketCap)}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-800">Revenue (TTM)</div>
              <div className="text-xl font-bold text-green-900">{formatCurrency(financialData.revenue)}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-800">P/E Ratio</div>
              <div className="text-xl font-bold text-purple-900">{financialData.peRatio}</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-sm font-medium text-orange-800">EPS (TTM)</div>
              <div className="text-xl font-bold text-orange-900">${financialData.eps}</div>
            </div>
          </motion.div>
        )}

        {activeTab === 'financials' && financialData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Revenue & Growth</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Total Revenue (TTM)</span>
                    <span className="font-semibold">{formatCurrency(financialData.revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Revenue Growth (YoY)</span>
                    <span className="font-semibold text-green-600">+{financialData.revenueGrowth}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Profit Margin</span>
                    <span className="font-semibold">{financialData.profitMargin}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Dividends</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Dividend per Share</span>
                    <span className="font-semibold">${financialData.dividend}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Dividend Yield</span>
                    <span className="font-semibold">{financialData.dividendYield}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ratios' && financialData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Price-to-Earnings</div>
              <div className="text-2xl font-bold text-gray-900">{financialData.peRatio}</div>
              <div className="text-xs text-gray-500">Industry avg: 24.2</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Return on Equity</div>
              <div className="text-2xl font-bold text-gray-900">{financialData.roe}%</div>
              <div className="text-xs text-gray-500">Industry avg: 18.5%</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Debt-to-Equity</div>
              <div className="text-2xl font-bold text-gray-900">{financialData.debtToEquity}</div>
              <div className="text-xs text-gray-500">Industry avg: 0.85</div>
            </div>
          </motion.div>
        )}

        {activeTab === 'company' && companyInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Company Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Company Name</span>
                    <span className="font-semibold">{companyInfo.name}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Sector</span>
                    <span className="font-semibold">{companyInfo.sector}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Industry</span>
                    <span className="font-semibold">{companyInfo.industry}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Company Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Employees</span>
                    <span className="font-semibold">{formatNumber(companyInfo.employees)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Founded</span>
                    <span className="font-semibold">{companyInfo.founded}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Headquarters</span>
                    <span className="font-semibold">{companyInfo.headquarters}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FundamentalsFinancials;