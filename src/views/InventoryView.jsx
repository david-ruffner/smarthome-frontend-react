import InventoryViewButton from "../components/inventory/InventoryViewButton.jsx";
import {useInventoryContext} from "../context/InventoryContext.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../components/Constants.jsx";
import {notify} from "../services/NotificationService.jsx";
import {isArrayEmpty, logErr} from "../utils/Utils.js";


function InventoryView() {
    const {
        isByCategoryPageVisible, setIsByCategoryPageVisible,
        isByRoomPageVisible, setIsByRoomPageVisible,
        isScanModePageVisible, setIsScanModePageVisible,
        isSearchPageVisible, setIsSearchPageVisible,
        hideAllPages
    } = useInventoryContext();

    const [ currentRoomId, setCurrentRoomId ] = useState('');
    const [ currentRoomName, setCurrentRoomName ] = useState('');
    const [ rooms, setRooms ] = useState([]);

    async function fetchRooms() {
        const res = await fetch(`${BACKEND_HOST}/inventory/getAllRooms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            notify("There was an error while fetching rooms.")
            logErr({
                errMsg: "There was an error while fetching rooms",
                data: res
            })
        }

        return await res.json();
    }

    function handleRoomChange(e) {
        const roomId = e.target.value;
        const room = rooms.find(room => room.roomId === roomId);

        setCurrentRoomId(roomId);
        setCurrentRoomName(room ? room.roomName : '');

        console.log(`Room ID: ${roomId}`);
    }

    useEffect(() => {
        if (!isByRoomPageVisible) return;

        fetchRooms()
            .then((data) => {
                setRooms(data.rooms);

                if (!isArrayEmpty(data.rooms)) {
                    setCurrentRoomId(data.rooms[0].roomId);
                    setCurrentRoomName(data.rooms[0].roomName);
                }
            })

    }, [isByRoomPageVisible]);

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
                }}
            />
        </div>

        <div style={{display: 'grid'}}>
            <div id={'inventory-by-category-page'} className={`by-category-page is-stacked ${isByCategoryPageVisible ? 'is-visible' : 'is-hidden'}`}>
                <h2>By Category</h2>
            </div>

            <div id={'inventory-by-room-page'} className={`by-category-page is-stacked ${isByRoomPageVisible ? 'is-visible' : 'is-hidden'}`}>
                <h2>By Room</h2>

                <select
                    className={'dropdown'}
                    value={currentRoomId}
                    onChange={handleRoomChange}
                    id={'inventory-room-select'}>
                    {!isArrayEmpty(rooms) && rooms.map(room => (
                        <option key={room.roomId} value={room.roomId}>
                            {room.roomName}
                        </option>
                    ))}
                </select>
            </div>

            <div id={'inventory-scan-mode-page'} className={`by-category-page is-stacked ${isScanModePageVisible ? 'is-visible' : 'is-hidden'}`}>
                <h2>Scan</h2>
            </div>

            <div id={'inventory-search-page'} className={`by-category-page is-stacked ${isSearchPageVisible ? 'is-visible' : 'is-hidden'}`}>
                <h2>Search</h2>
            </div>
        </div>
    </>
}

export default InventoryView;