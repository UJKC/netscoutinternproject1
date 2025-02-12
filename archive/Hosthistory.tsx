import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns'; // For human-readable date difference
import HostInput from '../src/components/HostInput'; // Assuming HostInput is in the same directory

const CacheGrid: React.FC = () => {
  // State for cache data, search term, and pagination
  const [cacheData, setCacheData] = useState<any[]>([]);
  const [visibleData, setVisibleData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1); // Pagination starts with page 1
  const [hostInputData, setHostInputData] = useState<any>({}); // State for HostInput

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
  function loadCacheFromLocalStorage(): any {
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

    // Sort by most recent usage (lastUsed)
    formattedData.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
    return formattedData;
  }

  // Handle the action when the "Add Search" button is clicked
  const handleAddSearchClick = (key: string) => {
    console.log('Add Search clicked for:', key);

    // Example key: "Host: localhost | port: 9000"
    const parts = key.split(' | ');
    const hostPart = parts.find((part) => part.startsWith('Host:'));
    const portPart = parts.find((part) => part.startsWith('port:'));

    // Extract host and port
    const host = hostPart?.replace('Host: ', '').trim();
    const port = portPart?.replace('port: ', '').trim();

    // Update the HostInput state with the parsed values
    setHostInputData({
      selector: 'Host and Port', // Set the selector to Host and Port
      host: host || '',
      port: port || '',
    });
  };

  // Handle load more functionality (pagination)
  const loadMore = () => {
    const newPage = page + 1;
    setPage(newPage);

    // Load the next 10 items
    const newVisibleData = cacheData.slice(0, newPage * 10);
    setVisibleData(newVisibleData);
  };

  return (
    <div>
      {/* Cache Data Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>SLno</th>
            <th>Key</th>
            <th>Action</th>
            <th>Last Used</th>
          </tr>
        </thead>
        <tbody>
          {visibleData.length === 0 ? (
            <tr>
              <td colSpan={4}>No data found</td>
            </tr>
          ) : (
            visibleData.map((item, index) => (
              <tr key={item.key}>
                <td>{index + 1}</td>
                <td>{item.key}</td>
                <td>
                  <button onClick={() => handleAddSearchClick(item.key)}>Add Search</button>
                </td>
                <td>{formatDistanceToNow(item.lastUsed)} ago</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Load More Button */}
      {visibleData.length < cacheData.length && (
        <button onClick={loadMore} style={{ marginTop: '10px' }}>
          Load More
        </button>
      )}

      {/* HostInput component */}
      <HostInput inputData={hostInputData} />
    </div>
  );
};

export default CacheGrid;
