import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { CacheSystem } from '../utility/CachedVersionedData';

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setCacheData: React.Dispatch<React.SetStateAction<CacheSystem | null>>; // Update to CacheSystem
}

const Login = ({ setIsLoggedIn, setCacheData }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Hardcoded username and password for demonstration
    if (username === 'ujwal' && password === 'ujwalpassword') {
      // Check if cache exists
      const hostname = window.location.hostname;
      const existingCache = localStorage.getItem(hostname);

      let cache: CacheSystem = {
        globalVersion: "1.0.0", // Set an initial global version
        sites: {} // Initialize an empty site cache object
      };

      if (existingCache) {
        // If cache exists, parse and load it
        cache = JSON.parse(existingCache);
      } else {
        // If no cache exists, initialize cache for the current site
        cache.sites[hostname] = {
          'exampleKey': {
            localVersion: '1.0.0',
            hash: 'examplehashvalue',
            lastUsed: new Date()
          }
        };
        // Optionally store the empty cache in localStorage for future visits
        localStorage.setItem(hostname, JSON.stringify(cache));
      }

      // Pass cache data to the parent component
      setCacheData(cache);

      // Store login status
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      navigate('/'); // Redirect to the Dashboard page
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div>
      <center>
        <h1>Netscout Omnis Cyber Intelligence</h1>
        <div>
          <h2>Login Page</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <center>
                <label htmlFor="username" className="loginform">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="loginform"
                />
              </center>
            </div>
            <div>
              <label htmlFor="password" className="loginform">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="loginform"
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </center>
    </div>
  );
};

export default Login;
