import React, {createContext, useEffect, useState, useContext} from 'react';
export const AppContext = createContext({});

const AppContextProvider = ({children}) => {
  // Page Name state (example)
  const [devices, setDevices] = useState([]);
  const [devicesId, setDevicesId] = useState([]);

  return (
    <AppContext.Provider
      value={{
        devices,
        setDevices,
        setDevicesId,
        devicesId
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
