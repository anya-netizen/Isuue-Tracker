import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox-custom.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { US_COUNTIES, getAllStates, getCountiesByState } from '@/data/counties';
import { 
  COMPLETE_US_COUNTIES, 
  getAllCompleteStates, 
  getCompleteCountiesByState,
  getDatasetStats,
  searchCompleteCounties 
} from '@/data/complete-counties';
import { countyDataService } from '@/services/countyDataService';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicmlzaGkyMDAzIiwiYSI6ImNtZng1YTRubzA4c2cya3NiaHZvMjBlbmEifQ.CLgQYhT7K6yIth5jClvaKQ';

// US State coordinates for map navigation
const US_STATE_COORDINATES = {
  'Alabama': [-86.8073, 32.3617],
  'Alaska': [-154.2084, 64.0685],
  'Arizona': [-111.6602, 34.2744],
  'Arkansas': [-92.2348, 35.2048],
  'California': [-119.7730, 36.7783],
  'Colorado': [-105.5178, 39.7391],
  'Connecticut': [-72.7273, 41.6219],
  'Delaware': [-75.5277, 39.3498],
  'Florida': [-81.6156, 27.7663],
  'Georgia': [-83.2572, 32.1656],
  'Hawaii': [-157.8583, 21.3099],
  'Idaho': [-114.6130, 44.0682],
  'Illinois': [-89.1526, 40.0417],
  'Indiana': [-86.1349, 40.2732],
  'Iowa': [-93.3140, 42.0115],
  'Kansas': [-98.4842, 38.4937],
  'Kentucky': [-84.7674, 37.5347],
  'Louisiana': [-92.7875, 30.8377],
  'Maine': [-69.4455, 45.3695],
  'Maryland': [-76.6413, 39.0458],
  'Massachusetts': [-71.0275, 42.2352],
  'Michigan': [-85.4102, 44.3467],
  'Minnesota': [-94.6859, 46.3287],
  'Mississippi': [-89.6678, 32.3547],
  'Missouri': [-92.6043, 38.3566],
  'Montana': [-110.3626, 46.8059],
  'Nebraska': [-99.8090, 41.5378],
  'Nevada': [-116.6312, 39.1638],
  'New Hampshire': [-71.5376, 43.6805],
  'New Jersey': [-74.6728, 40.0583],
  'New Mexico': [-106.1126, 34.4071],
  'New York': [-75.1449, 43.2994],
  'North Carolina': [-79.3877, 35.5397],
  'North Dakota': [-100.0990, 47.5362],
  'Ohio': [-82.7443, 40.2732],
  'Oklahoma': [-97.5348, 35.5889],
  'Oregon': [-120.5015, 43.9336],
  'Pennsylvania': [-77.1945, 41.2033],
  'Rhode Island': [-71.4774, 41.6762],
  'South Carolina': [-81.1637, 33.8191],
  'South Dakota': [-100.2263, 44.2853],
  'Tennessee': [-86.3209, 35.7449],
  'Texas': [-99.9018, 31.1060],
  'Utah': [-111.6703, 39.3210],
  'Vermont': [-72.8108, 44.2619],
  'Virginia': [-78.6569, 37.5215],
  'Washington': [-120.7401, 47.7511],
  'West Virginia': [-80.6227, 38.4758],
  'Wisconsin': [-89.9941, 44.9778],
  'Wyoming': [-107.5512, 43.0759]
};

// Major US MSAs with coordinates
const US_MSAs = [
  { name: "New York-Newark-Jersey City, NY-NJ-PA", coordinates: [-74.006, 40.7128], zoom: 9 },
  { name: "Los Angeles-Long Beach-Anaheim, CA", coordinates: [-118.2437, 34.0522], zoom: 9 },
  { name: "Chicago-Naperville-Elgin, IL-IN-WI", coordinates: [-87.6298, 41.8781], zoom: 9 },
  { name: "Dallas-Fort Worth-Arlington, TX", coordinates: [-96.7970, 32.7767], zoom: 9 },
  { name: "Houston-The Woodlands-Sugar Land, TX", coordinates: [-95.3698, 29.7604], zoom: 9 },
  { name: "Washington-Arlington-Alexandria, DC-VA-MD-WV", coordinates: [-77.0369, 38.9072], zoom: 9 },
  { name: "Miami-Fort Lauderdale-West Palm Beach, FL", coordinates: [-80.1918, 25.7617], zoom: 9 },
  { name: "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD", coordinates: [-75.1652, 39.9526], zoom: 9 },
  { name: "Atlanta-Sandy Springs-Roswell, GA", coordinates: [-84.3880, 33.7490], zoom: 9 },
  { name: "Boston-Cambridge-Newton, MA-NH", coordinates: [-71.0588, 42.3601], zoom: 9 },
  { name: "San Francisco-Oakland-Hayward, CA", coordinates: [-122.4194, 37.7749], zoom: 9 },
  { name: "Phoenix-Mesa-Scottsdale, AZ", coordinates: [-112.0740, 33.4484], zoom: 9 },
  { name: "Riverside-San Bernardino-Ontario, CA", coordinates: [-117.3961, 33.9533], zoom: 9 },
  { name: "Detroit-Warren-Dearborn, MI", coordinates: [-83.0458, 42.3314], zoom: 9 },
  { name: "Seattle-Tacoma-Bellevue, WA", coordinates: [-122.3321, 47.6062], zoom: 9 },
  { name: "Minneapolis-St. Paul-Bloomington, MN-WI", coordinates: [-93.2650, 44.9778], zoom: 9 },
  { name: "San Diego-Carlsbad, CA", coordinates: [-117.1611, 32.7157], zoom: 9 },
  { name: "Tampa-St. Petersburg-Clearwater, FL", coordinates: [-82.4572, 27.9506], zoom: 9 },
  { name: "Denver-Aurora-Lakewood, CO", coordinates: [-104.9903, 39.7392], zoom: 9 },
  { name: "St. Louis, MO-IL", coordinates: [-90.1994, 38.6270], zoom: 9 },
  { name: "Baltimore-Columbia-Towson, MD", coordinates: [-76.6122, 39.2904], zoom: 9 },
  { name: "Charlotte-Concord-Gastonia, NC-SC", coordinates: [-80.8431, 35.2271], zoom: 9 },
  { name: "Orlando-Kissimmee-Sanford, FL", coordinates: [-81.3792, 28.5383], zoom: 9 },
  { name: "San Antonio-New Braunfels, TX", coordinates: [-98.4936, 29.4241], zoom: 9 },
  { name: "Portland-Vancouver-Hillsboro, OR-WA", coordinates: [-122.6784, 45.5152], zoom: 9 }
];

export default function MapboxMap({ networkData, className = "w-full h-80" }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedMSA, setSelectedMSA] = useState(US_MSAs[0]);
  const [markers, setMarkers] = useState([]);
  const [showCounties, setShowCounties] = useState(false);
  const [selectedState, setSelectedState] = useState('all');
  const [countyMarkers, setCountyMarkers] = useState([]);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [useCompleteDataset, setUseCompleteDataset] = useState(false);
  const [completeDataset, setCompleteDataset] = useState(null);
  const [datasetStats, setDatasetStats] = useState(null);

  // Function to get current dataset based on selection
  const getCurrentDataset = () => {
    if (useCompleteDataset && completeDataset) {
      return completeDataset.counties;
    }
    return US_COUNTIES;
  };

  // Function to get current states list
  const getCurrentStates = () => {
    if (useCompleteDataset && completeDataset) {
      return [...new Set(completeDataset.counties.map(county => county.state))].sort();
    }
    return getAllStates();
  };

  // Function to get counties by state from current dataset
  const getCurrentCountiesByState = (state) => {
    if (useCompleteDataset && completeDataset) {
      return completeDataset.counties.filter(county => county.state === state);
    }
    return getCountiesByState(state);
  };

  // Function to get filtered counties based on selected state
  const getFilteredCounties = () => {
    const dataset = getCurrentDataset();
    console.log(`Getting filtered counties: ${dataset.length} total, state: ${selectedState}, useCompleteDataset: ${useCompleteDataset}`);
    
    if (selectedState === 'all') {
      return dataset;
    }
    return getCurrentCountiesByState(selectedState);
  };

  // Function to switch datasets
  const toggleDataset = async () => {
    setLoadingCounties(true);
    const newDataset = !useCompleteDataset;
    
    try {
      if (newDataset && !completeDataset) {
        // Load complete dataset using service
        const data = await countyDataService.loadCompleteCountyData();
        setCompleteDataset(data);
        
        // Calculate stats
        const totalPopulation = data.counties.reduce((sum, county) => sum + county.population, 0);
        const avgPopulation = Math.round(totalPopulation / data.counties.length);
        
        setDatasetStats({
          totalCounties: data.counties.length,
          totalStates: [...new Set(data.counties.map(c => c.state))].length,
          totalPopulation,
          avgPopulation,
          largestCounty: data.counties.reduce((max, county) => 
            county.population > max.population ? county : max, data.counties[0]),
          smallestCounty: data.counties.reduce((min, county) => 
            county.population < min.population ? county : min, data.counties[0])
        });
      }
      
      setUseCompleteDataset(newDataset);
      setSelectedState('all');
      
      // Refresh counties if currently showing
      if (showCounties) {
        setTimeout(() => {
          const dataset = newDataset ? completeDataset?.counties || [] : US_COUNTIES;
          addCountyMarkers(dataset);
          setLoadingCounties(false);
        }, 500);
      } else {
        setLoadingCounties(false);
      }
    } catch (error) {
      console.error('Error loading dataset:', error);
      setLoadingCounties(false);
    }
  };

  // Function to clear existing markers
  const clearMarkers = () => {
    markers.forEach(marker => marker.remove());
    setMarkers([]);
  };

  // Function to clear county markers
  const clearCountyMarkers = () => {
    countyMarkers.forEach(marker => marker.remove());
    setCountyMarkers([]);
  };

  // Function to add county markers
  const addCountyMarkers = (counties) => {
    if (!map.current) {
      console.log('Map not initialized yet');
      return;
    }

    console.log(`Adding ${counties.length} county markers`);
    clearCountyMarkers();
    const newCountyMarkers = [];

    counties.forEach((county, index) => {
      const countyMarkerElement = document.createElement('div');
      countyMarkerElement.className = 'county-marker';
      countyMarkerElement.innerHTML = `
        <div class="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-md border-2 border-white hover:scale-125 transition-transform cursor-pointer">
        </div>
      `;

      const countyMarker = new mapboxgl.Marker(countyMarkerElement)
        .setLngLat(county.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 15, className: 'custom-popup' })
            .setHTML(`
              <div class="p-3 bg-white rounded-lg shadow-lg border-0">
                <h3 class="font-bold text-base text-emerald-700 mb-2">${county.name}</h3>
                <div class="space-y-2">
                  <p class="text-sm text-gray-600 flex items-center">
                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Population: ${county.population.toLocaleString()}
                  </p>
                  <p class="text-sm text-emerald-600 font-medium">📍 ${county.state}</p>
                </div>
              </div>
            `)
        )
        .addTo(map.current);

      newCountyMarkers.push(countyMarker);
    });

    console.log(`Successfully added ${newCountyMarkers.length} county markers`);
    setCountyMarkers(newCountyMarkers);
  };

  // Function to toggle county display
  const toggleCounties = async () => {
    if (showCounties) {
      clearCountyMarkers();
      setShowCounties(false);
      setLoadingCounties(false);
    } else {
      setShowCounties(true);
      setLoadingCounties(true);
      
      try {
        // Automatically load complete dataset if not already using it
        if (!useCompleteDataset && !completeDataset) {
          console.log('Loading complete county dataset for better filtering...');
          await toggleDataset(); // This will load the complete dataset
        }
        
        // Small delay to show loading state
        setTimeout(() => {
          const countiesToShow = getFilteredCounties();
          console.log(`Toggle counties: showing ${countiesToShow.length} counties`);
          addCountyMarkers(countiesToShow);
          setLoadingCounties(false);
        }, 300);
      } catch (error) {
        console.error('Error loading counties:', error);
        setLoadingCounties(false);
      }
    }
  };

  // Function to add markers based on selected MSA
  const addMarkers = (msaData) => {
    if (!map.current || !networkData) return;

    clearMarkers();
    const newMarkers = [];

    // Generate coordinates around the MSA center
    const baseCoords = msaData.coordinates;
    
    // Add PG center marker
    const pgMarkerElement = document.createElement('div');
    pgMarkerElement.className = 'pg-marker';
    pgMarkerElement.innerHTML = `
      <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-indigo-200 animate-pulse">
        <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <div class="w-3 h-3 bg-indigo-600 rounded-full"></div>
        </div>
      </div>
    `;

    const pgMarker = new mapboxgl.Marker(pgMarkerElement)
      .setLngLat(baseCoords)
      .setPopup(
        new mapboxgl.Popup({ offset: 30, className: 'custom-popup' })
          .setHTML(`
            <div class="p-4 bg-white rounded-lg shadow-lg border-0">
              <h3 class="font-bold text-lg text-indigo-700 mb-2">${networkData.center.name}</h3>
              <div class="space-y-2">
                <p class="text-sm text-gray-600 flex items-center">
                  <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  ${networkData.center.patients} patients
                </p>
                <p class="text-sm text-indigo-600 font-medium">📍 Physician Group</p>
                <p class="text-xs text-gray-500 mt-2 border-t pt-2">${msaData.name}</p>
              </div>
            </div>
          `)
      )
      .addTo(map.current);

    newMarkers.push(pgMarker);

    // Add HHA markers around the PG center
    networkData.hhas.forEach((hha, index) => {
      // Generate coordinates in a radius around the MSA center
      const angle = (index * 360) / networkData.hhas.length;
      const distance = 0.08 + Math.random() * 0.12; // Random distance between 0.08 and 0.2 degrees
      const lng = baseCoords[0] + Math.cos(angle * Math.PI / 180) * distance;
      const lat = baseCoords[1] + Math.sin(angle * Math.PI / 180) * distance;

      const hhaMarkerElement = document.createElement('div');
      hhaMarkerElement.className = 'hha-marker';
      hhaMarkerElement.innerHTML = `
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl border-3 border-white ring-3 ring-blue-200 hover:scale-110 transition-transform">
          <div class="w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      `;

      const hhaMarker = new mapboxgl.Marker(hhaMarkerElement)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: 'custom-popup' })
            .setHTML(`
              <div class="p-4 bg-white rounded-lg shadow-lg border-0">
                <h3 class="font-bold text-lg text-blue-700 mb-2">${hha.name}</h3>
                <div class="space-y-2">
                  <p class="text-sm text-gray-600 flex items-center">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    ${hha.patients} patients
                  </p>
                  <p class="text-sm text-blue-600 font-medium">🏠 Home Health Agency</p>
                  <p class="text-xs text-gray-500 mt-2 border-t pt-2">${msaData.name}</p>
                </div>
              </div>
            `)
        )
        .addTo(map.current);

      newMarkers.push(hhaMarker);
    });

    setMarkers(newMarkers);
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    console.log('Initializing Mapbox map...');
    console.log('Access token available:', !!mapboxgl.accessToken);
    
    if (!mapContainer.current) {
      console.error('Map container not found');
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // Use a more reliable style first
        center: selectedMSA.coordinates,
        zoom: selectedMSA.zoom,
        pitch: 0, // Start with 2D to avoid issues
        bearing: 0,
        antialias: true
      });

      // Configure the map for cleaner appearance
      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
        console.log('Map container dimensions:', mapContainer.current?.getBoundingClientRect());
        
        // Force resize after load
        setTimeout(() => {
          map.current?.resize();
        }, 100);
        
        addMarkers(selectedMSA);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

      map.current.on('styledata', () => {
        console.log('Map style loaded');
      });

    } catch (error) {
      console.error('Error initializing Mapbox:', error);
    }

    return () => {
      if (map.current) {
        console.log('Cleaning up Mapbox map...');
        clearMarkers();
        clearCountyMarkers();
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map when MSA selection changes
  useEffect(() => {
    if (map.current && selectedMSA) {
      map.current.flyTo({
        center: selectedMSA.coordinates,
        zoom: selectedMSA.zoom,
        pitch: 45, // Maintain 3D tilt
        bearing: 0,
        duration: 1500,
        essential: true
      });

      // Wait for the fly animation to complete before adding markers
      setTimeout(() => {
        addMarkers(selectedMSA);
      }, 1000);
    }
  }, [selectedMSA, networkData]);

  // Update county display when state selection or dataset changes
  useEffect(() => {
    console.log(`County useEffect triggered: showCounties=${showCounties}, useCompleteDataset=${useCompleteDataset}, map.current=${!!map.current}`);
    
    if (showCounties && map.current) {
      setLoadingCounties(true);
      
      setTimeout(() => {
        const countiesToShow = getFilteredCounties();
        addCountyMarkers(countiesToShow);
        setLoadingCounties(false);
      }, 200);
    }
  }, [selectedState, showCounties, useCompleteDataset, completeDataset]);

  const handleMSAChange = (msaName) => {
    const msa = US_MSAs.find(m => m.name === msaName);
    if (msa) {
      setSelectedMSA(msa);
    }
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    
    if (map.current) {
      if (state === 'all') {
        // Zoom out to show all US
        map.current.flyTo({
          center: [-98.5795, 39.8283], // Center of US
          zoom: 4,
          pitch: 45,
          bearing: 0,
          duration: 1500,
          essential: true
        });
      } else {
        // Zoom to specific state
        const stateCoords = US_STATE_COORDINATES[state];
        if (stateCoords) {
          map.current.flyTo({
            center: stateCoords,
            zoom: 6.5, // Good zoom level for state view
            pitch: 45,
            bearing: 0,
            duration: 1500,
            essential: true
          });
        }
      }
      
      // Wait for zoom animation to complete, then update counties
      setTimeout(() => {
        if (showCounties) {
          const filteredCounties = getFilteredCounties();
          console.log(`Showing ${filteredCounties.length} counties for state: ${state}`);
          addCountyMarkers(filteredCounties);
        }
      }, 1600);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Dataset Info */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="text-gray-600">🇺🇸 US Counties Database</span>
            <Button
              onClick={toggleDataset}
              variant="outline"
              size="sm"
              disabled={loadingCounties}
              className="h-7 text-xs"
            >
              {loadingCounties && useCompleteDataset ? 'Loading 3,096 Counties...' : 
               useCompleteDataset ? 'Use Sample Dataset' : 'Load All 3,096 Counties'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getCurrentDataset().length} counties loaded
            </Badge>
            {useCompleteDataset && datasetStats && (
              <Badge variant="secondary" className="text-xs">
                🗺️ Complete 3,096 Counties
              </Badge>
            )}
          </div>
        </div>
        {useCompleteDataset && datasetStats && (
          <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-xs text-emerald-700 grid grid-cols-2 md:grid-cols-4 gap-2">
              <span>📊 {datasetStats.totalCounties.toLocaleString()} Counties</span>
              <span>🏛️ {datasetStats.totalStates} States</span>
              <span>👥 {datasetStats.totalPopulation.toLocaleString()} People</span>
              <span>📈 {datasetStats.avgPopulation.toLocaleString()} Avg Pop</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="space-y-4 mb-4">
        {/* MSA Selector Dropdown */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Metropolitan Statistical Area
          </label>
          <Select value={selectedMSA.name} onValueChange={handleMSAChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Metropolitan Statistical Area" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {US_MSAs.map((msa) => (
                <SelectItem key={msa.name} value={msa.name}>
                  {msa.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* County Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              onClick={toggleCounties}
              variant={showCounties ? "default" : "outline"}
              size="sm"
              disabled={loadingCounties}
            >
              {loadingCounties ? 'Loading...' : (showCounties ? 'Hide Counties' : 'Show Counties')}
            </Button>
            {showCounties && !loadingCounties && (
              <Badge variant="secondary" className="text-xs">
                {getFilteredCounties().length} counties visible
                {selectedState !== 'all' && ` in ${selectedState}`}
              </Badge>
            )}
            {loadingCounties && (
              <Badge variant="outline" className="text-xs">
                Loading counties...
              </Badge>
            )}
          </div>
          
          {showCounties && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by State:</label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">All States</SelectItem>
                  {getCurrentStates().map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      
      {/* Map Container */}
      <div className="relative w-full">
        <div 
          ref={mapContainer} 
          className="w-full h-80 rounded-lg shadow-lg bg-gray-100 border border-gray-200"
          style={{ 
            height: '320px',
            backgroundColor: '#f3f4f6',
            position: 'relative',
            overflow: 'hidden'
          }}
        />
        
        {/* Loading Overlay */}
        {loadingCounties && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">
                {useCompleteDataset ? 'Loading complete dataset...' : 'Loading counties...'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Map Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full border-2 border-white"></div>
          <span className="text-gray-600">Physician Group</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full border-2 border-white"></div>
          <span className="text-gray-600">Home Health Agency</span>
        </div>
        {showCounties && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full border-2 border-white"></div>
            <span className="text-gray-600">US Counties</span>
          </div>
        )}
      </div>
    </div>
  );
}