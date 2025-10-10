# Customer Success Dashboard - Modular Architecture

This document describes the modularized structure of the Customer Success Dashboard.

## 📁 Project Structure

```
src/
├── components/
│   ├── customer-success/
│   │   ├── issues/
│   │   │   └── IssueCategorizationCard.jsx    # Individual issue card component
│   │   ├── modals/
│   │   │   └── UnsolvedIssuesModal.jsx         # Modal for unsolved issues management
│   │   ├── statistics/
│   │   │   ├── IssueStatisticsCards.jsx        # Statistics summary cards
│   │   │   ├── PriorityFilterDropdown.jsx      # Priority filter component
│   │   │   └── AdvancedFilters.jsx             # Advanced filtering UI
│   │   └── index.js                            # Barrel export for all components
│   ├── CustomerSuccessTab.jsx                  # Main container component
│   └── ui/                                     # Shadcn/ui components
├── constants/
│   ├── issueConstants.js                       # Issue types, priorities, channels
│   └── regionConstants.js                      # Region hierarchy data
├── hooks/
│   └── customer-success/
│       └── useIssueManagement.js               # Custom hook for issue state management
├── utils/
│   └── customer-success/
│       ├── priorityCalculator.js               # Priority calculation logic
│       └── filterUtils.js                      # Filtering utilities
└── data/
    └── detailedCommunications.js               # Mock data for issues
```

## 🧩 Component Breakdown

### 1. **Components** (`/components/customer-success/`)

#### **Issues**
- `IssueCategorizationCard.jsx`: Displays individual issue with categorization form
  - Props: issue, issueCategorizationData, handlers, etc.
  - Features: Expandable description, attachment viewing, categorization form

#### **Modals**
- `UnsolvedIssuesModal.jsx`: Modal for managing all unsolved issues
  - Props: issueCategories, categorization data, handlers
  - Features: Summary stats, bulk categorization

#### **Statistics**
- `IssueStatisticsCards.jsx`: Displays total/solved/unsolved issue cards
  - Props: issueStatistics, priorityFilter, handlers
  - Features: Clickable cards, filter indicators

- `PriorityFilterDropdown.jsx`: Dropdown for priority filtering
  - Props: priorityFilter, issueStatistics, handler
  - Features: Dynamic counts per priority level

- `AdvancedFilters.jsx`: Advanced filtering UI
  - Props: filters, filter setters, clearAllFilters handler
  - Features: Region, category, channel filters with active filter badges

### 2. **Constants** (`/constants/`)

#### `issueConstants.js`
- `issueTypeOptions`: Available issue types for categorization
- `issueCategoryIcons`: Icons for each issue category
- `issueCategoryColors`: Color schemes for categories
- `priorityLevels`: Priority level definitions
- `channelTypes`: Channel types (email, call, ticket)
- `statusTypes`: Status type definitions

#### `regionConstants.js`
- `regionHierarchy`: Hierarchical region data (division, divisionalGroup, msa, gsa)
- `getAvailableRegions(type)`: Helper to get regions by type

### 3. **Hooks** (`/hooks/customer-success/`)

#### `useIssueManagement.js`
Custom hook that manages:
- All filter states (priority, region, category, channel, status)
- Issue categorization data
- Modal states
- Issue resolution panel state
- Computed values (filters object, issue statistics)
- Handler functions

**Benefits:**
- Centralizes state management
- Reduces component complexity
- Makes state reusable across components
- Optimizes performance with useMemo

### 4. **Utils** (`/utils/customer-success/`)

#### `priorityCalculator.js`
- `calculateDynamicPriority(issue)`: Calculates priority based on age, keywords, category
- `formatTimeSince(dateString)`: Formats time difference
- `getUrgencyIndicator(daysOpen)`: Returns urgency level indicator

#### `filterUtils.js`
- `applyAdvancedFilters(issues, filters)`: Applies all active filters
- `filterIssuesByPriority(issues, priority)`: Filters by priority level
- `hasAdvancedFiltersActive(filters)`: Checks if any filters are active
- `getAllIssues(issueCategories)`: Gets all issues from categories
- `calculateIssueStatistics(issueCategories, filters)`: Calculates statistics
- `getAllUnsolvedIssues(issueCategories)`: Gets all unsolved issues

## 🔄 Data Flow

```
CustomerSuccessTab (Main Component)
  ↓
useIssueManagement Hook (State Management)
  ↓
Child Components (UI Rendering)
  ↓
Utils & Constants (Business Logic & Data)
```

## 📝 Usage Example

```jsx
import { useIssueManagement } from '@/hooks/customer-success/useIssueManagement';
import { 
  IssueStatisticsCards,
  PriorityFilterDropdown,
  AdvancedFilters,
  UnsolvedIssuesModal
} from '@/components/customer-success';

function MyComponent() {
  const {
    priorityFilter,
    setPriorityFilter,
    issueStatistics,
    filters,
    // ... other state and handlers
  } = useIssueManagement(issueCategories);

  return (
    <div>
      <IssueStatisticsCards
        issueStatistics={issueStatistics}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      <PriorityFilterDropdown
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        issueStatistics={issueStatistics}
      />
      <AdvancedFilters
        filters={filters}
        setRegionTypeFilter={setRegionTypeFilter}
        // ... other props
      />
    </div>
  );
}
```

## 🎯 Benefits of This Architecture

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be used in different contexts
3. **Testability**: Easier to write unit tests for isolated components
4. **Performance**: Optimized with useMemo and proper state management
5. **Scalability**: Easy to add new features without touching existing code
6. **Readability**: Clear separation of concerns and logical organization
7. **Collaboration**: Multiple developers can work on different modules

## 🚀 Next Steps

To further improve the architecture:

1. Add TypeScript for type safety
2. Create unit tests for utils and components
3. Add Storybook for component documentation
4. Implement lazy loading for modals
5. Add error boundaries for robustness
6. Create a data service layer for API integration
7. Add Redux or Zustand if global state becomes complex

## 📚 Documentation

- Each component includes JSDoc comments
- Props are clearly documented
- Utility functions have descriptive names and comments
- Constants are organized by category

## 🔧 Development Guidelines

1. Keep components small and focused
2. Use custom hooks for complex logic
3. Extract repeated patterns into utilities
4. Keep business logic separate from UI components
5. Use constants instead of magic strings/numbers
6. Follow the established folder structure
7. Update this document when adding new modules

