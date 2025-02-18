import { CacheSystem, StringItem } from "./CachedVersionedData";

// Load cache from localStorage on startup
export const cacheSystem: CacheSystem = loadCacheFromLocalStorage() || {
  globalVersion: '1.0.0',
  sites: {},
};

// Load cache from localStorage
export function loadCacheFromLocalStorage(): CacheSystem | null {
  const hostname = window.location.hostname;
  const cacheData = localStorage.getItem(hostname);
  if (cacheData) {
    try {
      return JSON.parse(cacheData);
    } catch (error) {
      console.error('Failed to parse cache data from localStorage', error);
      return null;
    }
  }
  return null;
}

// Save the cache to localStorage
function saveCacheToLocalStorage() {
  const hostname = window.location.hostname;
  try {
    const cacheData = JSON.stringify(cacheSystem);
    localStorage.setItem(hostname, cacheData);
  } catch (error) {
    console.error('Failed to save cache to localStorage', error);
  }
}

export function addString(siteName: string, stringKey: string, localVersion: string, hash: string): void {
  if (!cacheSystem.sites[siteName]) {
    cacheSystem.sites[siteName] = {};

  }

  // Add to cache under the site
  cacheSystem.sites[siteName][stringKey] = { localVersion, hash, lastUsed: new Date()};
  
  // Save to localStorage after cache update
  saveCacheToLocalStorage();

  console.log('Cache updated:', cacheSystem);
}

export function updateGlobalVersion(newVersion: string): void {
  cacheSystem.globalVersion = newVersion;

  // Save to localStorage after global version update
  saveCacheToLocalStorage();
}

export function removeString(siteName: string, stringKey: string): void {
  // Check if the site exists in cache
  if (cacheSystem.sites[siteName]) {
    // Check if the stringKey exists under the site
    if (cacheSystem.sites[siteName][stringKey]) {
      // Delete the stringKey from the cache
      delete cacheSystem.sites[siteName][stringKey];
      console.log(`Removed string: ${stringKey} from site: ${siteName}`);
    } else {
      console.log(`StringKey: ${stringKey} does not exist under site: ${siteName}`);
    }
    
    // If the site has no more entries, you can also remove the site (optional)
    if (Object.keys(cacheSystem.sites[siteName]).length === 0) {
      delete cacheSystem.sites[siteName];
      console.log(`Removed site: ${siteName} from cache as it has no more strings`);
    }
    
    // Save updated cache to localStorage after removal
    saveCacheToLocalStorage();
    
    console.log('Cache updated after removal:', cacheSystem);
  } else {
    console.log(`Site: ${siteName} does not exist in cache`);
  }
}

export function formatCacheData(siteCache: any): StringItem[] {
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