import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Users
} from 'lucide-react';

const USMapDemo = ({ pgs, patients, onPGSelect }) => {
  const [selectedPG, setSelectedPG] = useState(null);
  const [viewType, setViewType] = useState('pgs');

  // Calculate PG performance and attention level
  const calculatePGMetrics = (pg) => {
    const pgPatients = patients?.filter(p => p.physician_group_id === pg.id) || [];
    const totalRevenue = pgPatients.reduce((sum, p) => sum + (p.monthly_revenue || 0), 0);
    const avgBillability = pgPatients.reduce((sum, p) => sum + (p.billability_score || 0), 0) / pgPatients.length || 0;
    const activePatients = pgPatients.filter(p => p.status === 'Active').length;
    const riskPatients = pgPatients.filter(p => p.risk_level === 'High').length;
    
    // Performance scoring algorithm
    const revenueScore = Math.min((totalRevenue / 50000) * 100, 100);
    const billabilityScore = avgBillability;
    const patientScore = Math.min((activePatients / 20) * 100, 100);
    const riskScore = Math.max(100 - (riskPatients / activePatients) * 100, 0) || 100;
    
    const overallScore = (revenueScore + billabilityScore + patientScore + riskScore) / 4;
    
    let attentionLevel = 'good';
    let color = '#10B981';
    
    if (overallScore < 40) {
      attentionLevel = 'critical';
      color = '#EF4444';
    } else if (overallScore < 70) {
      attentionLevel = 'needs-attention';  
      color = '#F59E0B';
    }
    
    return {
      ...pg,
      metrics: {
        overallScore: Math.round(overallScore),
        totalRevenue,
        avgBillability: Math.round(avgBillability),
        activePatients,
        riskPatients,
        attentionLevel,
        color
      }
    };
  };

  // Enhanced PG data with metrics
  const enhancedPGs = (pgs || [])
    .filter(pg => pg.coordinates && pg.coordinates.lat && pg.coordinates.lng)
    .map(calculatePGMetrics);

  // Calculate attention level statistics
  const getAttentionStats = () => {
    return enhancedPGs.reduce((acc, pg) => {
      acc[pg.metrics.attentionLevel]++;
      return acc;
    }, { critical: 0, 'needs-attention': 0, good: 0 });
  };

  const stats = getAttentionStats();

  // Simple coordinate mapping for demo (approximate state centers)
  const statePositions = {
    'CA': { x: 8, y: 60 },
    'TX': { x: 35, y: 75 },
    'FL': { x: 80, y: 85 },
    'NY': { x: 75, y: 25 },
    'PA': { x: 70, y: 35 },
    'IL': { x: 55, y: 45 },
    'OH': { x: 65, y: 40 },
    'GA': { x: 70, y: 70 },
    'NC': { x: 72, y: 60 },
    'MI': { x: 60, y: 35 },
    // Add more states as needed
  };

  const getStatePosition = (pg) => {
    const stateCode = pg.address?.state || 'CA';
    return statePositions[stateCode] || { x: 50, y: 50 };
  };

  return (
    <div className="w-full h-full relative">
      {/* Control Panel */}
      <Card className="absolute top-4 left-4 z-10 w-80 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            PG Network Overview (Demo)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* View Type Selector */}
          <div className="space-y-2">
            <div className="text-sm font-medium">View Type:</div>
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pgs">Individual PGs</SelectItem>
                <SelectItem value="heatmap">Heatmap</SelectItem>
                <SelectItem value="divisions">US Census Divisions</SelectItem>
                <SelectItem value="msa">Metropolitan Areas (MSA)</SelectItem>
                <SelectItem value="gsa">GSA Regions</SelectItem>
                <SelectItem value="county">Counties</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-bold text-red-600">{stats.critical}</div>
              <div className="text-xs text-red-700">Critical</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <div className="font-bold text-yellow-600">{stats['needs-attention']}</div>
              <div className="text-xs text-yellow-700">Needs Attention</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-bold text-green-600">{stats.good}</div>
              <div className="text-xs text-green-700">Good</div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Total PGs: {enhancedPGs.length}
          </div>
        </CardContent>
      </Card>

      {/* Demo Map Container */}
      <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg relative overflow-hidden">
        {/* Simple US Map SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Simple US outline */}
          <path
            d="M10 20 L90 25 L88 80 L85 85 L15 85 L12 80 Z"
            fill="rgba(34, 197, 94, 0.1)"
            stroke="rgba(34, 197, 94, 0.3)"
            strokeWidth="0.5"
          />
        </svg>

        {/* PG Markers */}
        {enhancedPGs.map((pg, index) => {
          const position = getStatePosition(pg);
          // Add some randomization to avoid exact overlap
          const x = position.x + (Math.random() - 0.5) * 8;
          const y = position.y + (Math.random() - 0.5) * 8;
          
          return (
            <div
              key={pg.id || index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
              style={{
                left: `${Math.max(5, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(95, y))}%`
              }}
              onClick={() => setSelectedPG(pg)}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: pg.metrics.color }}
              />
              {pg.metrics.attentionLevel === 'critical' && (
                <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20" />
              )}
            </div>
          );
        })}

        {/* Demo Notice */}
        <div className="absolute bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Demo Mode</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            This is a simplified demo. Enable Mapbox for full satellite map functionality.
          </p>
        </div>
      </div>

      {/* Selected PG Details */}
      {selectedPG && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Card className="w-80 bg-white shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedPG.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPG(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant={selectedPG.metrics.attentionLevel === 'critical' ? 'destructive' : 
                           selectedPG.metrics.attentionLevel === 'needs-attention' ? 'default' : 'secondary'}
                >
                  {selectedPG.metrics.attentionLevel.replace('-', ' ').toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  Score: {selectedPG.metrics.overallScore}/100
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Active Patients</div>
                  <div className="font-semibold">{selectedPG.metrics.activePatients}</div>
                </div>
                <div>
                  <div className="text-gray-600">Risk Patients</div>
                  <div className="font-semibold">{selectedPG.metrics.riskPatients}</div>
                </div>
                <div>
                  <div className="text-gray-600">Billability</div>
                  <div className="font-semibold">{selectedPG.metrics.avgBillability}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Revenue</div>
                  <div className="font-semibold">${(selectedPG.metrics.totalRevenue/1000).toFixed(0)}K</div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    onPGSelect?.(selectedPG);
                    setSelectedPG(null);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default USMapDemo;