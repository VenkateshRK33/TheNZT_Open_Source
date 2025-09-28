'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Target, Zap } from 'lucide-react';

interface AIStockInsightsProps {
  symbol: string;
}

interface Insight {
  type: 'bullish' | 'bearish' | 'neutral' | 'warning';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
}

const AIStockInsights: React.FC<AIStockInsightsProps> = ({ symbol }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiScore, setAiScore] = useState(0);
  const [recommendation, setRecommendation] = useState<'BUY' | 'HOLD' | 'SELL'>('HOLD');

  // Mock AI insights - in real app, this would come from AI analysis API
  const generateMockInsights = (): Insight[] => {
    const mockInsights: Insight[] = [
      {
        type: 'bullish',
        title: 'Strong Technical Momentum',
        description: 'RSI indicates oversold conditions with potential for reversal. Moving averages show bullish crossover pattern.',
        confidence: 85,
        timeframe: 'Short-term (1-2 weeks)'
      },
      {
        type: 'neutral',
        title: 'Mixed Market Sentiment',
        description: 'Social media sentiment analysis shows balanced views. Institutional buying detected but volume remains moderate.',
        confidence: 72,
        timeframe: 'Medium-term (1-3 months)'
      },
      {
        type: 'warning',
        title: 'Earnings Risk Ahead',
        description: 'Upcoming earnings announcement in 2 weeks. Historical volatility increases 40% during earnings season.',
        confidence: 90,
        timeframe: 'Immediate (2 weeks)'
      },
      {
        type: 'bullish',
        title: 'Sector Rotation Opportunity',
        description: 'AI detects capital flowing into this sector. Peer comparison shows relative undervaluation of 15%.',
        confidence: 78,
        timeframe: 'Long-term (3-6 months)'
      }
    ];
    
    return mockInsights.sort(() => Math.random() - 0.5).slice(0, 3);
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate AI analysis
    const timer = setTimeout(() => {
      const newInsights = generateMockInsights();
      setInsights(newInsights);
      
      // Calculate AI score based on insights
      const score = newInsights.reduce((acc, insight) => {
        const weight = insight.confidence / 100;
        const typeScore = insight.type === 'bullish' ? 1 : insight.type === 'bearish' ? -1 : 0;
        return acc + (typeScore * weight);
      }, 0) / newInsights.length;
      
      setAiScore(Math.round((score + 1) * 50)); // Convert to 0-100 scale
      
      // Set recommendation based on score
      if (score > 0.3) setRecommendation('BUY');
      else if (score < -0.3) setRecommendation('SELL');
      else setRecommendation('HOLD');
      
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [symbol]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'border-green-200 bg-green-50';
      case 'bearish': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'text-green-600 bg-green-100';
      case 'SELL': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-lg shadow-sm p-6 h-fit"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Brain className="mr-2 h-5 w-5 text-purple-600" />
          AI Stock Insights
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <Zap className="h-4 w-4 mr-1" />
          AI Powered
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">AI analyzing {symbol}...</p>
          </div>
        </div>
      ) : (
        <>
          {/* AI Score and Recommendation */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-gray-700">AI Confidence Score</div>
                <div className="text-2xl font-bold text-purple-600">{aiScore}/100</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">Recommendation</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRecommendationColor(recommendation)}`}>
                  {recommendation}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${aiScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Insights List */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Key Insights</h3>
            
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {getInsightIcon(insight.type)}
                    <span className="ml-2 font-medium text-gray-900">{insight.title}</span>
                  </div>
                  <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {insight.confidence}% confidence
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                
                <div className="text-xs text-gray-600 font-medium">
                  Timeframe: {insight.timeframe}
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Analysis Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">AI Analysis Summary</h4>
            <p className="text-sm text-gray-700">
              Based on technical indicators, market sentiment, and historical patterns, 
              our AI model suggests a {recommendation.toLowerCase()} position for {symbol}. 
              The analysis incorporates real-time data from multiple sources including 
              price action, volume patterns, and social sentiment.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              AI insights are for informational purposes only and should not be considered as financial advice. 
              Always conduct your own research before making investment decisions.
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AIStockInsights;