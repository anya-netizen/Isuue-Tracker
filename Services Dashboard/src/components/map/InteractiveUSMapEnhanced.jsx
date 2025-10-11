import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

const InteractiveUSMapEnhanced = ({ pgs, patients, onPGSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const popupRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [selectedPG, setSelectedPG] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewType, setViewType] = useState('pgs');
  const [mapError, setMapError] = useState(null);
  const [isMapboxAvailable, setIsMapboxAvailable] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [clusteredView, setClusteredView] = useState(false);

  // Geographic regions with bounds
  const regions = {
    'all': {
      name: 'United States',
      bounds: [[-180, 15], [-60, 75]], // More inclusive bounds for US
      center: [-98.5, 39.8],
      zoom: 4
    },
    'northeast': {
      name: 'Northeast',
      bounds: [[-80, 40], [-66, 48]],
      center: [-73, 44],
      zoom: 6
    },
    'southeast': {
      name: 'Southeast', 
      bounds: [[-90, 25], [-75, 40]],
      center: [-82.5, 32.5],
      zoom: 6
    },
    'midwest': {
      name: 'Midwest',
      bounds: [[-104, 37], [-80, 49]],
      center: [-92, 43],
      zoom: 5
    },
    'southwest': {
      name: 'Southwest',
      bounds: [[-125, 25], [-95, 42]],
      center: [-110, 33.5],
      zoom: 5
    },
    'west': {
      name: 'West Coast',
      bounds: [[-125, 32], [-110, 49]],
      center: [-117.5, 40.5],
      zoom: 6
    },
    'texas': {
      name: 'Texas',
      bounds: [[-106.6, 25.8], [-93.5, 36.5]],
      center: [-100, 31],
      zoom: 6
    },
    'california': {
      name: 'California',
      bounds: [[-124.5, 32.5], [-114.1, 42]],
      center: [-119.5, 37],
      zoom: 6
    },
    'florida': {
      name: 'Florida',
      bounds: [[-87.6, 24.5], [-80, 31]],
      center: [-83.5, 27.5],
      zoom: 7
    }
  };

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

  // Memoized metrics calculation for better performance
  const calculatePGMetrics = useCallback((pg) => {
    // Use data directly from the enhanced PG structure
    const activePatients = pg.activePatients || 0;
    const totalRevenue = pg.totalRevenue || 0;
    const billablePatients = pg.billablePatients || 0;
    const unbillablePatients = pg.unbillablePatients || 0;
    const avgBillability = activePatients > 0 ? (billablePatients / activePatients) * 100 : 0;
    
    // Performance scoring algorithm using actual data
    const revenueScore = Math.min((totalRevenue / 50000) * 100, 100);
    const billabilityScore = avgBillability;
    const patientScore = Math.min((activePatients / 50) * 100, 100); // Adjusted for realistic patient counts
    const riskScore = Math.min((billablePatients / Math.max(activePatients, 1)) * 100, 100);
    
    const overallScore = (revenueScore + billabilityScore + patientScore + riskScore) / 4;
    
    let attentionLevel = 'good';
    let color = '#10B981'; // Green
    
    if (overallScore < 45) {
      attentionLevel = 'critical';
      color = '#EF4444'; // Red
    } else if (overallScore < 70) {
      attentionLevel = 'needs-attention';
      color = '#F59E0B'; // Yellow/Orange
    }
    
    return {
      ...pg,
      metrics: {
        overallScore: Math.round(overallScore),
        attentionLevel,
        color,
        activePatients,
        totalRevenue: Math.round(totalRevenue),
        avgBillability: Math.round(avgBillability),
        billablePatients,
        unbillablePatients
      }
    };
  }, []);

  // Memoized enhanced PG data with metrics for better performance
  const enhancedPGs = useMemo(() => {
    if (!pgs) return [];
    
    return pgs
      .filter(pg => {
        const hasCoords = pg.coordinates && 
                        typeof pg.coordinates.lat === 'number' && 
                        typeof pg.coordinates.lng === 'number' &&
                        !isNaN(pg.coordinates.lat) && 
                        !isNaN(pg.coordinates.lng);
        return hasCoords;
      })
      .map(calculatePGMetrics);
  }, [pgs, calculatePGMetrics]);

  // Debug logging
  useEffect(() => {
    console.log('=== MAP DEBUG INFO ===');
    console.log('Total raw PGs:', pgs?.length || 0);
    console.log('PGs with valid coordinates:', enhancedPGs.length);
    console.log('First few PGs:', enhancedPGs.slice(0, 3).map(pg => ({
      name: pg.name,
      coordinates: pg.coordinates,
      city: pg.address?.city,
      state: pg.address?.state
    })));
    console.log('=== END DEBUG ===');
  }, [pgs, enhancedPGs]);

  // Optimized map initialization
  useEffect(() => {
    if (!isMapboxAvailable || !mapRef.current || mapInstanceRef.current) return;

    try {
      // Your provided Mapbox API key
      const token = 'pk.eyJ1IjoicmlzaGkyMDAzIiwiYSI6ImNtZng1YTRubzA4c2cya3NiaHZvMjBlbmEifQ.CLgQYhT7K6yIth5jClvaKQ';
      window.mapboxgl.accessToken = token;

      const region = regions[selectedRegion];
      const newMap = new window.mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: region.center,
        zoom: region.zoom,
        bounds: region.bounds,
        maxBounds: region.bounds,
        fadeDuration: 100, // Reduced for faster transitions
        attributionControl: false,
        // Performance optimizations
        antialias: false,
        optimizeForTerrain: false,
        preserveDrawingBuffer: false,
        renderWorldCopies: false
      });

      // Add custom controls
      newMap.addControl(new window.mapboxgl.NavigationControl({
        showCompass: false, // Disable compass for better performance
        showZoom: true
      }), 'top-right');

      newMap.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        mapInstanceRef.current = newMap;
        setMapError(null);
      });

      newMap.on('error', (e) => {
        console.error('Map error:', e);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(`Failed to initialize map: ${error.message}`);
    }
  }, [isMapboxAvailable, selectedRegion]);

  // Update map bounds when region changes
  useEffect(() => {
    if (!map) return;
    
    const region = regions[selectedRegion];
    map.fitBounds(region.bounds, {
      padding: 20,
      duration: 1000
    });
  }, [selectedRegion]);

  // Optimized marker management with batch updates and requestAnimationFrame
  const clearMarkers = useCallback(() => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    }
    
    // Clear popup if exists
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  }, []);

  // Memoized filtered PGs based on region
  const filteredPGs = useMemo(() => {
    if (!enhancedPGs.length) return [];
    
    const regionBounds = regions[selectedRegion].bounds;
    return enhancedPGs.filter(pg => {
      const lat = pg.coordinates.lat;
      const lng = pg.coordinates.lng;
      return lat >= regionBounds[0][1] && lat <= regionBounds[1][1] &&
             lng >= regionBounds[0][0] && lng <= regionBounds[1][0];
    });
  }, [enhancedPGs, selectedRegion]);

  // Optimized marker creation with batching
  const createOptimizedMarkers = useCallback((pgs) => {
    if (!mapInstanceRef.current || !pgs.length) return;

    const markers = [];
    const markerElements = document.createDocumentFragment();

    // Batch DOM operations
    pgs.forEach(pg => {
      const el = document.createElement('div');
      el.className = 'pg-marker-optimized';
      
      // Use CSS classes instead of inline styles for better performance
      const size = pg.metrics.attentionLevel === 'critical' ? 'critical' : 
                  pg.metrics.attentionLevel === 'needs-attention' ? 'needs-attention' : 'good';
      
      el.classList.add(`marker-${size}`);
      el.style.backgroundColor = pg.metrics.color;

      // Optimized event handling
      let isHovered = false;
      
      el.addEventListener('mouseenter', () => {
        if (!isHovered) {
          isHovered = true;
          requestAnimationFrame(() => {
            el.style.transform = 'scale(1.3)';
            el.style.zIndex = '1000';
          });
        }
      });

      el.addEventListener('mouseleave', () => {
        if (isHovered) {
          isHovered = false;
          requestAnimationFrame(() => {
            el.style.transform = 'scale(1)';
            el.style.zIndex = '1';
          });
        }
      });

      // Optimized click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        showOptimizedPopup(pg, el);
      });

      const marker = new window.mapboxgl.Marker(el)
        .setLngLat([pg.coordinates.lng, pg.coordinates.lat])
        .addTo(mapInstanceRef.current);

      markers.push(marker);
    });

    markersRef.current = markers;
  }, []);

  // Optimized popup creation
  const showOptimizedPopup = useCallback((pg, element) => {
    // Remove existing popup
    if (popupRef.current) {
      popupRef.current.remove();
    }

    const popup = new window.mapboxgl.Popup({
      offset: [0, -30],
      closeButton: true,
      closeOnClick: false,
      className: 'pg-popup-optimized',
      maxWidth: '300px',
      anchor: 'bottom'
    }).setHTML(`
      <div class="popup-content">
        <div class="popup-header">
          <div class="popup-title">${pg.name}</div>
          <div class="popup-location">${pg.address.city}, ${pg.address.state}</div>
          <div class="popup-status ${pg.metrics.attentionLevel}">
            <div class="status-dot" style="background: ${pg.metrics.color}"></div>
            <span>${pg.metrics.attentionLevel.replace('-', ' ')}</span>
          </div>
        </div>
        <div class="popup-metrics">
          <div class="metric">
            <div class="metric-value">${pg.metrics.overallScore}</div>
            <div class="metric-label">Score</div>
          </div>
          <div class="metric">
            <div class="metric-value">${pg.metrics.activePatients}</div>
            <div class="metric-label">Patients</div>
          </div>
          <div class="metric">
            <div class="metric-value">$${Math.round(pg.metrics.totalRevenue / 1000)}K</div>
            <div class="metric-label">Revenue</div>
          </div>
          <div class="metric">
            <div class="metric-value">${pg.metrics.avgBillability}%</div>
            <div class="metric-label">Billability</div>
          </div>
        </div>
      </div>
    `);

    popup.setLngLat([pg.coordinates.lng, pg.coordinates.lat])
         .addTo(mapInstanceRef.current);
    
    popupRef.current = popup;
  }, []);

  // Main effect for updating markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || !filteredPGs.length) return;

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      clearMarkers();
      
      if (viewType === 'pgs') {
        createOptimizedMarkers(filteredPGs);
      }
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mapInstanceRef.current, mapLoaded, filteredPGs, viewType, createOptimizedMarkers, clearMarkers]);
      map.removeSource('pg-heatmap');
    }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMarkers();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [clearMarkers]);

    // Memoized stats calculation
  const stats = useMemo(() => {
    return filteredPGs.reduce((acc, pg) => {
      acc[pg.metrics.attentionLevel] = (acc[pg.metrics.attentionLevel] || 0) + 1;
      return acc;
    }, { critical: 0, 'needs-attention': 0, good: 0 });
  }, [filteredPGs]);

  // Create heatmap view
  const createHeatmapView = (pgs) => {
    try {
      const heatmapData = {
        type: 'FeatureCollection',
        features: pgs.map(pg => ({
          type: 'Feature',
          properties: {
            intensity: pg.metrics.attentionLevel === 'critical' ? 3 :
                      pg.metrics.attentionLevel === 'needs-attention' ? 2 : 1
          },
          geometry: {
            type: 'Point',
            coordinates: [pg.coordinates.lng, pg.coordinates.lat]
          }
        }))
      };

      map.addSource('pg-heatmap', {
        type: 'geojson',
        data: heatmapData
      });

      map.addLayer({
        id: 'pg-heatmap',
        type: 'heatmap',
        source: 'pg-heatmap',
        maxzoom: 15,
        paint: {
          'heatmap-weight': {
            property: 'intensity',
            type: 'exponential',
            stops: [
              [1, 0],
              [3, 1]
            ]
          },
          'heatmap-intensity': {
            stops: [
              [11, 1],
              [15, 3]
            ]
          },
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': {
            stops: [
              [11, 15],
              [15, 20]
            ]
          },
          'heatmap-opacity': {
            default: 1,
            stops: [
              [14, 1],
              [15, 0]
            ]
          }
        }
      });

      console.log(`Created heatmap with ${pgs.length} points`);
    } catch (error) {
      console.error('Error creating heatmap:', error);
    }
  };

  // Create clustered view
  const createClusteredView = (pgs) => {
    const clusters = createClusters(pgs, 0.5); // 0.5 degree clustering
    const markers = [];

    clusters.forEach(cluster => {
      try {
        const el = document.createElement('div');
        el.className = 'cluster-marker';
        
        const total = cluster.pgs.length;
        const critical = cluster.pgs.filter(pg => pg.metrics.attentionLevel === 'critical').length;
        const needsAttention = cluster.pgs.filter(pg => pg.metrics.attentionLevel === 'needs-attention').length;
        
        let clusterColor = '#10B981'; // green
        if (critical > 0) clusterColor = '#EF4444'; // red
        else if (needsAttention > 0) clusterColor = '#F59E0B'; // yellow

        const size = Math.max(30, Math.min(60, total * 8));
        
        el.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          background: ${clusterColor};
          border: 4px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${total > 99 ? '12px' : '16px'};
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          transition: transform 0.2s ease;
        `;
        el.textContent = total;
        
        const popup = new window.mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          className: 'cluster-popup',
          maxWidth: '250px'
        }).setHTML(`
          <div class="p-3">
            <div class="font-bold text-lg mb-2">${total} Physician Groups</div>
            <div class="space-y-1">
              ${critical > 0 ? `<div class="text-red-600">🔴 ${critical} Critical</div>` : ''}
              ${needsAttention > 0 ? `<div class="text-yellow-600">🟡 ${needsAttention} Need Attention</div>` : ''}
              <div class="text-green-600">🟢 ${total - critical - needsAttention} Good</div>
            </div>
            <div class="mt-3 text-xs text-gray-600">
              Click to zoom in
            </div>
          </div>
        `);

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.1)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        el.addEventListener('click', () => {
          map.flyTo({
            center: [cluster.lng, cluster.lat],
            zoom: Math.min(map.getZoom() + 2, 10),
            duration: 1000
          });
        });

        const marker = new window.mapboxgl.Marker(el)
          .setLngLat([cluster.lng, cluster.lat])
          .setPopup(popup)
          .addTo(map);

        markers.push(marker);
      } catch (error) {
        console.error('Error creating cluster marker:', error);
      }
    });

    setCurrentMarkers(markers);
    console.log(`Created ${clusters.length} cluster markers`);
  };

  // Simple clustering algorithm
  const createClusters = (pgs, threshold) => {
    const clusters = [];
    const processed = new Set();

    pgs.forEach((pg, index) => {
      if (processed.has(index)) return;

      const cluster = {
        lat: pg.coordinates.lat,
        lng: pg.coordinates.lng,
        pgs: [pg]
      };

      // Find nearby PGs
      pgs.forEach((otherPg, otherIndex) => {
        if (otherIndex === index || processed.has(otherIndex)) return;

        const distance = Math.sqrt(
          Math.pow(pg.coordinates.lat - otherPg.coordinates.lat, 2) +
          Math.pow(pg.coordinates.lng - otherPg.coordinates.lng, 2)
        );

        if (distance < threshold) {
          cluster.pgs.push(otherPg);
          processed.add(otherIndex);
        }
      });

      // Calculate cluster center
      if (cluster.pgs.length > 1) {
        cluster.lat = cluster.pgs.reduce((sum, p) => sum + p.coordinates.lat, 0) / cluster.pgs.length;
        cluster.lng = cluster.pgs.reduce((sum, p) => sum + p.coordinates.lng, 0) / cluster.pgs.length;
      }

      clusters.push(cluster);
      processed.add(index);
    });

    return clusters;
  };

  // Make selectPG function globally available
  useEffect(() => {
    window.selectPG = (pgId) => {
      const pg = enhancedPGs.find(p => p.id === pgId);
      if (pg && onPGSelect) {
        onPGSelect(pg);
      }
    };
  }, [enhancedPGs, onPGSelect]);

  // Calculate attention level statistics for selected region
  const getRegionStats = () => {
    const regionBounds = regions[selectedRegion].bounds;
    const regionPGs = enhancedPGs.filter(pg => {
      const lat = pg.coordinates.lat;
      const lng = pg.coordinates.lng;
      return lat >= regionBounds[0][1] && lat <= regionBounds[1][1] &&
             lng >= regionBounds[0][0] && lng <= regionBounds[1][0];
    });

  return (
    <div className="w-full h-full relative">
      {/* Optimized CSS for 60fps performance */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        
        .pg-marker-optimized {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transition: transform 0.2s ease;
          position: relative;
          z-index: 1;
          will-change: transform;
        }
        
        .marker-critical {
          width: 18px !important;
          height: 18px !important;
          animation: pulse 2s infinite;
        }
        
        .marker-needs-attention {
          width: 16px !important;
          height: 16px !important;
        }
        
        .marker-good {
          width: 14px !important;
          height: 14px !important;
        }
        
        .pg-popup-optimized .mapboxgl-popup-content {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 0;
          border: 1px solid #e5e7eb;
          max-width: 280px;
        }
        
        .pg-popup-optimized .mapboxgl-popup-tip {
          border-top-color: white;
        }
        
        .popup-content {
          padding: 16px;
        }
        
        .popup-header {
          margin-bottom: 12px;
        }
        
        .popup-title {
          font-weight: 600;
          font-size: 16px;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .popup-location {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .popup-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .popup-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        
        .metric {
          text-align: center;
          padding: 8px;
          background: #f9fafb;
          border-radius: 6px;
        }
        
        .metric-value {
          font-weight: 600;
          font-size: 14px;
          color: #111827;
        }
        
        .metric-label {
          font-size: 10px;
          color: #6b7280;
          margin-top: 2px;
        }
        
        .mapboxgl-popup {
          z-index: 1000;
        }
        
        .cluster-marker {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          will-change: transform;
        }
      `}</style>

      {/* Enhanced Control Panel */}
      <Card className="absolute top-4 left-4 z-10 w-80 bg-white/95 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            PG Network Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Region Selector */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Focus Area:</div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🇺🇸 United States</SelectItem>
                <SelectItem value="northeast">🏢 Northeast</SelectItem>
                <SelectItem value="southeast">🌴 Southeast</SelectItem>
                <SelectItem value="midwest">🌾 Midwest</SelectItem>
                <SelectItem value="southwest">🏜️ Southwest</SelectItem>
                <SelectItem value="west">🏔️ West Coast</SelectItem>
                <SelectItem value="texas">⭐ Texas</SelectItem>
                <SelectItem value="california">☀️ California</SelectItem>
                <SelectItem value="florida">🦩 Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Type Selector */}
          <div className="space-y-2">
            <div className="text-sm font-medium">View Type:</div>
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pgs">📍 Individual PGs</SelectItem>
                <SelectItem value="heatmap">🔥 Heatmap</SelectItem>
                <SelectItem value="clusters">🎯 Clustered View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clustered View Toggle - only show for individual PGs */}
          {viewType === 'pgs' && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Display Mode:</div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!clusteredView ? 'default' : 'outline'}
                  onClick={() => setClusteredView(false)}
                  className="flex-1 text-xs"
                >
                  Individual
                </Button>
                <Button
                  size="sm" 
                  variant={clusteredView ? 'default' : 'outline'}
                  onClick={() => setClusteredView(true)}
                  className="flex-1 text-xs"
                >
                  Clustered
                </Button>
              </div>
            </div>
          )}

          {/* Enhanced Stats */}
          <div className="space-y-3">
            <div className="text-sm font-medium">{regions[selectedRegion].name} Status:</div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="font-bold text-red-600 text-xl">{stats.critical}</div>
                <div className="text-xs text-red-700 mt-1">Critical</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="font-bold text-yellow-600 text-xl">{stats['needs-attention']}</div>
                <div className="text-xs text-yellow-700 mt-1">Needs Attention</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="font-bold text-green-600 text-xl">{stats.good}</div>
                <div className="text-xs text-green-700 mt-1">Good</div>
              </div>
            </div>
            
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                Total PGs in {regions[selectedRegion].name}: {stats.critical + stats['needs-attention'] + stats.good}
              </div>
            </div>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveUSMapEnhanced;