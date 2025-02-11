export interface StringItem {
    localVersion: string; // Local version for this string
    hash: string; // Hash for data integrity
    lastUsed: Date;
}
  
export interface SiteCache {
    [stringKey: string]: StringItem; // Each string is keyed by its name
}
  
export interface CacheSystem {
    globalVersion: string; // Common global version for all strings
    sites: { [key: string]: { [key: string]: StringItem } } // Each site has a set of cached strings
}
  