export interface StringItem {
    localVersion: string; // Local version for this string
    hash: string; // Hash for data integrity
}
  
export interface SiteCache {
    [stringKey: string]: StringItem; // Each string is keyed by its name
}
  
export interface CacheSystem {
    globalVersion: string; // Common global version for all strings
    sites: { [siteName: string]: SiteCache }; // Each site has a set of cached strings
}
  