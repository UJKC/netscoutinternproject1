import React, { useEffect, useState } from 'react';
import { formatCacheData, loadCacheFromLocalStorage, removeString } from '../utility/MoreUtility';
import { validateSHA256Hash } from '../utility/Crypto';

interface PortSelectProps {
    portValue: string;
    onPortChange: (value: string) => void;
}

const PortSelect: React.FC<PortSelectProps> = ({ portValue, onPortChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredPorts, setFilteredPorts] = useState<string[]>([]);
    const [portOptions, setPortOptions] = useState<string[]>([]); // Store port options from cache

    // Handle input change for Port field
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onPortChange(value); // Propagate to parent

        // Filter port options based on input value
        const filtered = portOptions.filter((port) =>
            port.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPorts(filtered);

        // Open the dropdown if there are matching options
        setIsDropdownOpen(filtered.length > 0);
    };

    // Handle selecting an option from the dropdown
    const handlePortSelect = (port: string) => {
        onPortChange(port);
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

                // After all validations, set valid ports if all hashes are valid
                Promise.all(validationPromises).then(() => {
                    if (reloadRequired) {
                        window.location.reload(); // Force reload if invalid cache was found
                    } else {
                        // Set the port options as item.key values
                        const validKeys = formattedData.map((item) => item.key);
                        const updatedValidKeys: string[] = [];
                        validKeys.forEach((key) => {
                            const parts = key.split(" | "); // Split by " | "
                            parts.forEach((part: string) => {
                                if (part.startsWith("port: ")) {
                                    const port = part.replace("port: ", ""); // Remove "Port: " prefix
                                    updatedValidKeys.push(port); // Add to updatedValidKeys
                                }
                            });
                        });

                        // Remove duplicates using Set and convert back to an array
                        const uniquePortOptions = [...new Set(updatedValidKeys)];

                        setPortOptions(uniquePortOptions);
                    }
                });
            }
        }
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <label>Port:</label>
            <input
                type="text"
                value={portValue}
                onChange={handleInputChange}
                placeholder="Enter port"
            />

            {/* Show filtered dropdown if there are matching port options */}
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
                    {filteredPorts.map((port) => (
                        <li
                            key={port}
                            onClick={() => handlePortSelect(port)}
                            style={{
                                padding: '5px 10px',
                                cursor: 'pointer',
                            }}
                        >
                            {port}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PortSelect;
