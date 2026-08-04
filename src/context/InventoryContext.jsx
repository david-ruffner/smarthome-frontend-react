import {createContext, useContext, useState} from "react";
import {useUI} from "./UIContext.jsx";


const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
    const [ isByCategoryPageVisible, setIsByCategoryPageVisible ] = useState(false); // TODO: Revert to true
    const [ isByRoomPageVisible, setIsByRoomPageVisible ] = useState(false);
    const [ isScanModePageVisible, setIsScanModePageVisible ] = useState(true);
    const [ isSearchPageVisible, setIsSearchPageVisible ] = useState(false);
    const [ isSearchComponentVisible, setIsSearchComponentVisible ] = useState(false);
    const [ isResultsComponentVisible, setIsResultsComponentVisible ] = useState(false);

    const [ clickedItemDetails, setClickedItemDetails ] = useState(null);

    const [ showItemDetailsModalOpacity, setShowItemDetailsModalOpacity ] = useState(false);
    const [ showItemDetailsModalDisplay, setShowItemDetailsModalDisplay ] = useState(false);

    const {
        showModalBG,
        hideModalBG
    } = useUI();

    function showItemDetailModal(shouldShow) {
        if (shouldShow) {
            showModalBG();

            setShowItemDetailsModalDisplay(true);
            setTimeout(() => {
                setShowItemDetailsModalOpacity(true)
            }, 50);
        } else {
            hideModalBG();

            setShowItemDetailsModalOpacity(false);
            setTimeout(() => {
                setShowItemDetailsModalDisplay(false)
            }, 500);
        }
    }

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
            isResultsComponentVisible, setIsResultsComponentVisible,
            clickedItemDetails, setClickedItemDetails,
            showItemDetailsModalOpacity, setShowItemDetailsModalOpacity,
            showItemDetailsModalDisplay, setShowItemDetailsModalDisplay,
            showItemDetailModal
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