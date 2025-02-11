import React, { useState } from 'react';
import { addString } from '../utility/MoreUtility';
import { generateSHA256Hash } from '../utility/Crypto';

const HostInput: React.FC = () => {
  const [selection, setSelection] = useState<string>('Host');
  const [hostValue, setHostValue] = useState<string>('');
  const [portValue, setPortValue] = useState<string>('');
  const [applicationValue, setApplicationValue] = useState<string>('');
  const [geolocationValue, setGeolocationValue] = useState<string>('');
  const [conversationValue, setConversationValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');

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
    console.log("HERE")
    console.log(selection)
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
    const hashedData = generateSHA256Hash(dataToCache + `5000`); // Implement your hashing function here

    // Add to cache using MoreUtility functions
    try {
      addString('HI', dataToCache, '1.0.0', await hashedData); // Add to cache with site "HI"
      setMessage('Successfully added to cache!');
    } catch (error) {
      setMessage('Failed to add to cache.');
    }

    alert(message); // Show success or failure message
  };

  return (
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
  );
};

export default HostInput;
