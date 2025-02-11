import { HI } from "../src/utility/HI";
import { last } from "./lastused";
  
export interface CacheData {
    HI?: HI;
    Last?: last;
    // Add more data types if necessary
}
  
export interface HistoryItem {
    Host: string;
    port?: number;
    application?: string;
    geolocation?: string;
  }
  