import React, { useEffect, useState } from 'react';
import { formatCacheData, loadCacheFromLocalStorage, removeString } from '../utility/MoreUtility';
import { validateSHA256Hash } from '../utility/Crypto';

interface HostSelectProps {
    hostValue: string;
    onHostChange: (value: string) => void;
}

const HostSelect: React.FC<HostSelectProps> = ({ hostValue, onHostChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredHosts, setFilteredHosts] = useState<string[]>([]);
    const [hostOptions, setHostOptions] = useState<string[]>([]); // Store host options from cache

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

                // After all validations, set valid hosts if all hashes are valid
                Promise.all(validationPromises).then(() => {
                    if (reloadRequired) {
                        window.location.reload(); // Force reload if invalid cache was found
                    } else {
                        // Set the host options as item.key values
                        const validKeys = formattedData.map((item) => item.key);
                        const updatedValidKeys: string[] = [];
                        validKeys.forEach((key) => {
                            const parts = key.split(" | "); // Split by " | "
                            parts.forEach((part: string) => {
                                if (part.startsWith("Host: ")) {
                                    const host = part.replace("Host: ", ""); // Remove "Host: " prefix
                                    updatedValidKeys.push(host); // Add to updatedValidKeys
                                }
                            });
                        });

                        // Remove duplicates using Set and convert back to an array
                        const uniqueHostOptions = [...new Set(updatedValidKeys)];

                        setHostOptions(uniqueHostOptions);
                    }
                });
            }
        }
    }, []);

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