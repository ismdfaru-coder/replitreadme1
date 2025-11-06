
'use client';

import { createContext, useContext, useState, useMemo } from 'react';

type PublicLayoutContextType = {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
};

const PublicLayoutContext = createContext<PublicLayoutContextType | null>(null);

export function PublicLayoutProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const value = useMemo(
    () => ({ isSidebarOpen, setSidebarOpen, toggleSidebar }),
    [isSidebarOpen]
  );

  return (
    <PublicLayoutContext.Provider value={value}>
      {children}
    </PublicLayoutContext.Provider>
  );
}

export function usePublicLayout() {
  const context = useContext(PublicLayoutContext);
  if (!context) {
    throw new Error('usePublicLayout must be used within a PublicLayoutProvider');
  }
  return context;
}
