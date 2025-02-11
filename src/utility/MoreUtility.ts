interface StringItem {
    localVersion: string;
    hash: string;
  }
  
  // Modify CacheSystem to support dynamic keys
  interface CacheSystem {
    globalVersion: string;
    sites: { [key: string]: { [key: string]: StringItem } };
  }
  
  const cacheSystem: CacheSystem = {
    globalVersion: "1.0",
    sites: {}
  };
  
  // Adding a string with its hash and local version
  function addString(siteName: string, stringKey: string, localVersion: string, hash: string): void {
    if (!cacheSystem.sites[siteName]) {
      cacheSystem.sites[siteName] = {};
    }
    cacheSystem.sites[siteName][stringKey] = { localVersion, hash };
  }
  
  // Retrieving string info (local version and hash)
  function getStringInfo(siteName: string, stringKey: string): StringItem | null {
    if (cacheSystem.sites[siteName] && cacheSystem.sites[siteName][stringKey]) {
      return cacheSystem.sites[siteName][stringKey];
    }
    return null;
  }
  
  // Checking if a string exists in a site cache
  function hasString(siteName: string, stringKey: string): boolean {
    return !!(cacheSystem.sites[siteName] && cacheSystem.sites[siteName][stringKey]);
  }
  
  // Updating the hash (and local version) for a string
  function updateString(siteName: string, stringKey: string, localVersion: string, hash: string): void {
    if (cacheSystem.sites[siteName] && cacheSystem.sites[siteName][stringKey]) {
      cacheSystem.sites[siteName][stringKey].hash = hash;
      cacheSystem.sites[siteName][stringKey].localVersion = localVersion;
    }
  }
  
  // Updating the global version
  function updateGlobalVersion(newVersion: string): void {
    cacheSystem.globalVersion = newVersion;
  }
  