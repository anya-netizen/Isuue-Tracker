import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Building, Network, MapPin, DollarSign, Calendar } from 'lucide-react';

export default function SelectionInterface({
  selectedDivisionGroup,
  selectedDivision,
  selectedMSA,
  selectedGSA,
  selectedPractice,
  onDivisionGroupChange,
  onDivisionChange,
  onMSAChange,
  onGSAChange,
  onPracticeChange,
  dateRange,
  onDateRangeChange,
  divisionGroups,
  divisions,
  msas,
  gsas,
  practices
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Division Group</label>
          <Select value={selectedDivisionGroup?.id || ''} onValueChange={onDivisionGroupChange}>
            <SelectTrigger className="bg-white/80">
              <SelectValue placeholder="Select Division Group" />
            </SelectTrigger>
            <SelectContent>
              {divisionGroups.map(group => (
                <SelectItem key={group.id} value={group.id}>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-xs text-gray-500">{group.region}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Division</label>
          <Select 
            value={selectedDivision?.id || ''} 
            onValueChange={onDivisionChange}
            disabled={!selectedDivisionGroup}
          >
            <SelectTrigger className="bg-white/80">
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map(division => (
                <SelectItem key={division.id} value={division.id}>
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="font-medium">{division.name}</p>
                      <p className="text-xs text-gray-500">{division.location}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">MSA</label>
          <Select 
            value={selectedMSA?.id || ''} 
            onValueChange={onMSAChange}
            disabled={!selectedDivision}
          >
            <SelectTrigger className="bg-white/80">
              <SelectValue placeholder="Select MSA" />
            </SelectTrigger>
            <SelectContent>
              {msas.map(msa => (
                <SelectItem key={msa.id} value={msa.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="font-medium">{msa.name}</p>
                      <p className="text-xs text-gray-500">Pop: {msa.population}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">GSA</label>
          <Select 
            value={selectedGSA?.id || ''} 
            onValueChange={onGSAChange}
            disabled={!selectedMSA}
          >
            <SelectTrigger className="bg-white/80">
              <SelectValue placeholder="Select GSA" />
            </SelectTrigger>
            <SelectContent>
              {gsas.map(gsa => (
                <SelectItem key={gsa.id} value={gsa.id}>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="font-medium">{gsa.name}</p>
                      <p className="text-xs text-gray-500">{gsa.contractValue}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Practice Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Practice</label>
          <Select 
            value={selectedPractice?.id || ''}
            onValueChange={onPracticeChange}
            disabled={!practices || practices.length === 0}
          >
            <SelectTrigger className="bg-white/80">
              <SelectValue placeholder="Select Practice" />
            </SelectTrigger>
            <SelectContent>
              {(practices || []).map(practice => (
                <SelectItem key={practice.id} value={practice.id}>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-medium">{practice.name}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <label className="text-sm font-medium text-gray-700">Date Range</label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
              onChange={(e) => onDateRangeChange(prev => ({ ...prev, from: new Date(e.target.value) }))}
              className="w-40"
            />
            <span className="text-gray-500">to</span>
            <Input
              type="date"
              value={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
              onChange={(e) => onDateRangeChange(prev => ({ ...prev, to: new Date(e.target.value) }))}
              className="w-40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

