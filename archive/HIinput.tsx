import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import "./HIinput.css";
import { CacheData } from "./interfaces";
import History from "../src/components/HIhistory";

const SelectDemo = ({ selectedRow }: { selectedRow: any }) => {
  const [selection, setSelection] = React.useState<string | undefined>(undefined);
  const [host, setHost] = React.useState<string>(selectedRow?.Host || "");
  const [port, setPort] = React.useState<string>(selectedRow?.port || "");
  const [application, setApplication] = React.useState<string>(selectedRow?.application || "");
  const [geolocation, setGeolocation] = React.useState<string>(selectedRow?.geolocation || "");
  const [historyMessage, setHistoryMessage] = React.useState<string>("");
  const hostname = window.location.hostname;

  // Retrieve the 'Last.HI' from localStorage
  React.useEffect(() => {
    const cacheData = localStorage.getItem(hostname);
    if (cacheData) {
      const parsedCacheData: CacheData = JSON.parse(cacheData);
      const lastHI: string | undefined = parsedCacheData.Last?.HI;

      // If there's no last selection, show "No history found"
      if (lastHI === "") {
        return;
      }

      // Set the selection state
      setSelection(lastHI);

      // Populate the form fields based on the last selection
      if (lastHI === "Host" && parsedCacheData.HI?.Host.length) {
        setHost(parsedCacheData.HI.Host[parsedCacheData.HI.Host.length - 1]);
      } else if (lastHI === "Host_and_Port" && parsedCacheData.HI?.Host_and_Port.length) {
        const lastHostPort = parsedCacheData.HI.Host_and_Port[parsedCacheData.HI.Host_and_Port.length - 1];
        setHost(lastHostPort.Host);
        setPort(String(lastHostPort.port));
      } else if (lastHI === "Host_and_Application" && parsedCacheData.HI?.Host_and_Application.length) {
        const lastHostApp = parsedCacheData.HI.Host_and_Application[parsedCacheData.HI.Host_and_Application.length - 1];
        setHost(lastHostApp.Host);
        setApplication(lastHostApp.application);
      } else if (lastHI === "Host_and_Geolocation" && parsedCacheData.HI?.Host_and_Geolocation.length) {
        const lastHostGeo = parsedCacheData.HI.Host_and_Geolocation[parsedCacheData.HI.Host_and_Geolocation.length - 1];
        setHost(lastHostGeo.Host);
        setGeolocation(lastHostGeo.geolocation);
      }
    }
  }, []);

  React.useEffect(() => {
    if (selectedRow) {
      setHost(selectedRow.Host || "");
      setPort(selectedRow.port || "");
      setApplication(selectedRow.application || "");
      setGeolocation(selectedRow.geolocation || "");
    }
  }, [selectedRow]);

  // Handle selection change and update both state and localStorage
  const handleSelectionChange = (value: string) => {
    setSelection(value);

    // Get current data from localStorage
    const cacheData = localStorage.getItem(hostname);
    let parsedCacheData: CacheData;

    if (cacheData) {
      parsedCacheData = JSON.parse(cacheData);
    } else {
      parsedCacheData = {};
    }

    // Update Last.HI based on selection
    parsedCacheData.Last = {
      HI: value, // Update the Last.HI with the current selection
    };

    // Now update the HI array based on the current selection
    if (!parsedCacheData.HI) {
      parsedCacheData.HI = {
        Host: [],
        Host_and_Port: [],
        Host_and_Application: [],
        Host_and_Geolocation: [],
      };
    }

    // Manipulate the HI array depending on the selection
    if (value === "Host" && host) {
      // Check if the host already exists, remove the duplicate
      const hostIndex = parsedCacheData.HI.Host.indexOf(host);
      if (hostIndex > -1) {
        parsedCacheData.HI.Host.splice(hostIndex, 1); // Remove the duplicate
      }
      parsedCacheData.HI.Host.push(host);
    } else if (value === "Host_and_Port" && host && port) {
      // Check for duplicate Host and Port
      const index = parsedCacheData.HI.Host_and_Port.findIndex(
        (item) => item.Host === host && item.port === Number(port)
      );
      if (index > -1) {
        parsedCacheData.HI.Host_and_Port.splice(index, 1); // Remove the duplicate
      }
      parsedCacheData.HI.Host_and_Port.push({ Host: host, port: Number(port) });
    } else if (value === "Host_and_Application" && host && application) {
      // Check for duplicate Host and Application
      const index = parsedCacheData.HI.Host_and_Application.findIndex(
        (item) => item.Host === host && item.application === application
      );
      if (index > -1) {
        parsedCacheData.HI.Host_and_Application.splice(index, 1); // Remove the duplicate
      }
      parsedCacheData.HI.Host_and_Application.push({ Host: host, application });
    } else if (value === "Host_and_Geolocation" && host && geolocation) {
      // Check for duplicate Host and Geolocation
      const index = parsedCacheData.HI.Host_and_Geolocation.findIndex(
        (item) => item.Host === host && item.geolocation === geolocation
      );
      if (index > -1) {
        parsedCacheData.HI.Host_and_Geolocation.splice(index, 1); // Remove the duplicate
      }
      parsedCacheData.HI.Host_and_Geolocation.push({ Host: host, geolocation });
    }

    // Save the updated cacheData back to localStorage
    localStorage.setItem(hostname, JSON.stringify(parsedCacheData));

    // Update the history message
    setHistoryMessage(`Last selected: ${value}`);
  };

  const handleLaunchClick = () => {
    // Get current data from localStorage
    const cacheData = localStorage.getItem(hostname);
    let parsedCacheData: CacheData;

    if (cacheData) {
      parsedCacheData = JSON.parse(cacheData);
    } else {
      parsedCacheData = {};
    }

    // Update Last.HI based on selection
    parsedCacheData.Last = {
      HI: selection || "", // Update the Last.HI with the current selection
    };

    // Now update the HI array based on the current selection
    if (!parsedCacheData.HI) {
      parsedCacheData.HI = {
        Host: [],
        Host_and_Port: [],
        Host_and_Application: [],
        Host_and_Geolocation: [],
      };
    }

    // Manipulate the HI array depending on the selection
    if (selection === "Host" && host) {
      // Check if the host already exists, remove the duplicate
      const hostIndex = parsedCacheData.HI.Host.indexOf(host);
      if (hostIndex > -1) {
        parsedCacheData.HI.Host.splice(hostIndex, 1); // Remove the duplicate
      }
      parsedCacheData.HI.Host.push(host);
    } else if (selection === "Host_and_Port" && host && port) {
      // Check for duplicate Host and Port
      const index = parsedCacheData.HI.Host_and_Port.findIndex(
        (item) => item.Host === host && item.port === Number(port)
      );
      if (index > -1) {
        parsedCacheData.HI.Host_and_Port.splice(index, 1); // Remove the duplicate
      }
      parsedCacheData.HI.Host_and_Port.push({ Host: host, port: Number(port) });
    } else if (selection === "Host_and_Application" && host && application) {
      // Check for duplicate Host and Application
      const index = parsedCacheData.HI.Host_and_Application.findIndex(
        (item) => item.Host === host && item.application === application
      );
      if (index > -1) {
        parsedCacheData.HI.Host_and_Application.splice(index, 1); // Remove the duplicate
      }
      parsedCacheData.HI.Host_and_Application.push({ Host: host, application });
    } else if (selection === "Host_and_Geolocation" && host && geolocation) {
      // Check for duplicate Host and Geolocation
      const index = parsedCacheData.HI.Host_and_Geolocation.findIndex(
        (item) => item.Host === host && item.geolocation === geolocation
      );
      if (index > -1) {
        parsedCacheData.HI.Host_and_Geolocation.splice(index, 1); // Remove the duplicate
      }
      parsedCacheData.HI.Host_and_Geolocation.push({ Host: host, geolocation });
    }

    // Save the updated cacheData back to localStorage
    localStorage.setItem(hostname, JSON.stringify(parsedCacheData));

    // Show the alert with the collected data
    let result = `Selected: ${selection}\n`;
    if (selection === "Host") {
      result += `Host: ${host}`;
    } else if (selection === "Host_and_Port") {
      result += `Host: ${host}, Port: ${port}`;
    } else if (selection === "Host_and_Application") {
      result += `Host: ${host}, Application: ${application}`;
    } else if (selection === "Host_and_Geolocation") {
      result += `Host: ${host}, Geolocation: ${geolocation}`;
    }
    alert(result);
  };

  return (
    <center>
      <div className="history">
        {/*<div>{historyMessage}</div>*/}
        <Select.Select value={selection} onValueChange={handleSelectionChange}>
          <Select.Trigger className="SelectTrigger" aria-label="Select Option">
            <Select.Value placeholder="Select an option…" />
            <Select.Icon className="SelectIcon">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="SelectContent">
              <Select.ScrollUpButton className="SelectScrollButton">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="SelectViewport">
                <Select.Group>
                  <Select.Label className="SelectLabel">Options</Select.Label>
                  <SelectItem value="Host">Host</SelectItem>
                  <SelectItem value="Host_and_Port">Host and Port</SelectItem>
                  <SelectItem value="Host_and_Application">Host and Application</SelectItem>
                  <SelectItem value="Host_and_Geolocation">Host and Geolocation</SelectItem>
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton className="SelectScrollButton">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Select>

        {/* Conditionally render input fields based on selection */}
        {selection === "Host" && (
          <div className="inn">
            <label>Host</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Enter Host"
            />
          </div>
        )}

        {selection === "Host_and_Port" && (
          <div>
            <label>Host</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Enter Host"
            />
            <label>Port</label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Enter Port"
            />
          </div>
        )}

        {selection === "Host_and_Application" && (
          <div>
            <label>Host</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Enter Host"
            />
            <label>Application</label>
            <input
              type="text"
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              placeholder="Enter Application"
            />
          </div>
        )}

        {selection === "Host_and_Geolocation" && (
          <div>
            <label>Host</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Enter Host"
            />
            <label>Geolocation</label>
            <input
              type="text"
              value={geolocation}
              onChange={(e) => setGeolocation(e.target.value)}
              placeholder="Enter Geolocation"
            />
          </div>
        )}

        {/* Green Launch Button */}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleLaunchClick}
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "15px",
            }}
          >
            Launch
          </button>
        </div>
        <History
          setHost={setHost}
          setPort={setPort}
          setApplication={setApplication}
          setGeolocation={setGeolocation}
          setSelection={setSelection}
        />
      </div>
    </center>
  );
};

const SelectItem = React.forwardRef<
  HTMLDivElement,
  { value: string; children: React.ReactNode }
>(({ value, children, ...props }, forwardedRef) => {
  return (
    <Select.Item value={value} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="SelectItemIndicator">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default SelectDemo;
