import {createContext, useContext, useState} from "react";


const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
    const [ isByCategoryPageVisible, setIsByCategoryPageVisible ] = useState(true);
    const [ isByRoomPageVisible, setIsByRoomPageVisible ] = useState(false);
    const [ isScanModePageVisible, setIsScanModePageVisible ] = useState(false);
    const [ isSearchPageVisible, setIsSearchPageVisible ] = useState(false);

    function hideAllPages() {
        setIsByCategoryPageVisible(false);
        setIsByRoomPageVisible(false);
        setIsScanModePageVisible(false);
        setIsSearchPageVisible(false);
    }

    return (
        <InventoryContext.Provider value={{
            hideAllPages,
            isByCategoryPageVisible, setIsByCategoryPageVisible,
            isByRoomPageVisible, setIsByRoomPageVisible,
            isScanModePageVisible, setIsScanModePageVisible,
            isSearchPageVisible, setIsSearchPageVisible
        }}>
            { children }
        </InventoryContext.Provider>
    )
}

export function useInventoryContext() {
    const ctx = useContext(InventoryContext);

    if (!ctx) {
        throw new Error("useInventoryContext must be used inside InventoryProvider");
    }

    return ctx;
}