"use client"
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
interface SideBarContextType {
  sidebarExpanded: boolean;
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}

export const SideBarContext = createContext<SideBarContextType | null>(null);

export const SideBarProvider = ({ children, initialExpanded }: { children: ReactNode, initialExpanded: boolean }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(initialExpanded);

  return (
    <SideBarContext.Provider value={{ sidebarExpanded, setSidebarExpanded }}>
      {children}
    </SideBarContext.Provider>
  );
};

export const useSideBarContext = () => {
  const context = useContext(SideBarContext);
  if (!context) {
    throw new Error("useSideBarContext must be used within a SideBarProvider");
  }
  return context;
}