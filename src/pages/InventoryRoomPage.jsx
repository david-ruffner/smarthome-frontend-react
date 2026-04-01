import {useEffect, useState} from "react";
import {useInventoryContext} from "../context/InventoryContext.jsx";
import {BACKEND_HOST} from "../components/Constants.jsx";
import {isArrayEmpty, isStrEmpty, logErr} from "../utils/Utils.js";
import {notify} from "../services/NotificationService.jsx";
import CustomSelect from "../components/global/CustomSelect.jsx";


class CurrentRoom {
    constructor(roomId, roomName) {
        this.roomId = roomId;
        this.roomName = roomName;
    }
}

function InventoryRoomPage() {

    const {
        isByRoomPageVisible
    } = useInventoryContext();

    // const [ currentRoomId, setCurrentRoomId ] = useState('');
    // const [ currentRoomName, setCurrentRoomName ] = useState('');

    const [ currentRoomItems, setCurrentRoomItems ] = useState([]);
    const [ currentRoomContainers, setCurrentRoomContainers ] = useState([]);
    const [ currentRoomContainerId, setCurrentRoomContainerId ] = useState('');
    const [ currentRoomContainerName, setCurrentRoomContainerName ] = useState('');
    const [ isContainerSelectorDisabled, setIsContainerSelectorDisabled ] = useState(false);
    const [ rooms, setRooms ] = useState([]);

    async function fetchRooms() {
        if (!isByRoomPageVisible) return null;

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

    async function fetchRoomItems() {
        if (!isByRoomPageVisible) return null;

        if (isStrEmpty(currentRoomId) && isStrEmpty(currentRoomContainerId)) {
            throw new Error("Tried to fetch room items while currentRoomId and currentRoomContainerId are both null");
        }

        const res = await fetch(`${BACKEND_HOST}/inventory/getAllItemsByRoom/${currentRoomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(`There was an error while fetching room items: ${body.errMsg}`)
        }

        return await res.json();
    }

    async function fetchRoomContainers() {
        if (!isByRoomPageVisible) return null;

        if (!currentRoomId) {
            throw new Error("Tried to fetch room containers while currentRoomId is null");
        }

        const res = await fetch(`${BACKEND_HOST}/inventory/getAllContainersForRoom/${currentRoomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(`There was an error while fetching room items: ${body.errMsg}`)
        }

        return await res.json();
    }

    async function fetchItemsByContainerId() {
        if (!isByRoomPageVisible) return null;

        if (isStrEmpty(currentRoomContainerId)) {
            throw new Error('Tried to fetch items by container id when currentRoomContainerId is empty');
        }

        const res = await fetch(`${BACKEND_HOST}/inventory/getAllItemsByContainerId/${currentRoomContainerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`There was an error while fetching items by container`)
        }

        return await res.json();
    }

    function handleRoomChange(e) {
        const roomId = e.target.value;
        const room = rooms.find(room => room.roomId === roomId);

        setCurrentRoomId(roomId);
        setCurrentRoomName(room ? room.roomName : '');
    }

    function handleRoomContainerChange(e) {
        const containerId = e.target.value;
        setCurrentRoomContainer(containerId);
    }

    function setCurrentRoomContainer(containerId) {
        const container = currentRoomContainers.find(container => container.containerId === containerId);

        setCurrentRoomContainerId(containerId);
        setCurrentRoomContainerName(container ? container.containerName : '');
    }

    /**
     * Grabs rooms when the room page is visible
     */
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

    useEffect(() => {
        if (!isByRoomPageVisible || !currentRoomId) return;

        console.log(`Current Room ID: ${currentRoomId}`); // TODO: Remove

        setCurrentRoomContainer('all');

        fetchRoomItems()
            .then((data) => {
                console.log(data); // TODO: Remove
                if (data.shortCode === "NO_ROOM_ITEMS") {
                    setCurrentRoomItems(null);
                } else {
                    setCurrentRoomItems(data.items);
                }
            })
            .catch((err) => {
                logErr({
                    errMsg: err
                })
            })

        fetchRoomContainers()
            .then((data) => {
                if (data.shortCode === "NO_ITEM_CONTAINERS") {
                    setCurrentRoomContainers([
                        {
                            containerId: 'none',
                            containerName: 'No Containers'
                        }
                    ])
                    setIsContainerSelectorDisabled(true);
                } else {
                    const roomContainers = [
                        {
                            containerId: 'all',
                            containerName: 'All Containers'
                        }
                    ]
                    setCurrentRoomContainers([...roomContainers, ...data.itemContainers]);
                    setIsContainerSelectorDisabled(false);
                    console.log(roomContainers); // TODO: Remove
                }
            })
            .catch((err) => {
                logErr({
                    errMsg: err
                })
            })
    }, [currentRoomId]);

    /**
     * Fires when a specific item container is selected
     */
    useEffect(() => {
        if (!isStrEmpty(currentRoomContainerId)) {
            if (currentRoomContainerId === 'all') {
                fetchRoomItems()
                    .then((data) => {
                        console.log(data); // TODO: Remove
                        if (data.shortCode === "NO_ROOM_ITEMS") {
                            setCurrentRoomItems(null);
                        } else {
                            setCurrentRoomItems(data.items);
                        }
                    })
                    .catch((err) => {
                        logErr({
                            errMsg: err
                        })
                    })
            } else {
                fetchItemsByContainerId()
                    .then((data) => {
                        console.log(data); // TODO: Remove
                        if (data.shortCode === "NO_ROOM_ITEMS") {
                            setCurrentRoomItems(null);
                        } else {
                            setCurrentRoomItems(data.items);
                        }
                    })
                    .catch((err) => {
                        logErr({
                            errMsg: err
                        })
                    })

            }
        }
    }, [currentRoomContainerId]);

    return <>
        <style>{`            
            #room-selection-options {
                display: grid;
                grid-template-rows: repeat(2, 1fr);
                justify-self: center;
                grid-row-gap: 25px;
            }
            
            #room-selection-options select {
                width: max-content;
                justify-self: center;
                text-align: center;
            }
            
            #inventory-room-select {
                height: max-content;
            }
            
            #room-container-select {
                margin-top: -1px;
                margin-bottom: 50px;
            }
            
            .item-outer-wrapper:last-of-type {
                margin-bottom: 100px;
            }
        `}</style>
        <div id={'inventory-by-room-page'} className={`by-category-page is-stacked ${isByRoomPageVisible ? 'is-visible' : 'is-hidden'}`}>
            <h2>By Room</h2>

            <div id={'room-selection-options'}>
                {/*<select*/}
                {/*    className={'dropdown'}*/}
                {/*    value={currentRoomId}*/}
                {/*    onChange={handleRoomChange}*/}
                {/*    id={'inventory-room-select'}>*/}
                {/*    {!isArrayEmpty(rooms) && rooms.map(room => (*/}
                {/*        <option key={room.roomId} value={room.roomId}>*/}
                {/*            {room.roomName}*/}
                {/*        </option>*/}
                {/*    ))}*/}
                {/*</select>*/}

                <CustomSelect
                    idName={'room-selector'}
                    options={rooms}

                />

                <select
                    disabled={isContainerSelectorDisabled}
                    className={'dropdown'}
                    value={currentRoomContainerId}
                    onChange={handleRoomContainerChange}
                    id={'room-container-select'}>
                    {!isArrayEmpty(currentRoomContainers) && currentRoomContainers.map(container => (
                        <option key={container.containerId} value={container.containerId}>
                            {container.containerName}
                        </option>
                    ))}
                </select>
            </div>

            {currentRoomItems === null && (
                <h2>No Items In Room</h2>
            )}

            {!isArrayEmpty(currentRoomItems) && (
                <div id={'items-outer-wrapper'}>
                    {currentRoomItems.map((item) => (
                        <div className={'item-outer-wrapper frosted-glass'}>
                            <h3>Name</h3>
                            <div className={'vertical-divider'}></div>
                            <p>{item.itemName}</p>

                            <h3>Container</h3>
                            <div className={'vertical-divider'}></div>
                            <p>{!isStrEmpty(item?.itemContainerName) ? item.itemContainerName : 'None'}</p>

                            <h3>UPC</h3>
                            <div className={'vertical-divider'}></div>
                            <p>{item.upc}</p>

                            <h3>Quantity</h3>
                            <div className={'vertical-divider'}></div>
                            <p className={item.isQuantityAtThreshold ? 'item-quantity-at-threshold' : ''}>{item.quantity}</p>

                            <h3>Category</h3>
                            <div className={'vertical-divider'}></div>
                            <p>{!isStrEmpty(item.categoryName) ? item.categoryName : 'None'}</p>

                            <h3>Description</h3>
                            <div className={'vertical-divider'}></div>
                            <p>{!isStrEmpty(item.description) ? item.description : 'None'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </>
}

export default InventoryRoomPage;