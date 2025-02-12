import { CacheSystem } from "./CachedVersionedData";

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


