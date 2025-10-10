# Customer Success Components

This directory contains all modular, reusable components for the Customer Success Dashboard.

## 📁 Directory Structure

```
customer-success/
├── issues/                          # Issue-related components
│   └── IssueCategorizationCard.jsx  # Card for categorizing individual issues
├── modals/                          # Modal dialogs
│   └── UnsolvedIssuesModal.jsx      # Modal for managing unsolved issues
├── statistics/                      # Statistics and filtering components
│   ├── IssueStatisticsCards.jsx     # Summary statistics cards
│   ├── PriorityFilterDropdown.jsx   # Priority filter dropdown
│   └── AdvancedFilters.jsx          # Advanced filtering UI
├── index.js                         # Barrel export file
└── README.md                        # This file
```

## 🧩 Components Overview

### Issues Components

#### `IssueCategorizationCard`
Displays an individual issue with categorization capabilities.

**Props:**
```typescript
{
  issue: Object,                        // Issue data object
  index: number,                        // Index for animation delay
  issueCategorizationData: Object,      // Saved categorization data
  editingIssueId: string | null,        // Currently editing issue ID
  setEditingIssueId: Function,          // Set editing issue
  handleSaveCategorization: Function,   // Save categorization handler
  issueTypeOptions: Array,              // Available issue types
  currentUser: string                   // Current user name
}
```

**Features:**
- ✨ Expandable full description with attachments
- 📝 Categorization form (type, reason, priority)
- ✅ Save/Edit functionality with user attribution
- 🎨 Visual feedback for categorized vs uncategorized
- 📎 Attachment viewing

**Usage:**
```jsx
import { IssueCategorizationCard } from '@/components/customer-success';

<IssueCategorizationCard
  issue={issue}
  index={0}
  issueCategorizationData={data}
  editingIssueId={null}
  setEditingIssueId={setEditing}
  handleSaveCategorization={handleSave}
  issueTypeOptions={options}
  currentUser="John Doe"
/>
```

---

### Modals Components

#### `UnsolvedIssuesModal`
Modal for bulk management and categorization of unsolved issues.

**Props:**
```typescript
{
  open: boolean,                        // Modal open state
  onOpenChange: Function,               // Toggle modal
  issueCategories: Object,              // All issue categories
  issueCategorizationData: Object,      // Categorization data
  editingIssueId: string | null,        // Editing issue ID
  setEditingIssueId: Function,          // Set editing issue
  handleSaveCategorization: Function,   // Save handler
  currentUser: string                   // Current user
}
```

**Features:**
- 📊 Summary statistics (total, categorized, pending)
- 📋 Instructions panel
- 🎯 List of all unsolved issues
- 🔄 Real-time categorization updates

**Usage:**
```jsx
import { UnsolvedIssuesModal } from '@/components/customer-success';

<UnsolvedIssuesModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  issueCategories={categories}
  issueCategorizationData={data}
  editingIssueId={editing}
  setEditingIssueId={setEditing}
  handleSaveCategorization={handleSave}
  currentUser="John Doe"
/>
```

---

### Statistics Components

#### `IssueStatisticsCards`
Displays summary statistics as interactive cards.

**Props:**
```typescript
{
  issueStatistics: Object,              // Statistics object
  priorityFilter: string,               // Current priority filter
  setPriorityFilter: Function,          // Set priority filter
  setUnsolvedModalOpen: Function        // Open unsolved modal
}
```

**Features:**
- 🎯 Three clickable cards (Total, Solved, Unsolved)
- 🎨 Visual indication of active filter
- 📊 Dynamic counts from statistics
- ⚡ Smooth animations on hover/click

**Usage:**
```jsx
import { IssueStatisticsCards } from '@/components/customer-success';

<IssueStatisticsCards
  issueStatistics={stats}
  priorityFilter={filter}
  setPriorityFilter={setFilter}
  setUnsolvedModalOpen={setModal}
/>
```

---

#### `PriorityFilterDropdown`
Dropdown for filtering issues by priority level.

**Props:**
```typescript
{
  priorityFilter: string,               // Current priority filter
  setPriorityFilter: Function,          // Set priority filter
  issueStatistics: Object               // Statistics for counts
}
```

**Features:**
- 🎯 Filter by All, Critical, High, Medium, Low
- 🔢 Dynamic counts per priority level
- 🎨 Emoji indicators for each level
- ⚡ Instant filtering

**Usage:**
```jsx
import { PriorityFilterDropdown } from '@/components/customer-success';

<PriorityFilterDropdown
  priorityFilter={filter}
  setPriorityFilter={setFilter}
  issueStatistics={stats}
/>
```

---

#### `AdvancedFilters`
Comprehensive filtering UI for issues.

**Props:**
```typescript
{
  filters: Object,                      // All filter values
  setRegionTypeFilter: Function,        // Set region type
  setRegionNameFilter: Function,        // Set region name
  setCategoryFilter: Function,          // Set category
  setChannelFilter: Function,           // Set channel
  setStatusFilter: Function,            // Set status
  clearAllFilters: Function             // Clear all filters
}
```

**Features:**
- 🌍 Region type and name filters (cascading)
- 📂 Category filter
- 📱 Channel filter (Email, Call, Ticket)
- 🏷️ Active filter badges
- 🧹 Clear all filters button

**Usage:**
```jsx
import { AdvancedFilters } from '@/components/customer-success';

<AdvancedFilters
  filters={filters}
  setRegionTypeFilter={setRegionType}
  setRegionNameFilter={setRegionName}
  setCategoryFilter={setCategory}
  setChannelFilter={setChannel}
  setStatusFilter={setStatus}
  clearAllFilters={clearAll}
/>
```

---

## 📦 Barrel Export

All components are exported from `index.js` for convenient importing:

```jsx
// Instead of:
import IssueStatisticsCards from './statistics/IssueStatisticsCards';
import PriorityFilterDropdown from './statistics/PriorityFilterDropdown';
import AdvancedFilters from './statistics/AdvancedFilters';

// Use:
import {
  IssueStatisticsCards,
  PriorityFilterDropdown,
  AdvancedFilters
} from '@/components/customer-success';
```

## 🎨 Styling

All components use:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Shadcn/ui** base components (Card, Badge, Button, etc.)
- **Lucide React** for icons

## 🔧 Dependencies

### Required Packages
```json
{
  "react": "^18.x",
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "@radix-ui/react-*": "^1.x"
}
```

### Internal Dependencies
```javascript
// UI Components
'@/components/ui/card'
'@/components/ui/badge'
'@/components/ui/button'
'@/components/ui/dialog'

// Constants
'@/constants/issueConstants'
'@/constants/regionConstants'

// Utils
'@/utils/customer-success/filterUtils'
```

## 🧪 Testing

### Unit Tests Example
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { IssueStatisticsCards } from '@/components/customer-success';

describe('IssueStatisticsCards', () => {
  it('renders all three cards', () => {
    const stats = {
      totalIssues: 10,
      solvedIssues: 5,
      unsolvedIssues: 5
    };
    
    render(
      <IssueStatisticsCards
        issueStatistics={stats}
        priorityFilter="all"
        setPriorityFilter={jest.fn()}
        setUnsolvedModalOpen={jest.fn()}
      />
    );
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

## 📝 Best Practices

### 1. **Props Validation**
Always validate props in development:
```javascript
if (process.env.NODE_ENV === 'development') {
  Component.propTypes = {
    // ... prop types
  };
}
```

### 2. **Memoization**
For expensive computations:
```javascript
const filteredIssues = useMemo(() => 
  filterIssues(issues, filters),
  [issues, filters]
);
```

### 3. **Callback Optimization**
For passed-down handlers:
```javascript
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

### 4. **Error Boundaries**
Wrap components in error boundaries:
```javascript
<ErrorBoundary fallback={<ErrorMessage />}>
  <YourComponent />
</ErrorBoundary>
```

## 🚀 Performance Tips

1. **Lazy Load Modals**: Use `React.lazy()` for modal components
2. **Virtual Scrolling**: For long lists of issues
3. **Debounce Filters**: Delay filter application for better UX
4. **Code Splitting**: Split by route or feature

## 📚 Further Reading

- [Component Design Patterns](../../ARCHITECTURE.md)
- [State Management](../../../hooks/customer-success/README.md)
- [Utility Functions](../../../utils/customer-success/README.md)
- [Constants](../../../constants/README.md)

## 🤝 Contributing

When adding new components:
1. Follow the existing folder structure
2. Add comprehensive JSDoc comments
3. Update this README
4. Add unit tests
5. Update the barrel export in `index.js`

## 📄 License

Same as the main project.

---

**Last Updated**: October 11, 2025  
**Maintained By**: Development Team

