import React, { useState, useEffect } from 'react';

interface UseSelectStaticProps {
  selectedValue: string;
  onChange: (value: string) => void;
  type: 'application' | 'geolocation';
}

const UseSelectStatic: React.FC<UseSelectStaticProps> = ({ selectedValue, onChange, type }) => {
  // Define options for both application and geolocation
  const applicationOptions = ['HTTP', 'HTTPS', 'TCP', 'UDP', 'ZIG', 'MQTT'];
  const geolocationOptions = ['Bangalore', 'Paris', 'Rome', 'New York', 'London', 'Tokyo'];

  // Determine which options to use based on the `type` prop
  const options = type === 'application' ? applicationOptions : geolocationOptions;

  const [inputValue, setInputValue] = useState(selectedValue);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle input changes and filter options dynamically
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Trigger onChange to store the value in the parent component
    onChange(value);

    // Filter the options based on the input value
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);

    // Open the dropdown if there are matching options
    setIsDropdownOpen(filtered.length > 0);
  };

  // Handle selecting an option from the dropdown
  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    onChange(option);  // Update the parent component's state with the selected value
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  useEffect(() => {
    setInputValue(selectedValue); // Reset input when selectedValue changes
  }, [selectedValue]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={type === 'application' ? 'Enter application type' : 'Enter geolocation'}
      />

      {/* Show filtered dropdown if input value matches options */}
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
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1,
            color: 'black',
          }}
        >
          {filteredOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionSelect(option)}
              style={{
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UseSelectStatic;
