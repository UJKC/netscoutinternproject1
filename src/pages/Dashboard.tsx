import { Tabs } from "radix-ui";
import { Avatar } from "radix-ui";
import './dashboard.css';
import { useState } from "react";
import App from "../components/HIinput";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string | undefined>("tab1");
  const handleClick = () => {
    setActiveTab("tab90"); // Show the "Host Intelligence" tab when the card is clicked
  };
  const closeTab = () => {
    setActiveTab('tab1'); // Hide the tab when the "X" button is clicked
  };

  return <>
    <Tabs.Root className="TabsRoot" value={activeTab} onValueChange={setActiveTab} defaultValue="tab1">
      <Tabs.List className="TabsList" aria-label="Manage your account">
        <Tabs.Trigger className="TabsTrigger CIUI" value="tab1">
          Cyber Intelligence
        </Tabs.Trigger>
        <Tabs.Trigger className="TabsTrigger" value="tab1">
          All Modules
        </Tabs.Trigger>
        <Tabs.Trigger className="TabsTrigger" value="tab90" hidden={activeTab !== "tab90"} >
          Host Intelligence
          <button className="closeButton" onClick={closeTab}>X</button>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="TabsContent" value="tab1">
        <div>
           
          <h2>Identify</h2>
           
          <div style={{ display: "flex", gap: 20 }}>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  RV
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Risk Visualization</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  GF
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Geo Footprinting</h3>
            </div>
          </div>

           
          <h2>Investigate</h2>
           
          <div style={{ display: "flex", gap: 20 }}>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  NI
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Network Investigation</h3>
            </div>
            <div className="card" onClick={handleClick}>
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  HI
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Host Investigation</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  PA
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Packet Analysis</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  DM
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Data Mining</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  TA
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Trace Archive</h3>
            </div>
          </div>

           
          <h2>Configure</h2>
           
          <div style={{ display: "flex", gap: 20 }}>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  TRC
                </Avatar.Fallback>
              </Avatar.Root>
              <h3> threat Remediation COnfiguration</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  DC
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Device Configuration</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  AC
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Application Configuration</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  C
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Communities</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  CTI
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Cyber  threat Intelligence</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  SM
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Server Management</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  UM
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>User Management</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  AS
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Authentication Source</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  TIC
                </Avatar.Fallback>
              </Avatar.Root>
              <h3> threat Indicator Configuration</h3>
            </div>
          </div>

           
          <h2>Configure</h2>
           
          <div style={{ display: "flex", gap: 20 }}>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  DS
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Deployment Summary</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  US
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Usage Statistics</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  AL
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Activity Logs</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=""
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  SH
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Server Health</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=" "
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  IH
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Instrumentation Health</h3>
            </div>
            <div className="card">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src=" "
                  alt="Colm Tuite"
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  CTH
                </Avatar.Fallback>
              </Avatar.Root>
              <h3>Cyber Threat Horizon</h3>
            </div>
          </div>
        </div>
      </Tabs.Content>

      {activeTab === "tab90" && (
        <Tabs.Content className="TabsContent" value="tab90">
          <div>
            <h2>Host Intelligence</h2>
            <App />
          </div>
        </Tabs.Content>
      )}
    </Tabs.Root>
  </>
}

export default Dashboard
