import { StringItem } from "./CachedVersionedData";

interface CacheSystem {
    globalVersion: string; // The common version for all strings
    
    // Add a new string with its hash and local version for a specific site
    addString(siteName: string, stringKey: string, localVersion: string, hash: string): void;
  
    // Retrieve the local version and hash of a string from a site
    getStringInfo(siteName: string, stringKey: string): StringItem | null;
  
    // Check if a string exists in the cache for a specific site
    hasString(siteName: string, stringKey: string): boolean;
  
    // Update the hash of a string in the cache, keeping the local version intact
    updateString(siteName: string, stringKey: string, localVersion: string, hash: string): void;
  
    // Remove a string from the cache
    removeString(siteName: string, stringKey: string): void;
  
    // Clear the entire cache for a specific site
    clearSiteCache(siteName: string): void;
  
    // Clear the entire cache system
    clearCacheSystem(): void;
  
    // Get the global version of the cache system
    getGlobalVersion(): string;
  
    // Update the global version for the entire cache system
    updateGlobalVersion(newVersion: string): void;
  }
  