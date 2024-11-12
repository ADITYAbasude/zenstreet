import React from 'react';

const SearchFilter = ({ 
  searchQuery, 
  onSearchChange, 
  selectedType,
  onTypeChange,
  dateRange,
  onDateRangeChange 
}) => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search events..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="text">Text Only</option>
            <option value="image">With Image</option>
            <option value="video">With Video</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-lg"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ 
              ...dateRange, 
              start: e.target.value 
            })}
          />
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-lg"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ 
              ...dateRange, 
              end: e.target.value 
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
