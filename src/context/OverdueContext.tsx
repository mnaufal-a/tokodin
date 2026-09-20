import {createContext, useContext, useState, ReactNode,  } from "react";

interface OverdueContextType {
    overdueCount: number,
    setOverdueCount: (count: number) => void;
} 

const OverdueContext = createContext< OverdueContextType | undefined>(undefined);

export function OverdueProvider({ children } : { children : ReactNode }) {
    const [overdueCount, setOverdueCount] = useState(0);

    return (
        <OverdueContext.Provider value={{ overdueCount, setOverdueCount}}>
            {children}
        </OverdueContext.Provider>
    )
}

export function useOverdue() {
    const context = useContext(OverdueContext); 
    if (context === undefined) {
        throw new Error('useOverdue harus dipakai didalam OverdueProvider');
    }
    return context;
}