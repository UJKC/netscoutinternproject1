import React, { useState } from 'react';

interface GeolocationSelectProps {
  selectedValue: string;
  onChange: (value: string) => void;
}

const GeolocationSelect: React.FC<GeolocationSelectProps> = ({ selectedValue, onChange }) => {
  // Predefined list of geolocations
  const geolocationOptions = ['Bangalore', 'Paris', 'Rome', 'New York', 'London', 'Tokyo'];

  // State to hold the current input value
  const [inputValue, setInputValue] = useState(selectedValue);
  const [filteredOptions, setFilteredOptions] = useState(geolocationOptions);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle input changes and filter options dynamically
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter the options based on the input value
    const filtered = geolocationOptions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);

    // Open the dropdown if there are matches
    setIsDropdownOpen(filtered.length > 0);
  };

  // Handle selecting an option from the dropdown
  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    onChange(option);  // Update parent component's state with the selected value
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter geolocation"
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
            color: 'black'
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

export default GeolocationSelect;
