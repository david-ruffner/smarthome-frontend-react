import {useEffect, useState} from "react";
import {isStrEmpty} from "../utils/Utils.js";

export class WSMessage {
    constructor(json) {
        this.type = json.type;
        this.func = json.func;
        this.upc = json.upc;
    }
}


function InventoryScanPage({ idName, visibilityToggle }) {

    const [ isAddItemContainerVisible, setIsAddItemContainerVisible ] = useState(true); // TODO: Revert to false
    const [ currentItemName, setCurrentItemName ] = useState('');
    const [ itemContainers, setItemContainers ] = useState([]);
    const [ currentItemContainer, setCurrentItemContainer ] = useState(null);
    const [ currentItemUPC, setCurrentItemUPC ] = useState('');
    const [ currentItemQuantity, setCurrentItemQuantity ] = useState(0);
    const [ categories, setCategories ] = useState([]);
    const [ currentItemCategory, setCurrentItemCategory ] = useState(null);
    const [ currentItemDescription, setCurrentItemDescription ] = useState('');

    function handleScanMessage(msg) {

    }

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws");

        socket.onopen = () => {
            console.log(`Connected to Web Socket!`);
        }

        socket.onmessage = (event) => {
            console.log("Received:", event.data);
            const msg = new WSMessage(event.data);

            if (msg.type === 'SCAN') {
                handleScanMessage(msg);
            }
        };

        socket.onclose = () => {
            console.log("Closed");
        };

        socket.onerror = (event) => {
            console.error("WebSocket error:", event);
        };

        return () => socket.close();
    }, []);

    return <>
        <style>{`
            .vertical-divider {
                height: 75%;
                align-self: center;
            }
        `}</style>

        <div id={idName} className={`by-category-page is-stacked ${visibilityToggle ? 'is-visible' : 'is-hidden'}`}>
            <h2>Scan</h2>

            <div id={'add-item-container'}
                 className={`frosted-glass is-stacked fadable ${isAddItemContainerVisible ? 'is-visible' : 'is-hidden'}`}
                 style={{
                     margin: '25px auto',
                     width: '80%',
                     display: 'grid',
                     gridTemplateColumns: '30% 5% 65%',
                     gridRowGap: '25px'
                 }}
            >
                <h2 style={{gridColumn: '1 / span 3'}}>Add Item</h2>

                <h3>Name</h3>
                <div className={'vertical-divider'}></div>
                <p>{currentItemName}</p>

                <h3>Container</h3>
                <div className={'vertical-divider'}></div>
                <p>{!isStrEmpty(currentItemContainer?.itemContainerName) ? currentItemContainer.itemContainerName : 'None'}</p>

                <h3>UPC</h3>
                <div className={'vertical-divider'}></div>
                <p>{currentItemUPC}</p>

                <h3>Quantity</h3>
                <div className={'vertical-divider'}></div>
                <p>{currentItemQuantity}</p>

                <h3>Category</h3>
                <div className={'vertical-divider'}></div>
                <p>{!isStrEmpty(currentItemCategory?.categoryName) ? currentItemCategory.categoryName : 'None'}</p>

                <h3>Description</h3>
                <div className={'vertical-divider'}></div>
                <p>{!isStrEmpty(currentItemDescription) ? currentItemDescription : 'None'}</p>
            </div>
        </div>
    </>
}

export default InventoryScanPage;