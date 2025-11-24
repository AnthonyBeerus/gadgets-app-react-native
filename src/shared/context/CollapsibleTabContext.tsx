import React, { createContext, useContext } from 'react';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

interface CollapsibleTabContextType {
  scrollY: SharedValue<number>;
  headerHeight: number;
  smallHeaderHeight: number;
  tabBarHeight: number;
}

const CollapsibleTabContext = createContext<CollapsibleTabContextType | undefined>(undefined);

interface CollapsibleTabProviderProps {
  children: React.ReactNode;
  headerHeight?: number;
  smallHeaderHeight?: number;
  tabBarHeight?: number;
}

export const CollapsibleTabProvider: React.FC<CollapsibleTabProviderProps> = ({ 
  children,
  headerHeight = 140,
  smallHeaderHeight = 60,
  tabBarHeight = 60
}) => {
  const scrollY = useSharedValue(0);

  return (
    <CollapsibleTabContext.Provider value={{ scrollY, headerHeight, smallHeaderHeight, tabBarHeight }}>
      {children}
    </CollapsibleTabContext.Provider>
  );
};

export const useCollapsibleTab = () => {
  const context = useContext(CollapsibleTabContext);
  if (!context) {
    throw new Error('useCollapsibleTab must be used within a CollapsibleTabProvider');
  }
  return context;
};
