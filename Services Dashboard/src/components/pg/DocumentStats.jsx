import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

export default function DocumentStats({ patients }) {
  const stats = useMemo(() => {
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

    // Group by type
    const byType = {};
    Object.keys(counts).forEach(k => {
      const [type, metric] = k.split(':');
      byType[type] = byType[type] || { type, total: 0, available: 0, missing: 0 };
      if (metric === 'total') byType[type].total = counts[k];
      if (metric === 'available') byType[type].available = counts[k];
      if (metric === 'missing') byType[type].missing = counts[k];
    });

    return Object.values(byType).sort((a, b) => a.type.localeCompare(b.type));
  }, [patients]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          Document Overview
        </CardTitle>
        <p className="text-sm text-gray-600">Counts by document type: total, available, missing</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Type</th>
                <th className="text-left py-2 px-3">Total</th>
                <th className="text-left py-2 px-3">Available</th>
                <th className="text-left py-2 px-3">Missing</th>
              </tr>
            </thead>
            <tbody>
              {stats.map(row => (
                <tr key={row.type} className="border-b last:border-0">
                  <td className="py-2 px-3 font-medium">{row.type}</td>
                  <td className="py-2 px-3">{row.total}</td>
                  <td className="py-2 px-3">
                    <Badge className="bg-green-100 text-green-700">{row.available}</Badge>
                  </td>
                  <td className="py-2 px-3">
                    <Badge className="bg-red-100 text-red-700">{row.missing}</Badge>
                  </td>
                </tr>
              ))}
              {stats.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">No document data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}



