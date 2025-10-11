import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, FileText } from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export default function DocumentStatsChart({ patients }) {
  const chartData = useMemo(() => {
    const counts = {};
    const inc = (key, by = 1) => { counts[key] = (counts[key] || 0) + by; };

    (patients || []).forEach(p => {
      const docs = p.documents || {};
      Object.entries(docs).forEach(([type, doc]) => {
        const keyTotal = `${type}:total`;
        const keyAvailable = `${type}:available`;
        const keyMissing = `${type}:missing`;
        inc(keyTotal);
        if (doc?.available) inc(keyAvailable); else inc(keyMissing);
      });
    });

    // Group by type for bar chart
    const byType = {};
    Object.keys(counts).forEach(k => {
      const [type, metric] = k.split(':');
      byType[type] = byType[type] || { type, total: 0, available: 0, missing: 0 };
      if (metric === 'total') byType[type].total = counts[k];
      if (metric === 'available') byType[type].available = counts[k];
      if (metric === 'missing') byType[type].missing = counts[k];
    });

    const barData = Object.values(byType).map(item => ({
      name: item.type,
      available: item.available,
      missing: item.missing,
      total: item.total
    }));

    // Pie chart data for availability overview
    const totalAvailable = Object.values(byType).reduce((sum, item) => sum + item.available, 0);
    const totalMissing = Object.values(byType).reduce((sum, item) => sum + item.missing, 0);
    
    const pieData = [
      { name: 'Available', value: totalAvailable, color: '#10b981' },
      { name: 'Missing', value: totalMissing, color: '#ef4444' }
    ];

    return { barData, pieData };
  }, [patients]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Document Status by Type
          </CardTitle>
          <p className="text-sm text-gray-600">Available vs Missing documents by type</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="available" stackId="a" fill="#10b981" name="Available" />
                <Bar dataKey="missing" stackId="a" fill="#ef4444" name="Missing" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Overall Document Availability
          </CardTitle>
          <p className="text-sm text-gray-600">Total available vs missing documents</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
