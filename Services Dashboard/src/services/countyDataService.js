// County Data Service - Handles loading and management of large county datasets
// This service provides methods to load county data efficiently

export class CountyDataService {
  constructor() {
    this.cache = new Map();
    this.isLoading = false;
  }

  // Simulates loading a complete dataset of 3,096+ counties
  async loadCompleteCountyData() {
    if (this.cache.has('complete')) {
      return this.cache.get('complete');
    }

    this.isLoading = true;
    
    try {
      // In a real application, this would fetch from an API or database
      // For now, we'll generate a comprehensive dataset programmatically
      const completeData = await this.generateCompleteDataset();
      
      this.cache.set('complete', completeData);
      this.isLoading = false;
      
      return completeData;
    } catch (error) {
      this.isLoading = false;
      throw error;
    }
  }

  // Generates a comprehensive county dataset
  async generateCompleteDataset() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const counties = this.createComprehensiveCountyList();
        resolve({
          counties,
          metadata: {
            totalCount: counties.length,
            generatedAt: new Date().toISOString(),
            coverage: 'All US states, DC, and territories'
          }
        });
      }, 1500); // Simulate loading time
    });
  }

  // Creates a comprehensive list of US counties
  createComprehensiveCountyList() {
    const counties = [];
    
    // State configurations with approximate county counts
    const stateConfigs = [
      { name: 'Alabama', abbr: 'AL', counties: 67, centerLat: 32.7794, centerLng: -86.8287 },
      { name: 'Alaska', abbr: 'AK', counties: 29, centerLat: 64.0685, centerLng: -152.2782 },
      { name: 'Arizona', abbr: 'AZ', counties: 15, centerLat: 34.2744, centerLng: -111.6602 },
      { name: 'Arkansas', abbr: 'AR', counties: 75, centerLat: 34.8938, centerLng: -92.4426 },
      { name: 'California', abbr: 'CA', counties: 58, centerLat: 37.1841, centerLng: -119.4696 },
      { name: 'Colorado', abbr: 'CO', counties: 64, centerLat: 38.9972, centerLng: -105.5478 },
      { name: 'Connecticut', abbr: 'CT', counties: 8, centerLat: 41.6219, centerLng: -72.7273 },
      { name: 'Delaware', abbr: 'DE', counties: 3, centerLat: 39.1526, centerLng: -75.4196 },
      { name: 'Florida', abbr: 'FL', counties: 67, centerLat: 28.6305, centerLng: -82.4497 },
      { name: 'Georgia', abbr: 'GA', counties: 159, centerLat: 32.3617, centerLng: -83.3732 },
      { name: 'Hawaii', abbr: 'HI', counties: 5, centerLat: 20.2927, centerLng: -156.3737 },
      { name: 'Idaho', abbr: 'ID', counties: 44, centerLat: 44.3509, centerLng: -114.6130 },
      { name: 'Illinois', abbr: 'IL', counties: 102, centerLat: 40.0417, centerLng: -89.1965 },
      { name: 'Indiana', abbr: 'IN', counties: 92, centerLat: 39.7662, centerLng: -86.4755 },
      { name: 'Iowa', abbr: 'IA', counties: 99, centerLat: 42.0751, centerLng: -93.4960 },
      { name: 'Kansas', abbr: 'KS', counties: 105, centerLat: 38.4937, centerLng: -98.3804 },
      { name: 'Kentucky', abbr: 'KY', counties: 120, centerLat: 37.5347, centerLng: -85.3021 },
      { name: 'Louisiana', abbr: 'LA', counties: 64, centerLat: 31.0689, centerLng: -91.9968 },
      { name: 'Maine', abbr: 'ME', counties: 16, centerLat: 45.3695, centerLng: -69.2169 },
      { name: 'Maryland', abbr: 'MD', counties: 24, centerLat: 39.0550, centerLng: -76.7909 },
      { name: 'Massachusetts', abbr: 'MA', counties: 14, centerLat: 42.2596, centerLng: -71.8083 },
      { name: 'Michigan', abbr: 'MI', counties: 83, centerLat: 44.3467, centerLng: -85.4102 },
      { name: 'Minnesota', abbr: 'MN', counties: 87, centerLat: 46.2807, centerLng: -94.3053 },
      { name: 'Mississippi', abbr: 'MS', counties: 82, centerLat: 32.6873, centerLng: -89.6602 },
      { name: 'Missouri', abbr: 'MO', counties: 115, centerLat: 38.3566, centerLng: -92.4580 },
      { name: 'Montana', abbr: 'MT', counties: 56, centerLat: 47.0527, centerLng: -109.6333 },
      { name: 'Nebraska', abbr: 'NE', counties: 93, centerLat: 41.5378, centerLng: -99.7951 },
      { name: 'Nevada', abbr: 'NV', counties: 17, centerLat: 39.3289, centerLng: -116.6312 },
      { name: 'New Hampshire', abbr: 'NH', counties: 10, centerLat: 43.6805, centerLng: -71.5811 },
      { name: 'New Jersey', abbr: 'NJ', counties: 21, centerLat: 40.1907, centerLng: -74.7429 },
      { name: 'New Mexico', abbr: 'NM', counties: 33, centerLat: 34.4071, centerLng: -106.1126 },
      { name: 'New York', abbr: 'NY', counties: 62, centerLat: 42.9538, centerLng: -75.5268 },
      { name: 'North Carolina', abbr: 'NC', counties: 100, centerLat: 35.5557, centerLng: -79.3877 },
      { name: 'North Dakota', abbr: 'ND', counties: 53, centerLat: 47.4501, centerLng: -100.4659 },
      { name: 'Ohio', abbr: 'OH', counties: 88, centerLat: 40.2862, centerLng: -82.7937 },
      { name: 'Oklahoma', abbr: 'OK', counties: 77, centerLat: 35.5889, centerLng: -97.4943 },
      { name: 'Oregon', abbr: 'OR', counties: 36, centerLat: 43.9336, centerLng: -120.5583 },
      { name: 'Pennsylvania', abbr: 'PA', counties: 67, centerLat: 40.8781, centerLng: -77.7996 },
      { name: 'Rhode Island', abbr: 'RI', counties: 5, centerLat: 41.5827, centerLng: -71.5065 },
      { name: 'South Carolina', abbr: 'SC', counties: 46, centerLat: 33.9169, centerLng: -80.8964 },
      { name: 'South Dakota', abbr: 'SD', counties: 66, centerLat: 44.4473, centerLng: -100.2263 },
      { name: 'Tennessee', abbr: 'TN', counties: 95, centerLat: 35.8580, centerLng: -86.3505 },
      { name: 'Texas', abbr: 'TX', counties: 254, centerLat: 31.4757, centerLng: -99.3312 },
      { name: 'Utah', abbr: 'UT', counties: 29, centerLat: 39.3210, centerLng: -111.0937 },
      { name: 'Vermont', abbr: 'VT', counties: 14, centerLat: 44.2601, centerLng: -72.5806 },
      { name: 'Virginia', abbr: 'VA', counties: 134, centerLat: 37.5215, centerLng: -78.8537 },
      { name: 'Washington', abbr: 'WA', counties: 39, centerLat: 47.3826, centerLng: -120.4472 },
      { name: 'West Virginia', abbr: 'WV', counties: 55, centerLat: 38.6409, centerLng: -80.6227 },
      { name: 'Wisconsin', abbr: 'WI', counties: 72, centerLat: 44.6243, centerLng: -89.9941 },
      { name: 'Wyoming', abbr: 'WY', counties: 23, centerLat: 42.9957, centerLng: -107.5512 },
      { name: 'District of Columbia', abbr: 'DC', counties: 1, centerLat: 38.9047, centerLng: -77.0164 }
    ];

    let countyId = 1;
    
    stateConfigs.forEach(state => {
      const { name, abbr, counties: countyCount, centerLat, centerLng } = state;
      
      for (let i = 1; i <= countyCount; i++) {
        // Generate realistic county names
        const countyTypes = ['County', 'Parish', 'Borough', 'Census Area'];
        const countyType = name === 'Louisiana' ? 'Parish' : 
                          name === 'Alaska' ? (Math.random() > 0.5 ? 'Borough' : 'Census Area') : 
                          'County';
        
        // Generate coordinates around state center
        const latOffset = (Math.random() - 0.5) * 4; // ±2 degrees
        const lngOffset = (Math.random() - 0.5) * 4; // ±2 degrees
        
        const countyName = this.generateCountyName(i, state.name);
        
        counties.push({
          id: countyId++,
          name: `${countyName} ${countyType}`,
          state: name,
          stateAbbr: abbr,
          coordinates: [centerLng + lngOffset, centerLat + latOffset],
          population: Math.floor(Math.random() * 500000) + 5000, // 5K to 505K population
          fips: `${String(stateConfigs.indexOf(state) + 1).padStart(2, '0')}${String(i * 2 + 1).padStart(3, '0')}`,
          area: Math.floor(Math.random() * 2000) + 100, // 100 to 2100 sq miles
          density: 0 // Will be calculated
        });
      }
    });

    // Calculate population density
    counties.forEach(county => {
      county.density = Math.round(county.population / county.area);
    });

    return counties;
  }

  // Generates realistic county names
  generateCountyName(index, stateName) {
    const commonNames = [
      'Washington', 'Jefferson', 'Franklin', 'Jackson', 'Lincoln', 'Madison', 'Monroe', 'Adams',
      'Wilson', 'Johnson', 'Anderson', 'Thompson', 'Brown', 'Davis', 'Miller', 'Clark',
      'Lewis', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill',
      'Scott', 'Green', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez',
      'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins',
      'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell',
      'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward'
    ];

    const geographicNames = [
      'Cedar', 'Pine', 'Oak', 'Maple', 'River', 'Lake', 'Mountain', 'Valley', 'Creek',
      'Ridge', 'Springs', 'Falls', 'Rock', 'Stone', 'Iron', 'Silver', 'Gold', 'Red',
      'Blue', 'White', 'Green', 'Black', 'Clear', 'Deep', 'High', 'New', 'Old', 'Grand'
    ];

    if (index <= commonNames.length) {
      return commonNames[index - 1];
    } else {
      const geographic = geographicNames[index % geographicNames.length];
      const common = commonNames[index % commonNames.length];
      return Math.random() > 0.5 ? geographic : `${geographic} ${common}`;
    }
  }

  // Get cached data
  getCachedData(key) {
    return this.cache.get(key);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Check if loading
  getLoadingStatus() {
    return this.isLoading;
  }
}

// Export singleton instance
export const countyDataService = new CountyDataService();