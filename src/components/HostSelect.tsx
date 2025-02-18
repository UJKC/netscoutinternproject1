import React, { useState } from 'react';

interface HostSelectProps {
  hostValue: string;
  onHostChange: (value: string) => void;
}

const HostSelect: React.FC<HostSelectProps> = ({ hostValue, onHostChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredHosts, setFilteredHosts] = useState<string[]>([]);

  // Predefined list of host options
  const hostOptions = ['localhost', '192.168.1.1', '10.0.0.0', '10.1.1.1', '10.0.0.1'];

  // Handle input change for Host field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onHostChange(value); // Propagate to parent

    // Filter host options based on input value
    const filtered = hostOptions.filter((host) =>
      host.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredHosts(filtered);

    // Open the dropdown if there are matching options
    setIsDropdownOpen(filtered.length > 0);
  };

  // Handle selecting an option from the dropdown
  const handleHostSelect = (host: string) => {
    onHostChange(host);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div style={{ position: 'relative' }}>
      <label>Host:</label>
      <input
        type="text"
        value={hostValue}
        onChange={handleInputChange}
        placeholder="Enter host"
      />

      {/* Show filtered dropdown if there are matching host options */}
      {isDropdownOpen && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            background: 'white',
            border: '1px solid #ccc',
            margin: 0,
            padding: '5px 0',
            listStyle: 'none',
            maxHeight: '150px',
            overflowY: 'auto',
            zIndex: 1,
            color: 'black',
          }}
        >
          {filteredHosts.map((host) => (
            <li
              key={host}
              onClick={() => handleHostSelect(host)}
              style={{
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              {host}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HostSelect;
