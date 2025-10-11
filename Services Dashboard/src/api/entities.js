// Mock implementations to replace base44 SDK entities
import { 
  patients, 
  physicianGroups, 
  homeHealthAgencies, 
  actionItems, 
  billingCodes, 
  careCoordination, 
  documents, 
  userActivities 
} from '../data/mockData.js';

// Enhanced mock entity class with pre-loaded data
class MockEntity {
  constructor(name, initialData = []) {
    this.name = name;
    this.data = new Map();
    this.nextId = 1000; // Start with a high number to avoid conflicts
    
    // Pre-load data
    initialData.forEach(item => {
      this.data.set(item.id, item);
    });
  }

  async create(data) {
    const id = data.id || `${this.name.toLowerCase()}-${this.nextId++}`;
    const record = { 
      id, 
      ...data, 
      created_date: data.created_date || new Date().toISOString(),
      updated_date: data.updated_date || new Date().toISOString()
    };
    this.data.set(id, record);
    return record;
  }

  async findById(id) {
    return this.data.get(id) || null;
  }

  async findAll(query = {}) {
    const results = Array.from(this.data.values());
    
    // Simple filtering based on query
    if (Object.keys(query).length === 0) return results;
    
    return results.filter(item => {
      return Object.entries(query).every(([key, value]) => {
        if (typeof value === 'string' && typeof item[key] === 'string') {
          // Case-insensitive partial matching for strings
          return item[key].toLowerCase().includes(value.toLowerCase());
        }
        return item[key] === value;
      });
    });
  }

  async update(id, updates) {
    const record = this.data.get(id);
    if (!record) return null;
    
    const updated = { 
      ...record, 
      ...updates, 
      updated_date: new Date().toISOString() 
    };
    this.data.set(id, updated);
    return updated;
  }

  async delete(id) {
    return this.data.delete(id);
  }

  // Utility method to get count
  async count(query = {}) {
    const results = await this.findAll(query);
    return results.length;
  }

  // Compatibility method for legacy code expecting .list()
  async list(sortBy = '') {
    const results = await this.findAll();
    
    // Handle sorting if specified
    if (sortBy) {
      const isDescending = sortBy.startsWith('-');
      const field = sortBy.replace('-', '');
      
      return results.sort((a, b) => {
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        
        if (isDescending) {
          return bVal.localeCompare(aVal);
        }
        return aVal.localeCompare(bVal);
      });
    }
    
    return results;
  }

  // Utility method for pagination
  async findWithPagination(query = {}, page = 1, limit = 10) {
    const results = await this.findAll(query);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: results.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: results.length,
        totalPages: Math.ceil(results.length / limit)
      }
    };
  }
}

// Initialize mock entities with real data
export const Patient = new MockEntity('Patient', patients);
export const Document = new MockEntity('Document', documents);
export const PhysicianGroup = new MockEntity('PhysicianGroup', physicianGroups);
export const HomeHealthAgency = new MockEntity('HomeHealthAgency', homeHealthAgencies);
export const ActionItem = new MockEntity('ActionItem', actionItems);
export const BillingCode = new MockEntity('BillingCode', billingCodes);
export const CareCoordination = new MockEntity('CareCoordination', careCoordination);
export const UserActivity = new MockEntity('UserActivity', userActivities);

// Mock auth object with enhanced functionality
export const User = {
  currentUser: {
    id: 'user-1',
    email: 'admin@patientflow.com',
    name: 'Dr. Admin User',
    role: 'admin',
    department: 'Care Coordination',
    permissions: ['read', 'write', 'admin']
  },

  // Mock user list for the resolution center
  async list() {
    return [
      {
        id: 'user-1',
        email: 'admin@patientflow.com',
        name: 'Dr. Admin User',
        role: 'admin',
        department: 'Care Coordination'
      },
      {
        id: 'user-2',
        email: 'sarah.wilson@email.com',
        name: 'Dr. Sarah Wilson',
        role: 'physician',
        department: 'Primary Care'
      },
      {
        id: 'user-3',
        email: 'nurse.coordinator@email.com',
        name: 'Jane Coordinator',
        role: 'nurse',
        department: 'Care Coordination'
      },
      {
        id: 'user-4',
        email: 'billing.admin@email.com',
        name: 'Bill Admin',
        role: 'billing',
        department: 'Billing'
      }
    ];
  },

  async getCurrentUser() {
    return this.currentUser;
  },
  
  async login(credentials) {
    // Simulate authentication
    if (credentials.email && credentials.password) {
      return {
        user: this.currentUser,
        token: `mock-token-${Date.now()}`,
        expiresIn: 3600
      };
    }
    throw new Error('Invalid credentials');
  },
  
  async logout() {
    return { success: true, message: 'Logged out successfully' };
  },

  async updateProfile(updates) {
    this.currentUser = { ...this.currentUser, ...updates };
    return this.currentUser;
  }
};