import {useInventoryContext} from "../context/InventoryContext.jsx";
import CustomSelect from "../components/global/CustomSelect.jsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {BACKEND_HOST} from "../components/Constants.jsx";
import {notify} from "../services/NotificationService.jsx";
import {isArrayEmpty, isObjEmpty, isStrEmpty, logErr} from "../utils/Utils.js";
import Paginator from "../components/global/Paginator.jsx";


function InventorySearchPage() {
    const {
        isSearchPageVisible,
        isSearchComponentVisible, setIsSearchComponentVisible,
        isResultsComponentVisible, setIsResultsComponentVisible
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

    // EQUAL("equal"),
    //     LESS_THAN("less_than"),
    //     LESS_THAN_OR_EQUAL("less_than_or_equal"),
    //     MORE_THAN("more_than"),
    //     MORE_THAN_OR_EQUAL("more_than_or_equal"),
    //     IS_IN_THRESHOLD("is_in_threshold"),
    //     IS_OUT_OF_THRESHOLD("is_out_of_threshold");

    const quantityFilters = [
        {
          value: 'none',
          label: 'None'
        },
        {
            value: 'equal',
            label: 'Equal To'
        },
        {
            value: 'less_than',
            label: 'Less Than'
        },
        {
            value: 'less_than_or_equal',
            label: 'Less Than Or Equal'
        },
        {
            value: 'more_than',
            label: 'More Than'
        },
        {
            value: 'more_than_or_equal',
            label: 'More Than Or Equal'
        },
        {
            value: 'is_in_threshold',
            label: 'Is Within Quantity Threshold'
        },
        {
            value: 'is_out_of_threshold',
            label: 'Is Out Of Quantity Threshold'
        }
    ]

    // TODO: Remove
    // Used for testing of results page
    const fakeResults = {
        "items": [
            {
                "itemId": "ad842dc2-e001-4025-9c91-e06d748ccd08",
                "itemName": "My Item",
                "description": "Description",
                "upc": "FJJFD8AJFDAJF",
                "quantity": 3,
                "categoryId": "dba854a2-ef50-4cfc-a7b6-dc89d144e2fe",
                "categoryName": "Medicine",
                "roomId": "874c84af-521e-4d35-83f4-d5be11bcd111",
                "roomName": "Living Room",
                "itemContainerId": "fjda8fjdaj8fda",
                "itemContainerName": "Cupboard above fridge",
                "isQuantityAtThreshold": false
            },
            {
                "itemId": "c998d4a3-f480-4a95-ba05-ab51e4160003",
                "itemName": "2nd Item",
                "description": "Description",
                "upc": "FJKFDAJ8FDJAF",
                "quantity": 6,
                "categoryId": "dba854a2-ef50-4cfc-a7b6-dc89d144e2fe",
                "categoryName": "Medicine",
                "roomId": "874c84af-521e-4d35-83f4-d5be11bcd111",
                "roomName": "Living Room",
                "itemContainerId": "828jrjfd8ajfas",
                "itemContainerName": "Cupboard next to stairway",
                "isQuantityAtThreshold": false
            },
            {
                "itemId": "c998d4a3-f480-4a95-ba05-ab51e4160004",
                "itemName": "3rd Item",
                "description": "Description",
                "upc": "JIFAHJ87FDHFA",
                "quantity": 1,
                "categoryId": "dba854a2-ef50-4cfc-a7b6-dc89d144e2fe",
                "categoryName": "Medicine",
                "roomId": "874c84af-521e-4d35-83f4-d5be11bcd111",
                "roomName": "Living Room",
                "itemContainerId": "828jrjfd8ajfaq",
                "itemContainerName": "Middle cupboard under sink",
                "isQuantityAtThreshold": true
            },
            {
                "itemId": "c998d4a3-f480-4a95-ba05-ab51e4160005",
                "itemName": "4th Item",
                "description": "Description",
                "upc": "JIFAHJ87FDHFB",
                "quantity": 2,
                "categoryId": "dba854a2-ef50-4cfc-a7b6-dc89d144e2fe",
                "categoryName": "Medicine",
                "roomId": "874c84af-521e-4d35-83f4-d5be11bcd111",
                "roomName": "Living Room",
                "itemContainerId": "828jrjfd8ajfaq",
                "itemContainerName": "Middle cupboard under sink",
                "isQuantityAtThreshold": true
            },
            {
                "itemId": "c998d4a3-f480-4a95-ba05-ab51e4160006",
                "itemName": "5th Item",
                "description": null,
                "upc": "JIFAHJ87FDHFC",
                "quantity": 8,
                "categoryId": "dba854a2-ef50-4cfc-a7b6-dc89d144e2fe",
                "categoryName": "Medicine",
                "roomId": "874c84af-521e-4d35-83f4-d5be11bcd111",
                "roomName": "Living Room",
                "itemContainerId": "828jrjfd8ajfaq",
                "itemContainerName": "Middle cupboard under sink",
                "isQuantityAtThreshold": false
            },
            {
                "itemId": "c998d4a3-f480-4a95-ba05-ab51e4160007",
                "itemName": "6th Item",
                "description": null,
                "upc": "JIFAHJ87FDHFD",
                "quantity": 5,
                "categoryId": "dba854a2-ef50-4cfc-a7b6-dc89d144e2fe",
                "categoryName": "Medicine",
                "roomId": "874c84af-521e-4d35-83f4-d5be11bcd111",
                "roomName": "Living Room",
                "itemContainerId": "828jrjfd8ajfaz",
                "itemContainerName": "Far right cupboard over oven",
                "isQuantityAtThreshold": false
            }
        ],
        "shortCode": "SUCCESS"
    }

    const paginationOptions = [
        {
            value: '5',
            label: '5'
        },
        {
            value: '10',
            label: '10'
        },
        {
            value: '15',
            label: '15'
        },
        {
            value: '25',
            label: '25'
        },
        {
            value: '50',
            label: '50'
        },
        {
            value: '100',
            label: '100'
        }
    ];
    const [ currentPaginationOption, setCurrentPaginationOption ] = useState(paginationOptions[0]);
    const [ pageNumbers, setPageNumbers ] = useState([]);
    const [ paginatedResults, setPaginatedResults ] = useState([]);
    const [ currentPageNumber, setCurrentPageNumber ] = useState(1);

    // DOM refs
    const searchPageRef = useRef(null);
    const searchInputRef = useRef(null);

    // Data to be passed to the search algorithm
    const [ currentSearchTerm, setCurrentSearchTerm ] = useState('');
    const [ currentRoomFilter, setCurrentRoomFilter ] = useState(null);
    const [ currentContainerFilter, setCurrentContainerFilter ] = useState(null);
    const [ currentCategoryFilter, setCurrentCategoryFilter ] = useState(null);
    const [ currentQuantityFilter, setCurrentQuantityFilter ] = useState(quantityFilters.find(
        qf => qf.value === 'none'));
    const [ currentQuantitySearchTerm, setCurrentQuantitySearchTerm ] = useState(null);

    // Supporting variables
    const [ searchResults, setSearchResults ] = useState(null); // TODO: Set to empty array
    const [ currentFilter, setCurrentFilter ] = useState(filterSelections.find(fs => fs.value === 'none'));
    const [ isCategoryFilterVisible, setIsCategoryFilterVisible ] = useState(false);
    const [ isRoomFilterVisible, setIsRoomFilterVisible ] = useState(false);
    const [ isContainerFilterVisible, setIsContainerFilterVisible ] = useState(false);
    const [ isContainerFilterDisabled, setIsContainerFilterDisabled ] = useState(false);
    const [ roomFilters, setRoomFilters ] = useState([]);
    const [ containerFilters, setContainerFilters ] = useState([]);
    const [ categoryFilters, setCategoryFilters ] = useState([]);
    const [ isQuantityInputVisible, setIsQuantityInputVisible ] = useState(true);

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

    async function fetchSearchResults(searchRequest) {
        if (!isSearchPageVisible) return null;

        if (isObjEmpty(searchRequest)) {
            throw new Error('Tried to fetch search results with an empty search request object');
        }

        const res = await fetch(`${BACKEND_HOST}/inventory/searchItems`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchRequest)
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(`There was an error while fetching room items: ${body.errMsg}`)
        }

        return await res.json();
    }

    /**
    * Run a stub when isSearchComponentVisible changes to true, and after the transition finishes.
     * Keeping this grayed out for now because it may be inconvenient to have a keyboard pop up when coming back to the search page.
    */
    // useEffect(() => {
    //     if (!isSearchComponentVisible) return;
    //
    //     const pageEl = searchPageRef.current;
    //     if (!pageEl) return;
    //
    //     const handleTransitionEnd = (e) => {
    //         if (e.target !== pageEl) return;
    //         searchInputRef.current?.focus();
    //     };
    //
    //     pageEl.addEventListener("transitionend", handleTransitionEnd);
    //
    //     return () => {
    //         pageEl.removeEventListener("transitionend", handleTransitionEnd);
    //     };
    // }, [isSearchComponentVisible]);

    /**
    * Fires when the current room filter is updated
    */
    useEffect(() => {
        // if (isObjEmpty(currentRoomFilter)) return;

        fetchRoomContainers()
            .then((data) => {
                // TODO: Remove
                console.log(`Data:`);
                console.log(data);

                if (!isObjEmpty(data) && !isArrayEmpty(data.itemContainers)) {
                    const cf = [
                        {
                            value: 'all',
                            label: 'All Containers'
                        }
                    ];

                    cf.push(...data.itemContainers.map(ic => ({
                        value: ic.containerId,
                        label: ic.containerName
                    })))

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
                margin: 75px 0;
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

        <div ref={searchPageRef} id={'inventory-search-page'} className={`by-category-page fadable is-stacked ${isSearchComponentVisible ? 'is-visible' : 'is-hidden'}`}>
            <h2>Search</h2>

            <div id={'by-term-container'} className={'term-container frosted-glass'}>
                <h3>By Term</h3>
                <input id={'inventory-search-bar'} type="text"
                onChange={(e) => setCurrentSearchTerm(e.target.value)}
                ref={searchInputRef}/>
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
                            // Hide filter dropdowns
                            setIsRoomFilterVisible(false);
                            setIsContainerFilterVisible(false);

                            // Clear out current filters
                            setCurrentRoomFilter(null);
                            setCurrentContainerFilter(null);
                        } else if (filter.value === 'by-room') {
                            // Hide filter dropdowns
                            setIsRoomFilterVisible(true);
                            setIsContainerFilterVisible(true);
                            setIsCategoryFilterVisible(false);

                            // Clear category filter
                            setCurrentCategoryFilter(null);

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
                            // Hide dropdowns
                            setIsRoomFilterVisible(false);
                            setIsContainerFilterVisible(false);
                            setIsCategoryFilterVisible(true);

                            // Reset container filter
                            setCurrentContainerFilter(null);

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
                            const filter = categoryFilters.find(f => f.value === val);
                            setCurrentCategoryFilter(filter);

                            // if (filter.value === 'none') {
                            //     setIsRoomFilterVisible(false);
                            //     setIsContainerFilterVisible(false);
                            // } else if (filter.value === 'by-room') {
                            //     setIsRoomFilterVisible(true);
                            //     fetchRooms()
                            //         .then((data) => {
                            //             console.log(data);
                            //             const roomFilters = data.rooms.map(r => ({
                            //                 value: r.roomId,
                            //                 label: r.roomName
                            //             }))
                            //             setRoomFilters(roomFilters);
                            //             setCurrentRoomFilter(roomFilters[0]);
                            //         })
                            //     setIsContainerFilterVisible(true);
                            // }
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
                        onChange={(e) => { setCurrentQuantitySearchTerm(e.target.value); }}
                    />
                )}
            </div>

            <button className={'override-tap-color no-select'} id={'search-btn'}
            onClick={() => {
                const searchRequest = {
                    searchTerm: !isStrEmpty(currentSearchTerm) ? currentSearchTerm : null,
                    searchFilters: [],
                    searchQuantityFilters: []
                }

                if (!isObjEmpty(currentRoomFilter)) {
                    searchRequest.searchFilters.push({
                        searchFilterType: 'room',
                        searchFilterId: currentRoomFilter.value
                    })
                }

                if (!isObjEmpty(currentContainerFilter) && currentContainerFilter.value !== 'all') {
                    searchRequest.searchFilters.push({
                        searchFilterType: 'room_with_container',
                        searchFilterId: currentContainerFilter.value
                    })
                }

                if (!isObjEmpty(currentCategoryFilter)) {
                    searchRequest.searchFilters.push({
                        searchFilterType: 'category',
                        searchFilterId: currentCategoryFilter.value
                    })
                }

                if (!isObjEmpty(currentQuantityFilter) && currentQuantityFilter.value !== 'none') {
                    if (isStrEmpty(currentQuantitySearchTerm)) {
                        // This is a in/out of threshold query. It doesn't matter what number we give, we just have to give one.
                        searchRequest.searchQuantityFilters.push({
                            searchQuantityType: currentQuantityFilter.value,
                            searchQuantityVal: 0
                        })
                    } else {
                        // This is a number value query. We need the specified number value for this.
                        if (!isStrEmpty(currentQuantitySearchTerm)) {
                            searchRequest.searchQuantityFilters.push({
                                searchQuantityType: currentQuantityFilter.value,
                                searchQuantityVal: parseInt(currentQuantitySearchTerm)
                            })
                        }
                    }
                }

                // TODO: Remove
                // console.log(`Search Request Obj:\n\n${JSON.stringify(searchRequest)}`);

                fetchSearchResults(searchRequest)
                    .then((results) => {
                        console.log(`Results:`);
                        console.log(results);
                        console.log(JSON.stringify(results));

                        setSearchResults(results);
                        setIsSearchComponentVisible(false);
                        setIsResultsComponentVisible(true);
                    })
            }}>
                Search
            </button>
        </div>

        <Paginator
            idName={'inventory-results-page'}
            visibilityToggle={isResultsComponentVisible}
            searchResults={searchResults}
            paginationOptions={paginationOptions}
            currentPaginationOption={currentPaginationOption}
            setCurrentPaginationOption={setCurrentPaginationOption}
            pageNumbers={pageNumbers}
            setPageNumbers={setPageNumbers}
            paginatedResults={paginatedResults}
            setPaginatedResults={setPaginatedResults}
            currentPageNumber={currentPageNumber}
            setCurrentPageNumber={setCurrentPageNumber}
            onBackBtnClick={() => {
                setIsSearchComponentVisible(true);
                setIsResultsComponentVisible(false);
            }}
        />
    </>
}

export default InventorySearchPage;