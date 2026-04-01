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

class CurrentRoomContainer {
    constructor(roomContainerId, roomContainerName) {
        this.roomContainerId = roomContainerId;
        this.roomContainerName = roomContainerName;
    }
}

function InventoryRoomPage() {

    const {
        isByRoomPageVisible,
        viewOptions, currentViewOption, setCurrentViewOption
    } = useInventoryContext();

    // const [ currentRoomId, setCurrentRoomId ] = useState('');
    // const [ currentRoomName, setCurrentRoomName ] = useState('');

    const [ currentRoom, setCurrentRoom ] = useState(null);
    const [ currentRoomItems, setCurrentRoomItems ] = useState([]);
    const [ currentRoomContainers, setCurrentRoomContainers ] = useState([]);
    const [ currentRoomContainer, setCurrentRoomContainer ] = useState(null);
    // const [ currentRoomContainerId, setCurrentRoomContainerId ] = useState('');
    // const [ currentRoomContainerName, setCurrentRoomContainerName ] = useState('');
    const [ isContainerSelectorDisabled, setIsContainerSelectorDisabled ] = useState(false);
    const [ currentRooms, setCurrentRooms ] = useState([]);

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

        if (isStrEmpty(currentRoom?.value) && isStrEmpty(currentRoomContainer?.value)) {
            throw new Error("Tried to fetch room items while currentRoomId and currentRoomContainerId are both null");
        }

        const res = await fetch(`${BACKEND_HOST}/inventory/getAllItemsByRoom/${currentRoom.value}`, {
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

        if (!currentRoom?.value) {
            throw new Error("Tried to fetch room containers while currentRoomId is null");
        }

        const res = await fetch(`${BACKEND_HOST}/inventory/getAllContainersForRoom/${currentRoom.value}`, {
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

        if (isStrEmpty(currentRoomContainer?.value)) {
            throw new Error('Tried to fetch items by container id when currentRoomContainerId is empty');
        }

        const res = await fetch(`${BACKEND_HOST}/inventory/getAllItemsByContainerId/${currentRoomContainer.value}`, {
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
        const room = currentRooms.find(room => room.roomId === roomId);

        setCurrentRoom(new CurrentRoom(roomId, room.roomName))
        // setCurrentRoomId(roomId);
        // setCurrentRoomName(room ? room.roomName : '');
    }

    function handleRoomContainerChange(e) {
        const containerId = e.target.value;
        setCurrentRoomContainer(containerId);
    }

    /**
     * Grabs rooms when the room page is visible
     */
    useEffect(() => {
        if (!isByRoomPageVisible) return;

        fetchRooms()
            .then((data) => {
                const rooms = data.rooms.map(r => ({
                    value: r.roomId,
                    label: r.roomName
                }))
                setCurrentRooms(rooms);

                if (!isArrayEmpty(rooms)) {
                    setCurrentRoom(rooms[0]);
                }
            })

    }, [isByRoomPageVisible]);

    useEffect(() => {
        if (!isByRoomPageVisible || !currentRoom?.value) return;

        console.log(`Current Room ID: ${currentRoom.value}`); // TODO: Remove

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
                    const currentRoom = {
                        value: 'none',
                        label: 'No Containers'
                    };

                    setCurrentRoomContainers([currentRoom])
                    setCurrentRoomContainer(currentRoom);
                    setIsContainerSelectorDisabled(true);
                } else {
                    const cr = {
                        value: 'all',
                        label: 'All Containers'
                    };
                    const roomContainers = [cr];
                    const itemContainers = data.itemContainers.map(ic => ({
                        value: ic.containerId,
                        label: ic.containerName
                    }))

                    setCurrentRoomContainers([...roomContainers, ...itemContainers]);
                    setCurrentRoomContainer(roomContainers[0])
                    setIsContainerSelectorDisabled(false);
                    console.log(roomContainers); // TODO: Remove
                }
            })
            .catch((err) => {
                logErr({
                    errMsg: err
                })
            })
    }, [currentRoom]);

    /**
     * Fires when a specific item container is selected
     */
    useEffect(() => {
        if (!isStrEmpty(currentRoomContainer?.value)) {
            if (currentRoomContainer.value === 'all') {
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
    }, [currentRoomContainer]);

    return <>
        <style>{`            
            #room-selection-options {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                justify-self: center;
                justify-content: center;
                align-items: center;
                grid-row-gap: 25px;
                grid-column-gap: 35px;
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
                <CustomSelect
                    idName={'room-selector'}
                    options={currentRooms}
                    value={currentRoom?.value}
                    onChange={(val) => {
                        setCurrentRoom(currentRooms.find(cr => cr.value === val));
                        // On room change, reset current container to "all"
                        setCurrentRoomContainer(currentRoomContainers.find(crc => crc.value === 'all'));
                    }}
                    background={'var(--frosted-glass-faded-blue-background)'}
                    fontSize={'18pt'}
                    selectionFlashBackground={'var(--frosted-glass-light-blue-background)'}
                    selectOptionPadding={'20px'}
                    arrowTransitionSpeed={'300ms'}
                    selectDisplayBackgroundColor={'var(--frosted-glass-light-blue-background)'}
                    selectDisplayTransitionTime={'150ms'}
                    selectionFlashTime={'150ms'}
                    containerJustify={'center'}
                    containerMargin={'25px 0 0 0'}
                />

                <CustomSelect
                    idName={'room-container-selector'}
                    options={currentRoomContainers}
                    value={currentRoomContainer?.value}
                    onChange={(val) => {
                        setCurrentRoomContainer(currentRoomContainers.find(crc => crc.value === val));
                    }}
                    background={'var(--frosted-glass-faded-blue-background)'}
                    fontSize={'18pt'}
                    selectionFlashBackground={'var(--frosted-glass-light-blue-background)'}
                    selectOptionPadding={'20px'}
                    arrowTransitionSpeed={'300ms'}
                    selectDisplayBackgroundColor={'var(--frosted-glass-light-blue-background)'}
                    selectDisplayTransitionTime={'150ms'}
                    selectionFlashTime={'150ms'}
                    containerJustify={'center'}
                    containerMargin={'25px 0 0 0'}
                />

                <CustomSelect
                    idName={'view-type-select'}
                    options={viewOptions}
                    value={currentViewOption?.value}
                    onChange={(val) => {
                        setCurrentViewOption(viewOptions.find(vo => vo.value === val));
                    }}
                    background={'var(--frosted-glass-faded-blue-background)'}
                    fontSize={'18pt'}
                    selectionFlashBackground={'var(--frosted-glass-light-blue-background)'}
                    selectOptionPadding={'20px'}
                    arrowTransitionSpeed={'300ms'}
                    selectDisplayBackgroundColor={'var(--frosted-glass-light-blue-background)'}
                    selectDisplayTransitionTime={'150ms'}
                    selectionFlashTime={'150ms'}
                    containerJustify={'center'}
                    containerMargin={'25px 0 0 0'}
                />
            </div>

            {currentRoomItems === null && (
                <h2>No Items In Room</h2>
            )}

            {!isArrayEmpty(currentRoomItems) && currentViewOption.value === 'list-view' && (
                <div id={'list-items-outer-wrapper'}>
                    {currentRoomItems.map((item) => (
                        <div key={item.itemId} className={'item-outer-wrapper frosted-glass'}
                             style={{gridTemplateColumns: 'repeat(7, auto)'}}>
                            <p style={{gridColumn: '1'}}>{item.itemName}</p>
                            <div style={{gridColumn: '2'}} className={'vertical-divider'}></div>
                            <p style={{gridColumn: '3'}} className={item.isQuantityAtThreshold ? 'item-quantity-at-threshold' : ''}>{item.quantity}</p>
                            <div style={{gridColumn: '4'}} className={'vertical-divider'}></div>
                            <p style={{gridColumn: '5'}}>{!isStrEmpty(item?.itemContainerName) ? item.itemContainerName : 'None'}</p>
                            <div style={{gridColumn: '6'}} className={'vertical-divider'}></div>
                            <p style={{gridColumn: '7'}}>{item.upc}</p>
                        </div>
                    ))}
                </div>
            )}

            {!isArrayEmpty(currentRoomItems) && currentViewOption.value === 'card-view' && (
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