import React, { useState, useEffect } from 'react';
import { CacheSystem } from '../utility/CachedVersionedData'; // Import CacheSystem
import { formatDistanceToNow } from 'date-fns'; // For date formatting

const CacheGrid: React.FC = () => {
  // State for cache data, search term, and pagination
  const [cacheData, setCacheData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [visibleData, setVisibleData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1); // Pagination starts with page 1

  useEffect(() => {
    // Load the cache from localStorage on initial load
    const loadedCacheData = loadCacheFromLocalStorage();
    if (loadedCacheData) {
      const siteCache = loadedCacheData.sites['HI']; // Getting the cache data for site "HI"
      const formattedData = formatCacheData(siteCache);
      setCacheData(formattedData);
      setVisibleData(formattedData.slice(0, 10)); // Initially show first 10 items
    }
  }, []);

  // Load cache from localStorage
  function loadCacheFromLocalStorage(): CacheSystem | null {
    const cacheData = localStorage.getItem('cacheSystem');
    if (cacheData) {
      return JSON.parse(cacheData);
    }
    return null;
  }

  // Format cache data with last used date and other details
  function formatCacheData(siteCache: any): any[] {
    const formattedData = Object.keys(siteCache).map((key) => ({
      key,
      data: siteCache[key],
      lastUsed: new Date(), // For this example, we assume the last used date is now
    }));
    return formattedData;
  }

  // Handle search functionality
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter cache data based on the search term
    const filteredData = cacheData.filter((item) =>
      item.key.toLowerCase().includes(term.toLowerCase())
    );

    // Update visible data based on filtered search and pagination
    setVisibleData(filteredData.slice(0, 10)); // Show first 10 matching items
  };

  // Handle load more functionality (pagination)
  const loadMore = () => {
    const newPage = page + 1;
    setPage(newPage);

    // Load the next 10 items
    const newVisibleData = cacheData.slice(0, newPage * 10);
    setVisibleData(newVisibleData);
  };

  // Handle the action when the "Add Search" button is clicked
  const handleAddSearchClick = (key: string) => {
    const dataToCache = key;
    // Here you can update the "HostInput" selector input (use state to control it)
    // For simplicity, we will just set the search term in the selector
    setSearchTerm(dataToCache);
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search Cache"
        style={{ marginBottom: '20px', padding: '5px' }}
      />

      {/* Cache Data Table */}
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Search</th>
            <th>Last Used</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleData.length === 0 ? (
            <tr>
              <td colSpan={4}>No data found</td>
            </tr>
          ) : (
            visibleData.map((item) => (
              <tr key={item.key}>
                <td>{item.key}</td>
                <td>{item.key}</td>
                <td>{formatDistanceToNow(item.lastUsed)} ago</td>
                <td>
                  <button onClick={() => handleAddSearchClick(item.key)}>Add Search</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Load More Button */}
      {visibleData.length < cacheData.length && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
};

export default CacheGrid;
