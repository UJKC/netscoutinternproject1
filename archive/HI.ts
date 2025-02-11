// utility/interfaces.ts
export interface HostAndPort {
    Host: string;
    port: number;
}
  
export interface HostAndApplication {
    Host: string;
    application: string;
}
  
export interface HostAndGeolocation {
    Host: string;
    geolocation: string;
}
  
export interface HI {
    Host: string[];
    Host_and_Port: HostAndPort[];
    Host_and_Application: HostAndApplication[];
    Host_and_Geolocation: HostAndGeolocation[];
}