import * as React from "react";
import * as RadixAccordion from "@radix-ui/react-accordion"; // Renamed import
import { ChevronDownIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { HistoryItem } from "../../archive/interfaces";
import "./HIhistory.css"  // Import the HistoryItem type

const getHistoryFromLocalStorage = () => {
  const hostname = window.location.hostname;
  const cacheData = localStorage.getItem(hostname);
  return cacheData ? JSON.parse(cacheData) : null;
};

const AccordionDemo = ({
  setHost,
  setPort,
  setApplication,
  setGeolocation,
  setSelection,
}: {
  setHost: React.Dispatch<React.SetStateAction<string>>;
  setPort: React.Dispatch<React.SetStateAction<string>>;
  setApplication: React.Dispatch<React.SetStateAction<string>>;
  setGeolocation: React.Dispatch<React.SetStateAction<string>>;
  setSelection: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const cacheData = getHistoryFromLocalStorage();

  // Ensure that data is loaded correctly
  if (!cacheData) {
    return <div>No history data available.</div>;
  }

  const { HI } = cacheData;

  const onRowSelect = (rowData: HistoryItem) => {
    console.log("Row selected:", rowData);
    // Logic to populate form fields based on selected row
    setHost(rowData.Host);
    setPort(rowData.port?.toString() || ""); // Ensure default values if needed
    setApplication(rowData.application || "");
    setGeolocation(rowData.geolocation || "");
  };

  // Helper function to handle the selection of a category title
  const handleTriggerClick = (title: string) => {
    console.log(title);
    setSelection(title);
  };

  return (
    <center>
      <RadixAccordion.Root className="AccordionRoot" type="multiple">
        {/* Category 1: Host */}
        <RadixAccordion.Item className="AccordionItem" value="host">
          <RadixAccordion.Trigger onClick={() => handleTriggerClick("Host")}>
            Host
          </RadixAccordion.Trigger>
          <RadixAccordion.Content>
            <Table data={HI.Host} onRowSelect={onRowSelect} />
          </RadixAccordion.Content>
        </RadixAccordion.Item>

        {/* Category 2: Host and Port */}
        <RadixAccordion.Item className="AccordionItem" value="host-port">
          <RadixAccordion.Trigger onClick={() => handleTriggerClick("Host_and_Port")}>
            Host and Port
          </RadixAccordion.Trigger>
          <RadixAccordion.Content>
            <Table data={HI.Host_and_Port} onRowSelect={onRowSelect} />
          </RadixAccordion.Content>
        </RadixAccordion.Item>

        {/* Category 3: Host and Application */}
        <RadixAccordion.Item className="AccordionItem" value="host-application">
          <RadixAccordion.Trigger onClick={() => handleTriggerClick("Host_and_Application")}>
            Host and Application
          </RadixAccordion.Trigger>
          <RadixAccordion.Content>
            <Table data={HI.Host_and_Application} onRowSelect={onRowSelect} />
          </RadixAccordion.Content>
        </RadixAccordion.Item>

        {/* Category 4: Host and Geolocation */}
        <RadixAccordion.Item className="AccordionItem" value="host-geolocation">
          <RadixAccordion.Trigger onClick={() => handleTriggerClick("Host_and_Geolocation")}>
            Host and Geolocation
          </RadixAccordion.Trigger>
          <RadixAccordion.Content>
            <Table data={HI.Host_and_Geolocation} onRowSelect={onRowSelect} />
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      </RadixAccordion.Root>
    </center>
  );
};

// Table component to display the history data
const Table = ({ data, onRowSelect }: { data: HistoryItem[]; onRowSelect: (rowData: HistoryItem) => void }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <center>
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Actions</th> {/* Add an "Actions" column for buttons */}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, idx) => (
                <td key={idx}>{value as React.ReactNode}</td>
              ))}
              <td>
                {/* Button to trigger row selection */}
                <button onClick={() => onRowSelect(item)}>Use</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </center>
  );
};

export default AccordionDemo;
