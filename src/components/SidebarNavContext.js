import React from 'react';
import SidebarNav from '../components/SidebarNav';

export const SidebarNavContext = React.createContext({
  current: 'overview',
  setCurrent: () => {},
});

export function useSidebarNav() {
  const context = React.useContext(SidebarNavContext);
  if (!context) throw new Error('SidebarNavContext not found');
  return context;
}
