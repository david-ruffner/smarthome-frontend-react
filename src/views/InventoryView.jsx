import InventoryViewButton from "../components/inventory/InventoryViewButton.jsx";
import {useInventoryContext} from "../context/InventoryContext.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../components/Constants.jsx";
import {notify} from "../services/NotificationService.jsx";
import {isArrayEmpty, isStrEmpty, logErr} from "../utils/Utils.js";
import InventoryRoomPage from "../pages/InventoryRoomPage.jsx";
import InventoryCategoryPage from "../pages/InventoryCategoryPage.jsx";
import InventorySearchPage from "../pages/InventorySearchPage.jsx";


function InventoryView() {
    const {
        isByCategoryPageVisible, setIsByCategoryPageVisible,
        isByRoomPageVisible, setIsByRoomPageVisible,
        isScanModePageVisible, setIsScanModePageVisible,
        isSearchPageVisible, setIsSearchPageVisible,
        isSearchComponentVisible, setIsSearchComponentVisible,
        isResultsComponentVisible, setIsResultsComponentVisible,
        hideAllPages
    } = useInventoryContext();

    return <>
        <style>{`
            #inventory-view-container {
                width: 720px;
                overflow-x: scroll;
                margin-top: 50px;
                padding: 15px 0;
                display: grid;
                grid-template-columns: repeat(4, 250px);
            }
            
            .by-category-page > h2 {
                font-size: 24pt;
                margin-top: 25px;
            }
            
            .dropdown {
                font-size: 24pt;
            }
        `}</style>

        <h1>Inventory View</h1>

        <div className={'frosted-glass'} id={'inventory-view-container'}>
            <InventoryViewButton
                imageName={'inventory-view-by-category-blue.png'}
                onClick={() => {
                    hideAllPages();
                    setIsByCategoryPageVisible(true);
                }}
            />
            <InventoryViewButton
                imageName={'inventory-view-by-room-blue.png'}
                onClick={() => {
                    hideAllPages();
                    setIsByRoomPageVisible(true);
                }}
            />
            <InventoryViewButton
                imageName={'inventory-view-scan-mode-blue.png'}
                onClick={() => {
                    hideAllPages();
                    setIsScanModePageVisible(true);
                }}
            />
            <InventoryViewButton
                imageName={'inventory-view-search-blue.png'}
                onClick={() => {
                    hideAllPages();
                    setIsSearchPageVisible(true);
                    setIsSearchComponentVisible(true);
                }}
            />
        </div>

        <div style={{display: 'grid'}}>
            <InventoryCategoryPage />
            <InventoryRoomPage />

            <div id={'inventory-scan-mode-page'} className={`by-category-page is-stacked ${isScanModePageVisible ? 'is-visible' : 'is-hidden'}`}>
                <h2>Scan</h2>
            </div>

            <InventorySearchPage />
        </div>
    </>
}

export default InventoryView;