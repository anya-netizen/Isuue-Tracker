import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function VisualizationCharts({ chartData, trendData, filteredPGs }) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expected vs Actual Bar Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Expected vs Actual Count
            </CardTitle>
            <p className="text-sm text-gray-600">Comparison of predicted vs actual document movements</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expected" fill="#3b82f6" name="Expected Count" />
                  <Bar dataKey="actual" fill="#10b981" name="Actual Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Line Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Trend Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">Performance trends over selected date range</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="expected" stroke="#3b82f6" strokeWidth={2} name="Expected" />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PG Performance Summary */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            PG Performance Summary
          </CardTitle>
          <p className="text-sm text-gray-600">Detailed breakdown of each PG's performance metrics</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">PG Name</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Expected</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Actual</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Difference</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Performance</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPGs.map((pg, index) => {
                  const performance = Math.round((pg.actualCount / pg.expectedCount) * 100);
                  const isGoodPerformance = performance >= 90;
                  
                  return (
                    <motion.tr
                      key={pg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">{pg.name}</td>
                      <td className="py-3 px-4 text-center text-blue-600 font-semibold">{pg.expectedCount}</td>
                      <td className="py-3 px-4 text-center text-green-600 font-semibold">{pg.actualCount}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-semibold ${pg.expectedCount - pg.actualCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {pg.expectedCount - pg.actualCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${isGoodPerformance ? 'bg-green-500' : 'bg-orange-500'}`}
                              style={{ width: `${Math.min(performance, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${isGoodPerformance ? 'text-green-600' : 'text-orange-600'}`}>
                            {performance}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={isGoodPerformance ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                          {isGoodPerformance ? 'On Track' : 'Needs Attention'}
                        </Badge>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

