import React, { createContext, useContext, useMemo, useState } from 'react';
import { services as catalogue } from '../data/services';
import { themes } from '../constants/theme';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [scheme, setScheme] = useState('light');
  const theme = themes[scheme];
  const services = useMemo(() => catalogue, []);

  const value = {
    theme,
    scheme,
    services,
    toggleTheme: () => setScheme(current => current === 'light' ? 'dark' : 'light'),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider.');
  return context;
}
