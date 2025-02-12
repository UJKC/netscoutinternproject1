import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns'; // For human-readable date difference
import { addString } from '../utility/MoreUtility';
import { generateSHA256Hash } from '../utility/Crypto';
import { loadCacheFromLocalStorage } from '../utility/MoreUtility'
import { StringItem } from '../utility/CachedVersionedData';

interface HostInputData {
  selector: string;
  host: string;
  port?: string;
  application?: string;
  geolocation?: string;
  conversation?: string;
}

const CacheGrid: React.FC = () => {
  // State for cache data, search term, and pagination
  const [cacheData, setCacheData] = useState<StringItem[]>([]);
  const [visibleData, setVisibleData] = useState<StringItem[]>([]);
  const [page, setPage] = useState<number>(1); // Pagination starts with page 1
  const [hostInputData, setHostInputData] = useState<HostInputData>({
    selector: 'Host',
    host: '',
  }); // State for HostInput

  const [selection, setSelection] = useState<string>('Host');
  const [hostValue, setHostValue] = useState<string>('');
  const [portValue, setPortValue] = useState<string>('');
  const [applicationValue, setApplicationValue] = useState<string>('');
  const [geolocationValue, setGeolocationValue] = useState<string>('');
  const [conversationValue, setConversationValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Load the cache from localStorage on initial load
    const loadedCacheData = loadCacheFromLocalStorage();
    if (loadedCacheData) {
      const siteCache = loadedCacheData.sites['HI']; // Getting the cache data for site "HI"
      const formattedData = formatCacheData(siteCache);
  
      if (formattedData.length > 0) {
        // Get the most recent cache entry
        
        const mostRecentItem = formattedData[0]; // Since data is sorted by lastUsed, the first item is the most recent.
        console.log(mostRecentItem)
        // Automatically populate the form fields
        const parts = mostRecentItem.key.split(' | ');
        console.log(parts)
        setSelection('Host');
        parts.forEach((part: string) => {
          if (part.startsWith('Host:')) {
            setHostValue(part.replace('Host: ', '').trim());
          }
          if (part.startsWith('port:')) {
            setSelection('Host and Port');
            setPortValue(part.replace('port: ', '').trim());
          }
          if (part.startsWith('application:')) {
            setSelection('Host and Application');
            setApplicationValue(part.replace('application: ', '').trim());
          }
          if (part.startsWith('geolocation:')) {
            setSelection('Host and Geolocation');
            setGeolocationValue(part.replace('geolocation: ', '').trim());
          }
          if (part.startsWith('Conversation:')) {
            setSelection('Conversation');
            setConversationValue(part.replace('Conversation: ', '').trim());
          }
        });
  
        setCacheData(formattedData);
        setVisibleData(formattedData.slice(0, 10)); // Initially show first 10 items
      }
    }
  }, []);
  
  

  // Format cache data with last used date and other details
function formatCacheData(siteCache: any): StringItem[] {
  console.log("Hereeeee");

  if (!siteCache) {
    console.error('siteCache is null or undefined');
    return [];  // Return an empty array or handle the error accordingly
  }

  const formattedData = Object.keys(siteCache).map((key) => ({
    key,
    localVersion: siteCache[key].localVersion || '',  // Default to empty string if undefined
    hash: siteCache[key].hash || '',                  // Default to empty string if undefined
    lastUsed: siteCache[key].lastUsed ? new Date(siteCache[key].lastUsed) : new Date(),                             // Current date
  }));

  const sortedData = formattedData.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());

  return sortedData;
}

  
  

  // Handle the action when the "Add Search" button is clicked
  const handleAddSearchClick = (key: string) => {
    console.log('Add Search clicked for:', key);
  
    // Split the key by " | " to extract different parts
    const parts = key.split(' | ');
  
    // Initialize host and port values
    let host = '';
    let port = '';
    let application = '';
    let geolocation = '';
    let conversation = '';
  
    // Loop through the parts to match and extract values
    parts.forEach(part => {
      if (part.startsWith('Host:')) {
        host = part.replace('Host: ', '').trim();
      }
      if (part.startsWith('port:')) {
        port = part.replace('port: ', '').trim();
      }
      if (part.startsWith('application:')) {
        application = part.replace('application: ', '').trim();
      }
      if (part.startsWith('geolocation:')) {
        geolocation = part.replace('geolocation: ', '').trim();
      }
      if (part.startsWith('Conversation:')) {
        conversation = part.replace('Conversation: ', '').trim();
      }
    });
  
    // Update the state for the HostInputData and fields based on the parts extracted
    if (port) {
      setSelection('Host and Port');
      setHostValue(host);
      setPortValue(port);
    } else if (application) {
      setSelection('Host and Application');
      setHostValue(host);
      setApplicationValue(application);
    } else if (geolocation) {
      setSelection('Host and Geolocation');
      setHostValue(host);
      setGeolocationValue(geolocation);
    } else if (conversation) {
      setSelection('Conversation');
      setConversationValue(conversation);
    } else {
      setSelection('Host');
      setHostValue(host);
    }
  };
  

  // Handle load more functionality (pagination)
  const loadMore = () => {
    const newPage = page + 1;
    setPage(newPage);

    // Load the next 10 items
    const newVisibleData = cacheData.slice(0, newPage * 10);
    setVisibleData(newVisibleData);
  };

    // Handle search term change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
  
    // Filter cache data based on search term
    const filteredData = visibleData.filter((item) =>
      item.key.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    switch (field) {
      case 'host':
        setHostValue(event.target.value);
        break;
      case 'port':
        setPortValue(event.target.value);
        break;
      case 'application':
        setApplicationValue(event.target.value);
        break;
      case 'geolocation':
        setGeolocationValue(event.target.value);
        break;
      case 'conversation':
        setConversationValue(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleLaunchClick = async () => {
    console.log("HERE");
    console.log(selection);
    let cacheKey = '';
    let cacheData = '';
    let dataToCache = '';

    // Determine cache key and data based on selection
    switch (selection) {
      case 'Host':
        dataToCache = `Host: ${hostValue}`;
        break;
      case 'Host and Port':
        dataToCache = `Host: ${hostValue} | port: ${portValue}`;
        break;
      case 'Host and Application':
        dataToCache = `Host: ${hostValue} | application: ${applicationValue}`;
        break;
      case 'Host and Geolocation':
        dataToCache = `Host: ${hostValue} | geolocation: ${geolocationValue}`;
        break;
      case 'Conversation':
        dataToCache = `Conversation: ${conversationValue}`;
        break;
      default:
        break;
    }

    // Hash the data before saving it
    const hashedData = await generateSHA256Hash(dataToCache + `5000`); // Implement your hashing function here

    // Add to cache using MoreUtility functions
    try {
      addString('HI', dataToCache, '1.0.0', hashedData); // Add to cache with site "HI"
      setMessage('Successfully added to cache!');
    } catch (error) {
      setMessage('Failed to add to cache.');
    }

    alert(message); // Show success or failure message
  };

  return (
    <div>



      {/* HostInput Component */}
      <div>
        <select value={selection} onChange={handleSelectionChange}>
          <option value="Host">Host</option>
          <option value="Host and Port">Host and Port</option>
          <option value="Host and Application">Host and Application</option>
          <option value="Host and Geolocation">Host and Geolocation</option>
          <option value="Conversation">Conversation</option>
        </select>

        {/* Conditionally render input fields based on selection */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {selection === 'Host' && (
            <>
              <label>Host:</label>
              <input
                type="text"
                value={hostValue}
                onChange={(e) => handleInputChange(e, 'host')}
                placeholder="Enter host"
              />
            </>
          )}

          {selection === 'Host and Port' && (
            <>
              <label>Host:</label>
              <input
                type="text"
                value={hostValue}
                onChange={(e) => handleInputChange(e, 'host')}
                placeholder="Enter host"
              />
              <label>Port:</label>
              <input
                type="text"
                value={portValue}
                onChange={(e) => handleInputChange(e, 'port')}
                placeholder="Enter port"
              />
            </>
          )}

          {selection === 'Host and Application' && (
            <>
              <label>Host:</label>
              <input
                type="text"
                value={hostValue}
                onChange={(e) => handleInputChange(e, 'host')}
                placeholder="Enter host"
              />
              <label>Application:</label>
              <input
                type="text"
                value={applicationValue}
                onChange={(e) => handleInputChange(e, 'application')}
                placeholder="Enter application"
              />
            </>
          )}

          {selection === 'Host and Geolocation' && (
            <>
              <label>Host:</label>
              <input
                type="text"
                value={hostValue}
                onChange={(e) => handleInputChange(e, 'host')}
                placeholder="Enter host"
              />
              <label>Geolocation:</label>
              <input
                type="text"
                value={geolocationValue}
                onChange={(e) => handleInputChange(e, 'geolocation')}
                placeholder="Enter geolocation"
              />
            </>
          )}

          {selection === 'Conversation' && (
            <>
              <label>Conversation:</label>
              <input
                type="text"
                value={conversationValue}
                onChange={(e) => handleInputChange(e, 'conversation')}
                placeholder="Enter conversation"
              />
            </>
          )}

          <button onClick={handleLaunchClick}>Launch</button>
        </div>
      </div>

            {/* Search Box */}
            <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
      </div>


      {/* Cache Data Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th>Key</th>
      <th>Action</th>
      <th>Last Used</th>
    </tr>
  </thead>
  <tbody>
  {filteredData.length === 0 ? (
    <tr>
      <td colSpan={3}>No data found</td>
    </tr>
  ) : (
    filteredData.map((item, index) => (
      <tr key={item.key}>
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
    </div>
  );
};

export default CacheGrid;
