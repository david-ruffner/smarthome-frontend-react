import {createContext, useContext, useState} from "react";


const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
    const [ isByCategoryPageVisible, setIsByCategoryPageVisible ] = useState(false); // TODO: Revert to true
    const [ isByRoomPageVisible, setIsByRoomPageVisible ] = useState(false);
    const [ isScanModePageVisible, setIsScanModePageVisible ] = useState(false);
    const [ isSearchPageVisible, setIsSearchPageVisible ] = useState(true);
    const [ isSearchComponentVisible, setIsSearchComponentVisible ] = useState(true);
    const [ isResultsComponentVisible, setIsResultsComponentVisible ] = useState(false);

    const viewOptions = [
        {
            value: 'card-view',
            label: 'Card View'
        },
        {
            value: 'list-view',
            label: 'List View'
        }
    ]
    // The default currentViewOption is 'list-view'
    const [ currentViewOption, setCurrentViewOption ] = useState(viewOptions.find(vo => vo.value === 'list-view'));

    function hideAllPages() {
        setIsByCategoryPageVisible(false);
        setIsByRoomPageVisible(false);
        setIsScanModePageVisible(false);
        setIsSearchPageVisible(false);
        setIsSearchComponentVisible(false);
        setIsResultsComponentVisible(false)
    }

    return (
        <InventoryContext.Provider value={{
            hideAllPages,
            isByCategoryPageVisible, setIsByCategoryPageVisible,
            isByRoomPageVisible, setIsByRoomPageVisible,
            isScanModePageVisible, setIsScanModePageVisible,
            isSearchPageVisible, setIsSearchPageVisible,
            viewOptions, currentViewOption, setCurrentViewOption,
            isSearchComponentVisible, setIsSearchComponentVisible,
            isResultsComponentVisible, setIsResultsComponentVisible
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