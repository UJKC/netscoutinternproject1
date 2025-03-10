import React, { useEffect, useState } from 'react';
import { formatCacheData, loadCacheFromLocalStorage, removeString } from '../utility/MoreUtility';
import { validateSHA256Hash } from '../utility/Crypto';

interface UseSelectProps {
    function: (value: string) => void; // onHostChange or onPortChange
    type: 'Host' | 'port'; // Can be 'host' or 'port'
    value: string; // Host or port value from parent component
}

const UseSelect: React.FC<UseSelectProps> = ({ function: onChange, type, value }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]); // Store options (hosts or ports) from cache

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onChange(inputValue); // Propagate to parent

        // Filter options based on input value
        const filtered = options.filter((option) =>
            option.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);

        // Open the dropdown if there are matching options
        setIsDropdownOpen(filtered.length > 0);
    };

    // Handle selecting an option from the dropdown
    const handleSelect = (option: string) => {
        onChange(option);
        setIsDropdownOpen(false); // Close the dropdown after selection
    };

    useEffect(() => {
        let reloadRequired = false;
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
                        removeString('HI', item.key); // Remove invalid item from cache
                        reloadRequired = true;
                    }
                });

                // After all validations, set valid options (host or port)
                Promise.all(validationPromises).then(() => {
                    if (reloadRequired) {
                        window.location.reload(); // Force reload if invalid cache was found
                    } else {
                        // Set the options based on the selected type (host or port)
                        const validKeys = formattedData.map((item) => item.key);
                        const updatedValidKeys: string[] = [];
                        validKeys.forEach((key) => {
                            const parts = key.split(" | "); // Split by " | "
                            parts.forEach((part: string) => {
                                if (part.startsWith(`${type}: `)) {
                                    const value = part.replace(`${type}: `, ""); // Remove prefix ("Host: " or "Port: ")
                                    updatedValidKeys.push(value); // Add to updatedValidKeys
                                }
                            });
                        });
                        console.log("updatedValidKeys: " + updatedValidKeys)

                        // Remove duplicates using Set and convert back to an array
                        const uniqueOptions = [...new Set(updatedValidKeys)];
                        setOptions(uniqueOptions);
                    }
                });
            }
        }
    }, [type]);

    return (
        <div style={{ position: 'relative' }}>
            <label>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={`Enter ${type}`}
            />
            {/* Show filtered dropdown if there are matching options */}
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
                    {filteredOptions.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
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

export default UseSelect;
