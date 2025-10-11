import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Eye,
  X,
  Zap,
  Heart,
  Target,
  Shield
} from 'lucide-react';

const InteractiveUSMapSimple = ({ pgs, patients, onPGSelect }) => {
  const mapRef = useRef(null);
  const [selectedPG, setSelectedPG] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewType, setViewType] = useState('pgs');
  const [map, setMap] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [isMapboxAvailable, setIsMapboxAvailable] = useState(false);

  // Check if Mapbox is available
  useEffect(() => {
    if (window.mapboxgl) {
      setIsMapboxAvailable(true);
      console.log('Mapbox GL JS loaded successfully');
    } else {
      console.error('Mapbox GL JS not loaded');
      setMapError('Mapbox GL JS library not found');
    }
  }, []);

  // Calculate PG performance and attention level
  const calculatePGMetrics = (pg) => {
    const pgPatients = patients.filter(p => p.physician_group_id === pg.id);
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
    
    if (overallScore < 50) {
      attentionLevel = 'critical';
      color = '#EF4444';
    } else if (overallScore < 75) {
      attentionLevel = 'needs-attention';
      color = '#F59E0B';
    }
    
    return {
      ...pg,
      metrics: {
        overallScore: Math.round(overallScore),
        attentionLevel,
        color,
        activePatients,
        totalRevenue,
        avgBillability: Math.round(avgBillability),
        riskPatients
      }
    };
  };

  // Enhanced PG data with metrics
  const enhancedPGs = pgs
    ?.filter(pg => pg.coordinates && pg.coordinates.lat && pg.coordinates.lng)
    ?.map(calculatePGMetrics) || [];

  // Initialize map
  useEffect(() => {
    if (!isMapboxAvailable || !mapRef.current || map) return;

    try {
      // Updated Mapbox access token
      const token = 'pk.eyJ1IjoicmlzaGlrZXNoYWtrYWx3YXIiLCJhIjoiY20xOWhhOGhtMDNyMjJqcHNoNWd5c3l3eSJ9.YjrGX5QKXZSPaMqrBVpAUQ';
      
      // Ensure token is valid format
      if (!token || !token.startsWith('pk.')) {
        throw new Error('Invalid Mapbox access token format');
      }
      
      window.mapboxgl.accessToken = token;
      console.log('Setting Mapbox token:', token.substring(0, 20) + '...');

      const newMap = new window.mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-98.5, 39.8],
        zoom: 4,
        bounds: [[-125, 20], [-65, 50]], // US bounds
        maxBounds: [[-125, 20], [-65, 50]]
      });

      newMap.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        setMap(newMap);
        setMapError(null); // Clear any previous errors
      });

      newMap.on('error', (e) => {
        console.error('Map error:', e);
        const errorMessage = e.error?.message || e.message || 'Unknown error';
        setMapError(`Map initialization error: ${errorMessage}: you may have provided an invalid Mapbox access token. See https://docs.mapbox.com/api/overview/#access-tokens-and-token-scopes`);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(`Failed to initialize map: ${error.message}`);
    }
  }, [isMapboxAvailable, map]);

  // Add markers when map loads
  useEffect(() => {
    if (!map || !mapLoaded || !enhancedPGs.length) return;

    // Add individual PG markers
    enhancedPGs.forEach(pg => {
      const el = document.createElement('div');
      el.className = 'pg-marker';
      el.style.cssText = `
        width: 12px;
        height: 12px;
        background: ${pg.metrics.color};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;

      const popup = new window.mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        className: 'pg-popup'
      }).setHTML(`
        <div class="p-3">
          <div class="font-semibold text-sm">${pg.name}</div>
          <div class="text-xs text-gray-600 mt-1">${pg.address.city}, ${pg.address.state}</div>
          <div class="flex items-center gap-2 mt-2">
            <div class="w-2 h-2 rounded-full" style="background: ${pg.metrics.color}"></div>
            <span class="text-xs capitalize">${pg.metrics.attentionLevel.replace('-', ' ')}</span>
          </div>
          <div class="text-xs mt-1">Score: ${pg.metrics.overallScore}/100</div>
          <div class="text-xs">Patients: ${pg.metrics.activePatients}</div>
        </div>
      `);

      new window.mapboxgl.Marker(el)
        .setLngLat([pg.coordinates.lng, pg.coordinates.lat])
        .setPopup(popup)
        .addTo(map);
    });

  }, [map, mapLoaded, enhancedPGs]);

  // Calculate attention level statistics
  const getAttentionStats = () => {
    return enhancedPGs.reduce((acc, pg) => {
      acc[pg.metrics.attentionLevel]++;
      return acc;
    }, { critical: 0, 'needs-attention': 0, good: 0 });
  };

  const stats = getAttentionStats();

  return (
    <div className="w-full h-full relative">
      {/* Control Panel */}
      <Card className="absolute top-4 left-4 z-10 w-80 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            PG Network Overview
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

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Error Display */}
      {mapError && (
        <Card className="absolute bottom-4 left-4 z-10 bg-red-50 border-red-200 max-w-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Map Error</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{mapError}</p>
            <div className="mt-3 text-xs text-gray-600">
              <p className="font-medium mb-2">To fix this error:</p>
              <ol className="space-y-1">
                <li>1. Visit <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Mapbox Account</a></li>
                <li>2. Create a new access token</li>
                <li>3. Replace the token in the component</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveUSMapSimple;