import InventoryViewButton from "../components/inventory/InventoryViewButton.jsx";
import {useInventoryContext} from "../context/InventoryContext.jsx";


function InventoryView() {
    const {
        isByCategoryPageVisible, setIsByCategoryPageVisible,
        isByRoomPageVisible, setIsByRoomPageVisible,
        isScanModePageVisible, setIsScanModePageVisible,
        isSearchPageVisible, setIsSearchPageVisible,
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
        `}</style>

        <h1>Inventory View</h1>

        <div className={'frosted-glass'} id={'inventory-view-container'}>
            <InventoryViewButton
                imageName={'inventory-view-by-category-blue.png'}
            />
            <InventoryViewButton
                imageName={'inventory-view-by-room-blue.png'}
            />
            <InventoryViewButton
                imageName={'inventory-view-scan-mode-blue.png'}
            />
            <InventoryViewButton
                imageName={'inventory-view-search-blue.png'}
            />
        </div>

        <div style={{display: 'grid'}}>
            <div id={'inventory-by-category-page'} className={`by-category-page is-stacked ${isByCategoryPageVisible ? 'is-visible' : 'is-hidden'}`}>
                <h2>By Category</h2>
            </div>

            <div id={'inventory-by-room-page'} className={`by-category-page is-stacked ${isByRoomPageVisible ? 'is-visible' : 'is-hidden'}`}></div>

            <div id={'inventory-scan-mode-page'} className={`by-category-page is-stacked ${isScanModePageVisible ? 'is-visible' : 'is-hidden'}`}></div>

            <div id={'inventory-search-page'} className={`by-category-page is-stacked ${isSearchPageVisible ? 'is-visible' : 'is-hidden'}`}></div>
        </div>
    </>
}

export default InventoryView;