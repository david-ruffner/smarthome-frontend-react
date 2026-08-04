import ItemModalTile from "./ItemModalTile.jsx";
import {useInventoryContext} from "../../context/InventoryContext.jsx";
import {useEffect, useState} from "react";
import {isObjEmpty} from "../../utils/Utils.js";

function ItemDetailModal() {
    const {
        clickedItemDetails,
        showItemDetailsModalOpacity,
        showItemDetailsModalDisplay,
        showItemDetailModal
    } = useInventoryContext();

    const [ descriptionVal, setDescriptionVal ] = useState(null);

    function handleCloseOnClick() {
        showItemDetailModal(false);
    }

    useEffect(() => {
        if (isObjEmpty(clickedItemDetails)) return;

        setDescriptionVal(clickedItemDetails?.description ?? 'No Description');
    }, [clickedItemDetails]);

    return (
        <>
            <div id={'item-detail-modal'} style={{width: '90vw', height: '90vh',
                gridColumn: 1, gridRow: 1, zIndex: 100, justifySelf: 'center',
                opacity: showItemDetailsModalOpacity ? 1 : 0, display: showItemDetailsModalDisplay ? 'grid' : 'none',
                transition: 'opacity 500ms ease-in', alignSelf: 'start', marginTop: '50px',
                gridTemplateRows: 'repeat(5, max-content)', overflowY: 'scroll'}}
                 className={'frosted-glass-faded-blue'}>

                <img src="/src/assets/images/common/close-icon-white.png" alt="Close Modal" style={{width: '65px',
                height: 'auto', justifySelf: 'end', margin: '25px 25px 0 0'}} onClick={handleCloseOnClick}/>

                <h1 style={{fontSize: '48pt', color: 'white', fontWeight: 400, justifySelf: 'center',
                    textAlign: 'center', marginTop: '50px'}}>{clickedItemDetails?.name ?? 'No Name'}</h1>
                <div style={{width: '75%', height: '1px', justifySelf: 'center', backgroundColor: 'white',
                    marginTop: '50px'}}></div>


                <ItemModalTile title={'Description'} value={descriptionVal} setValue={setDescriptionVal}/>
                <ItemModalTile title={'Room Name'} value={clickedItemDetails?.roomName ?? 'No Room Name'}/>
                <ItemModalTile title={'Container Name'} value={clickedItemDetails?.containerName ?? 'No Container Name'}/>
                <ItemModalTile title={'UPC'} value={clickedItemDetails?.upc ?? 'No UPC'}/>
                <ItemModalTile title={'Current Quantity'} value={clickedItemDetails?.currentQuantity ?? 'No Quantity'}/>
                <ItemModalTile title={'Quantity Threshold'} value={clickedItemDetails?.quantityThreshold ?? 'No Threshold'}/>
                <ItemModalTile title={'Notify On Threshold Hit'} value={clickedItemDetails?.notifyOnThreshold.toString() ?? 'No Value'}/>
                <ItemModalTile title={'Category Name'} value={clickedItemDetails?.categoryName ?? 'No Category'}/>
                {/* TODO: Tags */}
                <ItemModalTile title={'Favorite'} value={clickedItemDetails?.isFavorite.toString() ?? 'No Value'}/>
            </div>
        </>
    )
}

export default ItemDetailModal;