import React from 'react';
import { Filter, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAvailableRegions } from '@/constants/regionConstants';
import { hasAdvancedFiltersActive } from '@/utils/customer-success/filterUtils';

export const AdvancedFilters = ({
  filters,
  setRegionTypeFilter,
  setRegionNameFilter,
  setCategoryFilter,
  setChannelFilter,
  setStatusFilter,
  clearAllFilters
}) => {
  const {
    regionTypeFilter,
    regionNameFilter,
    categoryFilter,
    channelFilter,
    statusFilter
  } = filters;

  const availableRegions = getAvailableRegions(regionTypeFilter);
  const filtersActive = hasAdvancedFiltersActive(filters);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          Advanced Filters
        </h3>
        {filtersActive && (
          <Button
            onClick={clearAllFilters}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <XCircle className="w-4 h-4" />
            Clear All Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Region Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region Type
          </label>
          <select
            value={regionTypeFilter}
            onChange={(e) => setRegionTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
          >
            <option value="all">All Types</option>
            <option value="division">Division</option>
            <option value="divisionalGroup">Divisional Group</option>
            <option value="msa">MSA</option>
            <option value="gsa">GSA</option>
          </select>
        </div>

        {/* Region Name Filter (Dynamic) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region Name
          </label>
          <select
            value={regionNameFilter}
            onChange={(e) => setRegionNameFilter(e.target.value)}
            disabled={regionTypeFilter === 'all'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">All Regions</option>
            {availableRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical</option>
            <option value="clinical">Clinical</option>
            <option value="operational">Operational/Patient Services</option>
            <option value="queries">Queries</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel
          </label>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
          >
            <option value="all">All Channels</option>
            <option value="email">Email</option>
            <option value="ticket">Ticket</option>
            <option value="call">Call</option>
          </select>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {filtersActive && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          {regionTypeFilter !== 'all' && (
            <Badge className="bg-indigo-100 text-indigo-800">
              Region Type: {regionTypeFilter}
            </Badge>
          )}
          {regionNameFilter !== 'all' && (
            <Badge className="bg-indigo-100 text-indigo-800">
              Region: {regionNameFilter}
            </Badge>
          )}
          {categoryFilter !== 'all' && (
            <Badge className="bg-indigo-100 text-indigo-800">
              Category: {categoryFilter}
            </Badge>
          )}
          {channelFilter !== 'all' && (
            <Badge className="bg-indigo-100 text-indigo-800">
              Channel: {channelFilter}
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge className="bg-indigo-100 text-indigo-800">
              Status: {statusFilter}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

