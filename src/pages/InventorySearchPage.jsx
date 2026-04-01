import {useInventoryContext} from "../context/InventoryContext.jsx";
import CustomSelect from "../components/global/CustomSelect.jsx";
import {useEffect, useState} from "react";
import {BACKEND_HOST} from "../components/Constants.jsx";
import {notify} from "../services/NotificationService.jsx";
import {isArrayEmpty, isObjEmpty, isStrEmpty, logErr} from "../utils/Utils.js";


function InventorySearchPage() {
    const {
        isSearchPageVisible
    } = useInventoryContext();

    const filterSelections = [
        {
            value: 'none',
            label: 'None'
        },
        {
            value: 'by-category',
            label: 'By Category'
        },
        {
            value: 'by-room',
            label: 'By Room'
        }
    ]

    const quantityFilters = [
        {
            value: 'equal',
            label: 'Equal To'
        },
        {
            value: 'less-than',
            label: 'Less Than'
        },
        {
            value: 'less-than-or-equal',
            label: 'Less Than Or Equal'
        },
        {
            value: 'more-than',
            label: 'More Than'
        },
        {
            value: 'more-than-or-equal',
            label: 'More Than Or Equal'
        },
        {
            value: 'is-in-threshold',
            label: 'Is Within Quantity Threshold'
        },
        {
            value: 'is-out-of-threshold',
            label: 'Is Out Of Quantity Threshold'
        }
    ]

    const [ currentFilter, setCurrentFilter ] = useState(filterSelections.find(fs => fs.value === 'none'));
    const [ isCategoryFilterVisible, setIsCategoryFilterVisible ] = useState(false);
    const [ isRoomFilterVisible, setIsRoomFilterVisible ] = useState(false);
    const [ isContainerFilterVisible, setIsContainerFilterVisible ] = useState(false);
    const [ isContainerFilterDisabled, setIsContainerFilterDisabled ] = useState(false);
    const [ roomFilters, setRoomFilters ] = useState([]);
    const [ currentRoomFilter, setCurrentRoomFilter ] = useState(null);
    const [ containerFilters, setContainerFilters ] = useState([]);
    const [ currentContainerFilter, setCurrentContainerFilter ] = useState(null);
    const [ categoryFilters, setCategoryFilters ] = useState([]);
    const [ currentCategoryFilter, setCurrentCategoryFilter ] = useState(null);
    const [ isQuantityInputVisible, setIsQuantityInputVisible ] = useState(true);
    const [ currentQuantityFilter, setCurrentQuantityFilter ] = useState(quantityFilters[0]);

    async function fetchRooms() {
        if (!isSearchPageVisible) return null;

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

    async function fetchCategories() {
        if (!isSearchPageVisible) return null;

        const res = await fetch(`${BACKEND_HOST}/inventory/getAllCategories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('There was an error while fetching categories');
        }

        return await res.json();
    }

    async function fetchRoomContainers() {
        if (!isSearchPageVisible) return null;

        if (!currentRoomFilter?.value) {
            throw new Error("Tried to fetch room containers while currentRoomId is null");
        }

        const res = await fetch(`${BACKEND_HOST}/inventory/getAllContainersForRoom/${currentRoomFilter.value}`, {
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

    /**
    * Fires when the current room filter is updated
    */
    useEffect(() => {
        if (isObjEmpty(currentRoomFilter)) return;

        fetchRoomContainers()
            .then((data) => {
                if (!isObjEmpty(data) && !isArrayEmpty(data.itemContainers)) {
                    const cf = data.itemContainers.map(ic => ({
                        value: ic.containerId,
                        label: ic.containerName
                    }))

                    setContainerFilters(cf);
                    setCurrentContainerFilter(cf[0]);
                    setIsContainerFilterDisabled(false);
                } else {
                    const emptyFilter = {
                        value: 'none',
                        label: 'None'
                    };

                    setContainerFilters([emptyFilter]);
                    setCurrentContainerFilter(emptyFilter);
                    setIsContainerFilterDisabled(true);
                }
            })
    }, [currentRoomFilter]);

    let filterGridTemplateColumns = 'auto'; // Default position
    let filterHeaderGridColumn = 'auto'
    let roomFilterGridColumn = 'auto';
    let categoryFilterGridColumn = 'auto';

    if (isCategoryFilterVisible) {
        filterGridTemplateColumns = 'repeat(2, 1fr)';
        filterHeaderGridColumn = '1 / span 2';
        roomFilterGridColumn = '1';
        categoryFilterGridColumn = '2';
    } else if (isRoomFilterVisible) {
        filterGridTemplateColumns = 'repeat(2, 1fr)';
        filterHeaderGridColumn = '1 / span 3';
        roomFilterGridColumn = '1 / span 3';
    }

    let quantityContainerColumns = 'auto';

    if (isQuantityInputVisible) {
        quantityContainerColumns = '35% 5% 60%';
    } else {
        quantityContainerColumns = 'auto';
    }

    return <>
        <style>{`
            .term-container {
                width: 80%;
                justify-self: center;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 15px;
                margin-top: 25px;
            }
            
            #by-term-container h3 {
                padding: 0;
                margin: 0 0 25px 0;
                font-size: 18pt;
            }
        
            #inventory-search-bar {
                font-size: 24pt;
                padding: 15px;
                width: 95%;
                border-radius: var(--common-border-radius);
                border: var(--common-border);
            }
            
            #search-btn {
                background-color: var(--btn-light-blue);
                font-size: 24pt;
                font-weight: 400;
                padding: 15px;
                justify-self: center;
                margin: 290px 0;
                color: white;
                border: none;
                
                transition: background-color 200ms ease;
            }
            
            #search-btn:active {
                background-color: var(--btn-dark-blue);
                border: none;
            }
            
            #by-filter-container {
                position: relative;
                z-index: 20;
            }
            
            #by-quantity-container {
                position: relative;
                z-index: 1;
            }
            
            #current-filter-select {
                position: relative;
            }
            
            #current-filter-select .select-dropdown {
                position: absolute;
                z-index: 999;
            }
        `}</style>

        <div id={'inventory-search-page'} className={`by-category-page is-stacked ${isSearchPageVisible ? 'is-visible' : 'is-hidden'}`}>
            <h2>Search</h2>

            <div id={'by-term-container'} className={'term-container frosted-glass'}>
                <h3>By Term</h3>
                <input id={'inventory-search-bar'} type="text"/>
            </div>

            <div id={'by-filter-container'} style={{
                marginTop: '75px',
                display: 'grid',
                gridTemplateColumns: filterGridTemplateColumns,
                justifyContent: 'center'
            }} className={'term-container frosted-glass'}>
                <h3 style={{gridColumn: filterHeaderGridColumn}}>By Filter</h3>
                <CustomSelect
                    containerGridColumn={roomFilterGridColumn}
                    idName={'current-filter-select'}
                    options={filterSelections}
                    value={currentFilter?.value}
                    onChange={(val) => {
                        const filter = filterSelections.find(f => f.value === val);
                        setCurrentFilter(filter);

                        if (filter.value === 'none') {
                            setIsRoomFilterVisible(false);
                            setIsContainerFilterVisible(false);
                        } else if (filter.value === 'by-room') {
                            setIsRoomFilterVisible(true);
                            setIsContainerFilterVisible(true);
                            setIsCategoryFilterVisible(false);

                            fetchRooms()
                                .then((data) => {
                                    const roomFilters = data.rooms.map(r => ({
                                        value: r.roomId,
                                        label: r.roomName
                                    }));

                                    setRoomFilters(roomFilters);
                                    setCurrentRoomFilter(roomFilters[0]);
                                })
                        } else if (filter.value === 'by-category') {
                            setIsRoomFilterVisible(false);
                            setIsContainerFilterVisible(false);
                            setIsCategoryFilterVisible(true);

                            fetchCategories()
                                .then((data) => {
                                    const categories = data.categories.map(cat => ({
                                        value: cat.categoryId,
                                        label: cat.categoryName
                                    }));

                                    setCategoryFilters(categories);
                                    setCurrentCategoryFilter(categories[0]);
                                })
                        }
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
                    containerMargin={'35px 0 0 0'}
                />

                {/* If Current Filter is 'by-room', show the room selector and room container selector. */}
                {isRoomFilterVisible && (
                    <>
                        <CustomSelect
                            idName={'current-room-select'}
                            options={roomFilters}
                            value={currentRoomFilter?.value}
                            onChange={(val) => {
                                const roomFilter = roomFilters.find(f => f.value === val);
                                setCurrentRoomFilter(roomFilter);
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
                            containerMargin={'35px 0 0 0'}
                        />

                        <CustomSelect
                            idName={'current-room-container-select'}
                            options={containerFilters}
                            isDisabled={isContainerFilterDisabled}
                            value={currentContainerFilter?.value}
                            onChange={(val) => {
                                const cf = containerFilters.find(f => f.value === val);
                                setCurrentContainerFilter(cf);
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
                            containerMargin={'35px 0 0 0'}
                        />
                    </>
                )}

                {/* If the current filter is 'by-category', show the category selector. */}
                {isCategoryFilterVisible && (
                    <CustomSelect
                        containerGridColumn={categoryFilterGridColumn}
                        idName={'current-category-filter-select'}
                        options={categoryFilters}
                        value={currentCategoryFilter?.value}
                        onChange={(val) => {
                            const filter = filterSelections.find(f => f.value === val);
                            setCurrentFilter(filter);

                            if (filter.value === 'none') {
                                setIsRoomFilterVisible(false);
                                setIsContainerFilterVisible(false);
                            } else if (filter.value === 'by-room') {
                                setIsRoomFilterVisible(true);
                                fetchRooms()
                                    .then((data) => {
                                        console.log(data);
                                        const roomFilters = data.rooms.map(r => ({
                                            value: r.roomId,
                                            label: r.roomName
                                        }))
                                        setRoomFilters(roomFilters);
                                        setCurrentRoomFilter(roomFilters[0]);
                                    })
                                setIsContainerFilterVisible(true);
                            }
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
                        containerMargin={'35px 0 0 0'}
                    />
                )}
            </div>

            <div id={'by-quantity-container'} style={{
                marginTop: '75px',
                display: 'grid',
                justifyContent: 'center',
                alignItems: 'center',
                gridTemplateColumns: quantityContainerColumns
            }} className={'term-container frosted-glass'}>
                <h3 style={{gridColumn: '1 / span 3'}}>By Quantity</h3>
                <CustomSelect
                    styleOverride={{
                        gridColumn: '1',
                        margin: '0',
                        alignSelf: 'center',
                        width: '100%'
                    }}
                    containerGridColumn={'1'}
                    idName={'quantity-filter-select'}
                    options={quantityFilters}
                    value={currentQuantityFilter?.value}
                    onChange={(val) => {
                        const qf = quantityFilters.find(f => f.value === val);
                        setCurrentQuantityFilter(qf);

                        switch (qf.value) {
                            case 'equal':
                            case 'less-than':
                            case 'less-than-or-equal':
                            case 'more-than':
                            case 'more-than-or-equal':
                                setIsQuantityInputVisible(true);
                                break;

                            case 'is-in-threshold':
                            case 'is-out-of-threshold':
                                setIsQuantityInputVisible(false);
                                break;
                        }
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
                    containerMargin={'35px 0 0 0'}
                />

                {isQuantityInputVisible && (
                    <input
                        type="number"
                        style={{
                            fontSize: '24pt',
                            gridColumn: '3',
                            borderRadius: 'var(--common-border-radius)',
                            border: 'var(--common-border)',
                            padding: '10px'
                        }}
                    />
                )}
            </div>

            <button className={'override-tap-color no-select'} id={'search-btn'}>
                Submit
            </button>
        </div>
    </>
}

export default InventorySearchPage;