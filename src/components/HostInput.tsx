import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns'; // For human-readable date difference
import { addString, formatCacheData, removeString } from '../utility/MoreUtility';
import { generateSHA256Hash, validateSHA256Hash } from '../utility/Crypto';
import { loadCacheFromLocalStorage } from '../utility/MoreUtility'
import { StringItem } from '../utility/CachedVersionedData';
import UseSelect from './UseSelect';
import UseSelectStatic from './UseSelectStatic';


const CacheGrid: React.FC = () => {
  // State for cache data, search term, and pagination
  const [cacheData, setCacheData] = useState<StringItem[]>([]);
  const [visibleData, setVisibleData] = useState<StringItem[]>([]);
  const [page, setPage] = useState<number>(1); // Pagination starts with page 1
  const [selection, setSelection] = useState<string>('Host');
  const [hostValue, setHostValue] = useState<string>('');
  const [portValue, setPortValue] = useState<string>('');
  const [applicationValue, setApplicationValue] = useState<string>('');
  const [geolocationValue, setGeolocationValue] = useState<string>('');
  const [conversationValue, setConversationValue] = useState<string>('');
  const [conversationValue1, setConversationValue1] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');



  // Assuming validateSHA256Hash is already imported

  useEffect(() => {
    let reloadRequired = false;
    console.log("conversationValue1: " + conversationValue1)
    // Load the cache from localStorage on initial load
    const loadedCacheData = loadCacheFromLocalStorage();
    if (loadedCacheData) {
      const siteCache = loadedCacheData.sites['HI']; // Getting the cache data for site "HI"
      const formattedData = formatCacheData(siteCache);

      if (formattedData.length > 0) {
        // Loop through all the items in formattedData to validate them
        const validationPromises = formattedData.map(async (item) => {
          const isValid = await validateSHA256Hash(item.key, item.hash);

          if (!isValid) {
            console.log(`Invalid hash for item: ${item.key}`);
            removeString('HI', item.key);
            window.location.reload();
          }

          // Check if the item is older than 1 month
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

          if (item.lastUsed < oneMonthAgo) {
            console.log(`Removing outdated item: ${item.key}`);
            removeString('HI', item.key);
            reloadRequired = true;  // Mark that a reload is required after removal
          }
        });

        // Wait for all validation checks and removal to complete
        Promise.all(validationPromises).then(() => {
          if (reloadRequired) {
            window.location.reload();
          } else {
            // After validation, get the most recent cache entry
            const mostRecentItem = formattedData[0]; // Since data is sorted by lastUsed, the first item is the most recent.
            console.log(mostRecentItem);

            // Automatically populate the form fields
            const parts = mostRecentItem.key.split(' | ');
            console.log(parts);

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
                setApplicationValue('');
              }
              if (part.startsWith('geolocation:')) {
                setSelection('Host and Geolocation');
                setGeolocationValue('');
              }
              if (part.startsWith('Conversation:')) {
                setSelection('Conversation');
                setConversationValue(part.replace('Conversation: ', '').trim());
              }
            });

            setCacheData(formattedData);
            setVisibleData(formattedData.slice(0, 10)); // Initially show first 10 items
          }
        });
      }
    }
  }, [])




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
    let conversation1 = '';

    // Loop through the parts to match and extract values
    parts.forEach(part => {
      console.log("part: "+ part)
      if (part.startsWith('Host:')) {
        host = part.replace('Host: ', '').trim();
        console.log("host Complete: "+ host)
      }
      if (part.startsWith('port:')) {
        port = part.replace('port: ', '').trim();
        console.log("port Complete: "+ port)
      }
      if (part.startsWith('application:')) {
        application = part.replace('application: ', '').trim();
        console.log("application Complete: "+ application)
      }
      if (part.startsWith('geolocation:')) {
        geolocation = part.replace('geolocation: ', '').trim();
        console.log("geolocation Complete: "+ geolocation)
      }
      if (part.startsWith('Conversation:')) {
        conversation = part.replace('Conversation: ', '').trim();
        console.log("Conversation Complete: "+ conversation)
      }
      if (part.startsWith('Conversation1:')) {
        conversation1 = part.replace('Conversation1: ', '').trim();
        console.log("Conversation1 Complete: "+ conversation1)
      }
    });

    // Update the state for the HostInputData and fields based on the parts extracted
    console.log("conversation1 ()()(): "+ conversation1)

    if (port) {
      setSelection('Host and Port');
      setHostValue(host);
      setPortValue(port);
      console.log("port HIIII: " + port);
    }
    if (application) {
      setSelection('Host and Application');
      setHostValue(host);
      setApplicationValue(application);
      console.log("application HIIII: " + application);
    }
    if (geolocation) {
      setSelection('Host and Geolocation');
      setHostValue(host);
      setGeolocationValue(geolocation);
      console.log("geolocation HIIII: " + geolocation);
    }
    if (conversation) {
      console.log("----------------------------\nHOOOO")
      setSelection('Conversation');
      setConversationValue(conversation);
      console.log("conversation HIIII (1): " + conversation);
      console.log("conversation1 HIII (1): " + conversation1);
    }
    if (conversation1) {
      setSelection('Conversation');
      setConversationValue1(conversation1);
      console.log("conversation1: " + conversation1);  // This logs the correct value for conversation1
    }
    if (host) {
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
      case 'conversation1':
        setConversationValue1(event.target.value);
        console.log("Updated conversation1 value: " + event.target.value);  // Log the updated value
        break;
      default:
        break;
    }
  };

  const handleLaunchClick = async () => {
    console.log("HERE");
    console.log(selection);

    // Check for empty values based on selection
    if (selection === 'Host' && !hostValue) {
      alert('Host cannot be empty');
      return;
    }

    if (selection === 'Host and Port' && (!hostValue || !portValue)) {
      alert('Host and Port cannot be empty');
      return;
    }

    if (selection === 'Host and Application' && (!hostValue || !applicationValue)) {
      alert('Host and Application cannot be empty');
      return;
    }

    if (selection === 'Host and Geolocation' && (!hostValue || !geolocationValue)) {
      alert('Host and Geolocation cannot be empty');
      return;
    }

    if (selection === 'Conversation' && (!conversationValue || !conversationValue1)) {
      alert('Both Conversation fields cannot be empty');
      return;
    }

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
        dataToCache = `Conversation: ${conversationValue} | Conversation1: ${conversationValue1}`;
        break;
      default:
        break;
    }

    // Hash the data before saving it
    const hashedData = await generateSHA256Hash(dataToCache); // Implement your hashing function here

    // Add to cache using MoreUtility functions
    try {
      addString('HI', dataToCache, '1.0.0', hashedData); // Add to cache with site "HI"
      setMessage('Successfully added to cache!');
      window.location.reload()
    } catch (error) {
      setMessage('Failed to add to cache.');
      window.location.reload()
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
              <UseSelect
                function={(value) => setHostValue(value)} // Update host state in parent
                type="Host" // Set type as 'host'
                value={hostValue} // Pass the host value
              />
            </>
          )}

          {selection === 'Host and Port' && (
            <>
              <UseSelect
                function={(value) => setHostValue(value)} // Update host state in parent
                type="Host" // Set type as 'host'
                value={hostValue} // Pass the host value
              />

              <UseSelect
                function={(value) => setPortValue(value)} // Update port state in parent
                type="port" // Set type as 'port'
                value={portValue} // Pass the port value
              />
            </>
          )}

          {selection === 'Host and Application' && (
            <>
              <UseSelect
                function={(value) => setHostValue(value)} // Update host state in parent
                type="Host" // Set type as 'host'
                value={hostValue} // Pass the host value
              />
              <label>Application:</label>
              <UseSelectStatic
                selectedValue={applicationValue}
                onChange={(value: string) => setApplicationValue(value)}
                type="application"
              />

            </>
          )}

          {selection === 'Host and Geolocation' && (
            <>
              <UseSelect
                function={(value) => setHostValue(value)} // Update host state in parent
                type="Host" // Set type as 'host'
                value={hostValue} // Pass the host value
              />

              <label>Geolocation:</label>
              <UseSelectStatic
                selectedValue={geolocationValue}
                onChange={(value: string) => setGeolocationValue(value)}
                type="geolocation"
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
              <input
                type="text"
                value={conversationValue1}
                onChange={(e) => handleInputChange(e, 'conversation1')}
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
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center'
      }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black' }}>SLno</th> {/* Added border to th */}
            <th style={{ border: '1px solid black' }}>Key</th>
            <th style={{ border: '1px solid black' }}>Action</th>
            <th style={{ border: '1px solid black' }}>Last Used</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ border: '1px solid black' }}>No data found</td> {/* Adjusted with border */}
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr key={item.key}>
                <td style={{ border: '1px solid black' }}>{index + 1}</td> {/* Added border */}
                <td style={{ border: '1px solid black' }}>{item.key}</td>
                <td style={{ border: '1px solid black' }}>
                  <button onClick={() => handleAddSearchClick(item.key)}>Add Search</button>
                </td>
                <td style={{ border: '1px solid black' }}>{formatDistanceToNow(item.lastUsed)} ago</td>
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
