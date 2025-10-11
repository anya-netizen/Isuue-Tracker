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

const InteractiveUSMapEnhancedSimple = ({ pgs, patients, onPGSelect }) => {
  console.log('Component rendering with PGs:', pgs?.length);
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  
  const [selectedPG, setSelectedPG] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewType, setViewType] = useState('pgs');
  const [mapError, setMapError] = useState(null);
  const [isMapboxAvailable, setIsMapboxAvailable] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [clusteredView, setClusteredView] = useState(false);

  // Geographic hierarchy: MSA -> GSA -> County -> Divisions
  const geographicHierarchy = {
    'all': {
      name: 'All Territories',
      type: 'national',
      bounds: [[-180, 15], [-60, 75]],
      center: [-98.5, 39.8],
      zoom: 4
    },
    // GSA Regions (Federal Administrative Regions)
    'gsa-1': {
      name: 'GSA Region 1 - New England',
      type: 'gsa',
      states: ['CT', 'MA', 'ME', 'NH', 'RI', 'VT'],
      bounds: [[-73.5, 41], [-66.5, 47.5]],
      center: [-70, 44],
      zoom: 6
    },
    'gsa-2': {
      name: 'GSA Region 2 - Northeast & Caribbean',
      type: 'gsa', 
      states: ['NJ', 'NY', 'PR', 'VI'],
      bounds: [[-79, 40], [-71, 45]],
      center: [-75, 42.5],
      zoom: 6
    },
    'gsa-3': {
      name: 'GSA Region 3 - Mid-Atlantic',
      type: 'gsa',
      states: ['DE', 'DC', 'MD', 'PA', 'VA', 'WV'],
      bounds: [[-83, 37], [-75, 42]],
      center: [-79, 39.5],
      zoom: 6
    },
    'gsa-4': {
      name: 'GSA Region 4 - Southeast',
      type: 'gsa',
      states: ['AL', 'FL', 'GA', 'KY', 'MS', 'NC', 'SC', 'TN'],
      bounds: [[-87, 24], [-75, 37]],
      center: [-81, 30.5],
      zoom: 5
    },
    'gsa-5': {
      name: 'GSA Region 5 - Great Lakes',
      type: 'gsa',
      states: ['IL', 'IN', 'MI', 'MN', 'OH', 'WI'],
      bounds: [[-93, 38], [-80, 49]],
      center: [-86.5, 43.5],
      zoom: 5
    },
    'gsa-6': {
      name: 'GSA Region 6 - South Central',
      type: 'gsa',
      states: ['AR', 'LA', 'NM', 'OK', 'TX'],
      bounds: [[-107, 25], [-89, 37]],
      center: [-98, 31],
      zoom: 5
    },
    'gsa-7': {
      name: 'GSA Region 7 - Great Plains',
      type: 'gsa',
      states: ['IA', 'KS', 'MO', 'NE'],
      bounds: [[-103, 37], [-90, 43]],
      center: [-96.5, 40],
      zoom: 6
    },
    'gsa-8': {
      name: 'GSA Region 8 - Rocky Mountain',
      type: 'gsa',
      states: ['CO', 'MT', 'ND', 'SD', 'UT', 'WY'],
      bounds: [[-114, 37], [-96, 49]],
      center: [-105, 43],
      zoom: 5
    },
    'gsa-9': {
      name: 'GSA Region 9 - Pacific',
      type: 'gsa',
      states: ['AZ', 'CA', 'HI', 'NV'],
      bounds: [[-125, 32], [-109, 42]],
      center: [-117, 37],
      zoom: 5
    },
    'gsa-10': {
      name: 'GSA Region 10 - Northwest',
      type: 'gsa',
      states: ['AK', 'ID', 'OR', 'WA'],
      bounds: [[-125, 42], [-110, 49]],
      center: [-117.5, 45.5],
      zoom: 5
    },
    // Major MSAs (Metropolitan Statistical Areas)
    'msa-boston': {
      name: 'Boston-Cambridge-Newton MSA',
      type: 'msa',
      gsa: 'gsa-1',
      counties: ['Suffolk', 'Middlesex', 'Norfolk', 'Plymouth', 'Essex'],
      bounds: [[-71.5, 42], [-70.5, 42.8]],
      center: [-71, 42.4],
      zoom: 9
    },
    'msa-nyc': {
      name: 'New York-Newark-Jersey City MSA',
      type: 'msa',
      gsa: 'gsa-2',
      counties: ['Bronx', 'Kings', 'New York', 'Queens', 'Richmond'],
      bounds: [[-74.5, 40.4], [-73.7, 41]],
      center: [-74.1, 40.7],
      zoom: 9
    },
    'msa-philadelphia': {
      name: 'Philadelphia-Camden-Wilmington MSA',
      type: 'msa',
      gsa: 'gsa-3',
      counties: ['Philadelphia', 'Delaware', 'Montgomery', 'Chester', 'Bucks'],
      bounds: [[-75.5, 39.7], [-74.8, 40.3]],
      center: [-75.15, 40],
      zoom: 9
    },
    'msa-atlanta': {
      name: 'Atlanta-Sandy Springs-Alpharetta MSA',
      type: 'msa',
      gsa: 'gsa-4',
      counties: ['Fulton', 'DeKalb', 'Gwinnett', 'Cobb', 'Clayton'],
      bounds: [[-84.8, 33.4], [-84, 34]],
      center: [-84.4, 33.7],
      zoom: 9
    },
    'msa-chicago': {
      name: 'Chicago-Naperville-Elgin MSA',
      type: 'msa',
      gsa: 'gsa-5',
      counties: ['Cook', 'DuPage', 'Kane', 'Lake', 'McHenry', 'Will'],
      bounds: [[-88.5, 41.4], [-87.2, 42.5]],
      center: [-87.85, 41.95],
      zoom: 9
    },
    'msa-dallas': {
      name: 'Dallas-Fort Worth-Arlington MSA',
      type: 'msa',
      gsa: 'gsa-6',
      counties: ['Dallas', 'Tarrant', 'Collin', 'Denton'],
      bounds: [[-97.5, 32.5], [-96.5, 33.2]],
      center: [-97, 32.85],
      zoom: 9
    },
    'msa-houston': {
      name: 'Houston-The Woodlands-Sugar Land MSA',
      type: 'msa',
      gsa: 'gsa-6',
      counties: ['Harris', 'Fort Bend', 'Montgomery', 'Brazoria', 'Galveston'],
      bounds: [[-95.8, 29.4], [-94.8, 30.2]],
      center: [-95.3, 29.8],
      zoom: 9
    },
    'msa-phoenix': {
      name: 'Phoenix-Mesa-Chandler MSA',
      type: 'msa',
      gsa: 'gsa-9',
      counties: ['Maricopa', 'Pinal'],
      bounds: [[-112.5, 33], [-111.5, 33.8]],
      center: [-112, 33.4],
      zoom: 9
    },
    'msa-los-angeles': {
      name: 'Los Angeles-Long Beach-Anaheim MSA',
      type: 'msa',
      gsa: 'gsa-9',
      counties: ['Los Angeles', 'Orange'],
      bounds: [[-118.7, 33.7], [-117.1, 34.3]],
      center: [-117.9, 34],
      zoom: 9
    },
    'msa-san-francisco': {
      name: 'San Francisco-Oakland-Berkeley MSA',
      type: 'msa',
      gsa: 'gsa-9',
      counties: ['San Francisco', 'Alameda', 'Contra Costa', 'Marin', 'San Mateo'],
      bounds: [[-122.8, 37.4], [-121.8, 38]],
      center: [-122.3, 37.7],
      zoom: 9
    },
    'msa-seattle': {
      name: 'Seattle-Tacoma-Bellevue MSA',
      type: 'msa',
      gsa: 'gsa-10',
      counties: ['King', 'Pierce', 'Snohomish'],
      bounds: [[-122.5, 47.1], [-121.5, 47.8]],
      center: [-122, 47.45],
      zoom: 9
    }
  };

  // Check if Mapbox is available
  useEffect(() => {
    console.log('Checking Mapbox availability...');
    if (window.mapboxgl) {
      setIsMapboxAvailable(true);
      console.log('Mapbox GL JS loaded successfully');
    } else {
      console.error('Mapbox GL JS not loaded');
      setMapError('Mapbox GL JS library not found. Please refresh the page.');
    }
  }, []);

  // Simple metrics calculation
  const calculatePGMetrics = useCallback((pg) => {
    const activePatients = pg.activePatients || 0;
    const totalRevenue = pg.totalRevenue || 0;
    const billablePatients = pg.billablePatients || 0;
    const overallScore = activePatients > 0 ? (billablePatients / activePatients) * 100 : 50;
    
    let attentionLevel = 'good';
    let color = '#10B981'; // Green
    
    if (overallScore < 45) {
      attentionLevel = 'critical';
      color = '#EF4444'; // Red
    } else if (overallScore < 70) {
      attentionLevel = 'needs-attention';
      color = '#F59E0B'; // Orange
    }
    
    return {
      ...pg,
      metrics: {
        overallScore: Math.round(overallScore),
        attentionLevel,
        color,
        activePatients,
        totalRevenue,
        billablePatients
      }
    };
  }, []);

    // Enhanced PGs with geographic hierarchy
  const enhancedPGs = useMemo(() => {
    if (!pgs || !Array.isArray(pgs)) return [];
    
    return pgs.map(pg => {
      // Assign geographic hierarchy based on state/city
      let gsa = 'gsa-1'; // Default to New England
      let msa = 'msa-boston'; // Default MSA
      let county = 'Suffolk'; // Default county
      let division = 'Healthcare Division 1'; // Default division
      
      // Determine GSA and MSA based on state/city
      const state = pg.state || pg.address?.state;
      const city = pg.city || pg.address?.city;
      
      if (state) {
        // GSA Region assignment based on state
        if (['CT', 'MA', 'ME', 'NH', 'RI', 'VT'].includes(state)) {
          gsa = 'gsa-1';
          if (city && ['Boston', 'Cambridge', 'Newton', 'Quincy', 'Somerville'].includes(city)) {
            msa = 'msa-boston';
            county = city === 'Boston' ? 'Suffolk' : 'Middlesex';
          }
        } else if (['NJ', 'NY'].includes(state)) {
          gsa = 'gsa-2';
          if (city && ['New York', 'Brooklyn', 'Queens', 'Bronx', 'Manhattan'].includes(city)) {
            msa = 'msa-nyc';
            county = city === 'Manhattan' ? 'New York' : 'Kings';
          }
        } else if (['DE', 'DC', 'MD', 'PA', 'VA', 'WV'].includes(state)) {
          gsa = 'gsa-3';
          if (city && ['Philadelphia', 'Camden', 'Wilmington'].includes(city)) {
            msa = 'msa-philadelphia';
            county = 'Philadelphia';
          }
        } else if (['AL', 'FL', 'GA', 'KY', 'MS', 'NC', 'SC', 'TN'].includes(state)) {
          gsa = 'gsa-4';
          if (city && ['Atlanta', 'Sandy Springs', 'Alpharetta'].includes(city)) {
            msa = 'msa-atlanta';
            county = 'Fulton';
          }
        } else if (['IL', 'IN', 'MI', 'MN', 'OH', 'WI'].includes(state)) {
          gsa = 'gsa-5';
          if (city && ['Chicago', 'Naperville', 'Elgin'].includes(city)) {
            msa = 'msa-chicago';
            county = 'Cook';
          }
        } else if (['AR', 'LA', 'NM', 'OK', 'TX'].includes(state)) {
          gsa = 'gsa-6';
          if (city && ['Dallas', 'Fort Worth', 'Arlington'].includes(city)) {
            msa = 'msa-dallas';
            county = 'Dallas';
          } else if (city && ['Houston', 'The Woodlands', 'Sugar Land'].includes(city)) {
            msa = 'msa-houston';
            county = 'Harris';
          }
        } else if (['IA', 'KS', 'MO', 'NE'].includes(state)) {
          gsa = 'gsa-7';
        } else if (['CO', 'MT', 'ND', 'SD', 'UT', 'WY'].includes(state)) {
          gsa = 'gsa-8';
        } else if (['AZ', 'CA', 'HI', 'NV'].includes(state)) {
          gsa = 'gsa-9';
          if (city && ['Phoenix', 'Mesa', 'Chandler'].includes(city)) {
            msa = 'msa-phoenix';
            county = 'Maricopa';
          } else if (city && ['Los Angeles', 'Long Beach', 'Anaheim'].includes(city)) {
            msa = 'msa-los-angeles';
            county = 'Los Angeles';
          } else if (city && ['San Francisco', 'Oakland', 'Berkeley'].includes(city)) {
            msa = 'msa-san-francisco';
            county = 'San Francisco';
          }
        } else if (['AK', 'ID', 'OR', 'WA'].includes(state)) {
          gsa = 'gsa-10';
          if (city && ['Seattle', 'Tacoma', 'Bellevue'].includes(city)) {
            msa = 'msa-seattle';
            county = 'King';
          }
        }
      }
      
      // Assign division based on PG specialty or size
      if (pg.activePatients > 100) {
        division = 'Major Healthcare Division';
      } else if (pg.activePatients > 50) {
        division = 'Regional Healthcare Division';
      } else {
        division = 'Local Healthcare Division';
      }
      
      return calculatePGMetrics({
        ...pg,
        gsa,
        msa, 
        county,
        division,
        coordinates: pg.coordinates || {
          lat: 42.3601 + (Math.random() - 0.5) * 0.1,
          lng: -71.0589 + (Math.random() - 0.5) * 0.1
        }
      });
    });
  }, [pgs, calculatePGMetrics]);

  console.log('Enhanced PGs:', enhancedPGs.length);

  // Initialize map
  useEffect(() => {
    console.log('Map initialization effect running...', { 
      isMapboxAvailable, 
      hasMapRef: !!mapRef.current, 
      hasMapInstance: !!mapInstanceRef.current 
    });
    
    if (!isMapboxAvailable || !mapRef.current || mapInstanceRef.current) return;

    try {
      const token = 'pk.eyJ1IjoicmlzaGkyMDAzIiwiYSI6ImNtZng1YTRubzA4c2cya3NiaHZvMjBlbmEifQ.CLgQYhT7K6yIth5jClvaKQ';
      window.mapboxgl.accessToken = token;

      const region = geographicHierarchy[selectedRegion];
      const newMap = new window.mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: region.center,
        zoom: region.zoom,
        attributionControl: false
      });

      newMap.addControl(new window.mapboxgl.NavigationControl({
        showCompass: false,
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
      console.error('Map initialization error:', error);
      setMapError(`Initialization error: ${error.message}`);
    }
  }, [isMapboxAvailable, selectedRegion]);

  // Create simple markers
  const createMarkers = useCallback(() => {
    console.log('Creating markers...', { 
      mapLoaded, 
      enhancedPGsCount: enhancedPGs.length,
      hasMapInstance: !!mapInstanceRef.current 
    });
    
    if (!mapInstanceRef.current || !mapLoaded || !enhancedPGs.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const region = geographicHierarchy[selectedRegion];
    if (!region) return;
    
    let filteredPGs = enhancedPGs.filter(pg => {
      if (selectedRegion === 'all') return true;
      
      const lat = pg.coordinates.lat;
      const lng = pg.coordinates.lng;
      
      // Check if within geographic bounds
      const withinBounds = lat >= region.bounds[0][1] && lat <= region.bounds[1][1] &&
                          lng >= region.bounds[0][0] && lng <= region.bounds[1][0];
      
      // Additional filtering based on region type and hierarchy
      if (region.type === 'gsa' && pg.gsa === selectedRegion) return true;
      if (region.type === 'msa' && pg.msa === selectedRegion) return true;
      
      return withinBounds;
    });

    // Apply view type filtering
    if (viewType === 'critical') {
      filteredPGs = filteredPGs.filter(pg => pg.metrics.attentionLevel === 'critical');
    } else if (viewType === 'needs-attention') {
      filteredPGs = filteredPGs.filter(pg => pg.metrics.attentionLevel === 'needs-attention');
    } else if (viewType === 'good') {
      filteredPGs = filteredPGs.filter(pg => pg.metrics.attentionLevel === 'good');
    } else if (viewType === 'county') {
      // Group by county - show representative markers per county
      const counties = {};
      filteredPGs.forEach(pg => {
        const county = pg.county || 'Unknown';
        if (!counties[county]) {
          counties[county] = [];
        }
        counties[county].push(pg);
      });
      // Take the first PG from each county as representative
      filteredPGs = Object.values(counties).map(countyPGs => countyPGs[0]);
    } else if (viewType === 'division') {
      // Group by division - show representative markers per division
      const divisions = {};
      filteredPGs.forEach(pg => {
        const division = pg.division || 'Unknown Division';
        if (!divisions[division]) {
          divisions[division] = [];
        }
        divisions[division].push(pg);
      });
      // Take the first PG from each division as representative
      filteredPGs = Object.values(divisions).map(divisionPGs => divisionPGs[0]);
    }
    // If viewType === 'pgs', show all PGs (no additional filtering needed)

    console.log(`Creating ${filteredPGs.length} markers in region ${selectedRegion}`);

    filteredPGs.forEach(pg => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.cssText = `
        width: 16px;
        height: 16px;
        background: ${pg.metrics.color};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;

      // Create popup content as a DOM element instead of HTML string
      const popupDiv = document.createElement('div');
      popupDiv.style.padding = '16px';
      popupDiv.style.minWidth = '280px';
      
      // Different popup content based on view type
      if (viewType === 'county') {
        // Show county-level aggregated data
        const countyPGs = enhancedPGs.filter(p => p.county === pg.county);
        const totalPatients = countyPGs.reduce((sum, p) => sum + (p.activePatients || 0), 0);
        const avgScore = Math.round(countyPGs.reduce((sum, p) => sum + (p.metrics?.overallScore || 0), 0) / countyPGs.length);
        
        popupDiv.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 4px; color: #111;">📍 ${pg.county} County</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${pg.address?.state || pg.state || 'Unknown State'}</div>
          
          <div style="background: #f8fafc; padding: 8px; border-radius: 6px; margin-bottom: 12px; font-size: 11px;">
            <div style="color: #475569; margin-bottom: 2px;"><strong>County Summary:</strong></div>
            <div style="color: #64748b;">🏥 Total PGs: ${countyPGs.length}</div>
            <div style="color: #64748b;">👥 Total Patients: ${totalPatients}</div>
            <div style="color: #64748b;">📊 Average Score: ${avgScore}%</div>
          </div>
        `;
      } else if (viewType === 'division') {
        // Show division-level aggregated data
        const divisionPGs = enhancedPGs.filter(p => p.division === pg.division);
        const totalPatients = divisionPGs.reduce((sum, p) => sum + (p.activePatients || 0), 0);
        const avgScore = Math.round(divisionPGs.reduce((sum, p) => sum + (p.metrics?.overallScore || 0), 0) / divisionPGs.length);
        
        popupDiv.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 4px; color: #111;">🏢 ${pg.division}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${pg.county} County, ${pg.address?.state || pg.state || 'Unknown State'}</div>
          
          <div style="background: #f8fafc; padding: 8px; border-radius: 6px; margin-bottom: 12px; font-size: 11px;">
            <div style="color: #475569; margin-bottom: 2px;"><strong>Division Summary:</strong></div>
            <div style="color: #64748b;">🏥 Total PGs: ${divisionPGs.length}</div>
            <div style="color: #64748b;">👥 Total Patients: ${totalPatients}</div>
            <div style="color: #64748b;">📊 Average Score: ${avgScore}%</div>
          </div>
        `;
      } else {
        // Show individual PG data (default for 'pgs', 'critical', 'needs-attention', 'good')
        popupDiv.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 4px; color: #111;">${pg.name}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${pg.address?.city || pg.city || 'Unknown City'}, ${pg.address?.state || pg.state || 'Unknown State'}</div>
          
          <!-- Geographic Hierarchy -->
          <div style="background: #f8fafc; padding: 8px; border-radius: 6px; margin-bottom: 12px; font-size: 11px;">
            <div style="color: #475569; margin-bottom: 2px;"><strong>Geographic Classification:</strong></div>
            <div style="color: #64748b;">📍 MSA: ${geographicHierarchy[pg.msa]?.name || pg.msa}</div>
            <div style="color: #64748b;">🏛️ GSA: ${geographicHierarchy[pg.gsa]?.name || pg.gsa}</div>
            <div style="color: #64748b;">🏛️ County: ${pg.county}</div>
            <div style="color: #64748b;">🏢 Division: ${pg.division}</div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <div style="width: 8px; height: 8px; background: ${pg.metrics.color}; border-radius: 50%;"></div>
            <span style="font-size: 12px; font-weight: 500; text-transform: capitalize; color: ${pg.metrics.color};">
              ${pg.metrics.attentionLevel.replace('-', ' ')}
            </span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 6px;">
              <div style="font-weight: 600; color: #111;">${pg.metrics.overallScore}</div>
              <div style="font-size: 10px; color: #666;">Score</div>
            </div>
            <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 6px;">
              <div style="font-weight: 600; color: #111;">${pg.metrics.activePatients}</div>
              <div style="font-size: 10px; color: #666;">Patients</div>
            </div>
          </div>
        `;
      }

      // Add action section based on attention level
      if (pg.metrics.attentionLevel !== 'good') {
        const actionDiv = document.createElement('div');
        actionDiv.style.cssText = 'border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 12px;';
        
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'font-size: 11px; color: #666; margin-bottom: 8px;';
        messageDiv.textContent = pg.metrics.attentionLevel === 'critical' ? 
          '🚨 Immediate Action Required' : '⚠️ Attention Needed';
        
        const actionButton = document.createElement('button');
        actionButton.textContent = pg.metrics.attentionLevel === 'critical' ? 
          '🎯 Take Immediate Action' : '📋 Review & Improve';
        actionButton.style.cssText = `
          width: 100%;
          background: ${pg.metrics.attentionLevel === 'critical' ? '#dc2626' : '#f59e0b'};
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        `;
        
        // Add click handler directly to the button
        actionButton.addEventListener('click', (e) => {
          e.stopPropagation();
          handlePGActionClick(pg);
        });

        actionDiv.appendChild(messageDiv);
        actionDiv.appendChild(actionButton);
        popupDiv.appendChild(actionDiv);
      } else {
        const goodDiv = document.createElement('div');
        goodDiv.style.cssText = 'border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 12px;';
        
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'font-size: 11px; color: #10b981; margin-bottom: 8px;';
        messageDiv.textContent = '✅ Performance is Good';
        
        const actionButton = document.createElement('button');
        actionButton.textContent = '📊 View Details & Maintain';
        actionButton.style.cssText = `
          width: 100%;
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        `;
        
        actionButton.addEventListener('click', (e) => {
          e.stopPropagation();
          handlePGActionClick(pg);
        });

        goodDiv.appendChild(messageDiv);
        goodDiv.appendChild(actionButton);
        popupDiv.appendChild(goodDiv);
      }

      const popup = new window.mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        maxWidth: '320px'
      }).setDOMContent(popupDiv);

      const marker = new window.mapboxgl.Marker(el)
        .setLngLat([pg.coordinates.lng, pg.coordinates.lat])
        .setPopup(popup)
        .addTo(mapInstanceRef.current);

      markersRef.current.push(marker);
    });

    console.log(`Successfully created ${markersRef.current.length} markers`);
  }, [mapLoaded, enhancedPGs, selectedRegion, viewType, geographicHierarchy]);

  // Handle PG action click
  const handlePGActionClick = useCallback((pg) => {
    console.log('PG action clicked:', pg.name, pg.metrics.attentionLevel);
    
    try {
      // Set the selected PG for the parent component
      if (onPGSelect) {
        onPGSelect(pg);
      }
      
      // Create tutorial data
      const tutorialData = {
        pgId: pg.id,
        pgName: pg.name,
        attentionLevel: pg.metrics.attentionLevel,
        actionType: pg.metrics.attentionLevel === 'critical' ? 'immediate' : 
                   pg.metrics.attentionLevel === 'needs-attention' ? 'improvement' : 'maintenance',
        timestamp: new Date().toISOString()
      };
      
      console.log('Tutorial data created:', tutorialData);
      
      // Store tutorial data
      sessionStorage.setItem('pgActionTutorial', JSON.stringify(tutorialData));
      
      // Dispatch navigation event
      const event = new CustomEvent('navigateToServices', { 
        detail: tutorialData 
      });
      window.dispatchEvent(event);
      
      // Close popup
      const popups = document.getElementsByClassName('mapboxgl-popup');
      Array.from(popups).forEach(popup => popup.remove());
      
      console.log('Navigation event dispatched successfully');
      
    } catch (error) {
      console.error('Error handling PG action:', error);
    }
  }, [onPGSelect]);

  // Update markers when data changes
  useEffect(() => {
    createMarkers();
  }, [createMarkers]);

  // Stats calculation
  const stats = useMemo(() => {
    if (!enhancedPGs.length) return { critical: 0, 'needs-attention': 0, good: 0 };
    
    const region = geographicHierarchy[selectedRegion];
    if (!region) return { critical: 0, 'needs-attention': 0, good: 0 };
    
    let filteredPGs = enhancedPGs.filter(pg => {
      if (selectedRegion === 'all') return true;
      
      const lat = pg.coordinates.lat;
      const lng = pg.coordinates.lng;
      
      // Check if within geographic bounds
      const withinBounds = lat >= region.bounds[0][1] && lat <= region.bounds[1][1] &&
                          lng >= region.bounds[0][0] && lng <= region.bounds[1][0];
      
      // Additional filtering based on region type and hierarchy
      if (region.type === 'gsa' && pg.gsa === selectedRegion) return true;
      if (region.type === 'msa' && pg.msa === selectedRegion) return true;
      
      return withinBounds;
    });

    // Apply view type filtering for stats
    if (viewType === 'critical') {
      filteredPGs = filteredPGs.filter(pg => pg.metrics.attentionLevel === 'critical');
    } else if (viewType === 'needs-attention') {
      filteredPGs = filteredPGs.filter(pg => pg.metrics.attentionLevel === 'needs-attention');
    } else if (viewType === 'good') {
      filteredPGs = filteredPGs.filter(pg => pg.metrics.attentionLevel === 'good');
    } else if (viewType === 'county') {
      // Group by county for stats
      const counties = {};
      filteredPGs.forEach(pg => {
        const county = pg.county || 'Unknown';
        if (!counties[county]) {
          counties[county] = [];
        }
        counties[county].push(pg);
      });
      filteredPGs = Object.values(counties).flat(); // Keep all PGs for accurate stats
    } else if (viewType === 'division') {
      // Group by division for stats
      const divisions = {};
      filteredPGs.forEach(pg => {
        const division = pg.division || 'Unknown Division';
        if (!divisions[division]) {
          divisions[division] = [];
        }
        divisions[division].push(pg);
      });
      filteredPGs = Object.values(divisions).flat(); // Keep all PGs for accurate stats
    }
    
    return filteredPGs.reduce((acc, pg) => {
      acc[pg.metrics.attentionLevel] = (acc[pg.metrics.attentionLevel] || 0) + 1;
      return acc;
    }, { critical: 0, 'needs-attention': 0, good: 0 });
  }, [enhancedPGs, selectedRegion, viewType, geographicHierarchy]);

  return (
    <div className="w-full h-full relative">
      <style>{`
        .marker {
          transition: transform 0.2s ease;
        }
        .marker:hover {
          transform: scale(1.3);
        }
      `}</style>
      
      {/* Control Panel */}
      <Card className="absolute top-4 left-4 z-10 w-80 bg-white/95 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Enhanced US Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Region Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Geographic Area:</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* National */}
                <SelectItem value="all">🇺🇸 All Territories</SelectItem>
                
                {/* GSA Regions */}
                <SelectItem value="gsa-header" disabled>── GSA Regions ──</SelectItem>
                <SelectItem value="gsa-1">📍 GSA Region 1 - New England</SelectItem>
                <SelectItem value="gsa-2">📍 GSA Region 2 - Northeast & Caribbean</SelectItem>
                <SelectItem value="gsa-3">📍 GSA Region 3 - Mid-Atlantic</SelectItem>
                <SelectItem value="gsa-4">📍 GSA Region 4 - Southeast</SelectItem>
                <SelectItem value="gsa-5">📍 GSA Region 5 - Great Lakes</SelectItem>
                <SelectItem value="gsa-6">📍 GSA Region 6 - South Central</SelectItem>
                <SelectItem value="gsa-7">📍 GSA Region 7 - Great Plains</SelectItem>
                <SelectItem value="gsa-8">📍 GSA Region 8 - Rocky Mountain</SelectItem>
                <SelectItem value="gsa-9">📍 GSA Region 9 - Pacific</SelectItem>
                <SelectItem value="gsa-10">📍 GSA Region 10 - Northwest</SelectItem>
                
                {/* Major MSAs */}
                <SelectItem value="msa-header" disabled>── Major MSAs ──</SelectItem>
                <SelectItem value="msa-boston">🏙️ Boston-Cambridge-Newton MSA</SelectItem>
                <SelectItem value="msa-nyc">🏙️ New York-Newark-Jersey City MSA</SelectItem>
                <SelectItem value="msa-philadelphia">🏙️ Philadelphia-Camden-Wilmington MSA</SelectItem>
                <SelectItem value="msa-atlanta">🏙️ Atlanta-Sandy Springs-Alpharetta MSA</SelectItem>
                <SelectItem value="msa-chicago">🏙️ Chicago-Naperville-Elgin MSA</SelectItem>
                <SelectItem value="msa-dallas">🏙️ Dallas-Fort Worth-Arlington MSA</SelectItem>
                <SelectItem value="msa-houston">🏙️ Houston-The Woodlands-Sugar Land MSA</SelectItem>
                <SelectItem value="msa-phoenix">🏙️ Phoenix-Mesa-Chandler MSA</SelectItem>
                <SelectItem value="msa-los-angeles">🏙️ Los Angeles-Long Beach-Anaheim MSA</SelectItem>
                <SelectItem value="msa-san-francisco">🏙️ San Francisco-Oakland-Berkeley MSA</SelectItem>
                <SelectItem value="msa-seattle">🏙️ Seattle-Tacoma-Bellevue MSA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium">View Type:</label>
            <div className="flex gap-2">
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pgs">🏥 All PGs</SelectItem>
                  <SelectItem value="county">🏛️ By County</SelectItem>
                  <SelectItem value="division">🏢 By Division</SelectItem>
                  <SelectItem value="critical">🚨 Critical Only</SelectItem>
                  <SelectItem value="needs-attention">⚠️ Needs Attention</SelectItem>
                  <SelectItem value="good">✅ Good Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="text-sm font-medium">{geographicHierarchy[selectedRegion].name} Status:</div>
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
            <div className="text-center text-sm text-gray-600 mt-2">
              Total PGs in {geographicHierarchy[selectedRegion].name}: {stats.critical + stats['needs-attention'] + stats.good}
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

      {/* Debug Info */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/75 text-white p-2 rounded text-xs">
        <div>Mapbox Available: {isMapboxAvailable ? '✓' : '✗'}</div>
        <div>Map Loaded: {mapLoaded ? '✓' : '✗'}</div>
        <div>PGs: {enhancedPGs.length}</div>
        <div>Markers: {markersRef.current.length}</div>
      </div>
    </div>
  );
};

export default InteractiveUSMapEnhancedSimple;