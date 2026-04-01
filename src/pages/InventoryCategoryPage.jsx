import {useInventoryContext} from "../context/InventoryContext.jsx";
import {useEffect, useRef, useState} from "react";
import {BACKEND_HOST} from "../components/Constants.jsx";
import {notify} from "../services/NotificationService.jsx";
import {isArrayEmpty, isObjEmpty, isStrEmpty, logErr} from "../utils/Utils.js";
import CustomSelect from "../components/global/CustomSelect.jsx";

class CurrentCategory {
    constructor(categoryId, categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}

function InventoryCategoryPage() {

    const {
        isByCategoryPageVisible
    } = useInventoryContext();

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

    const [ currentCategories, setCurrentCategories ] = useState([]);
    const [ currentCategory, setCurrentCategory ] = useState(null);
    const [ isCategorySelectorHidden, setIsCategorySelectorHidden ] = useState(false);
    const [ currentItems, setCurrentItems ] = useState([]);
    // The default currentViewOption is 'list-view'
    const [ currentViewOption, setCurrentViewOption ] = useState(viewOptions.find(vo => vo.value === 'list-view'));

    async function fetchCategories() {
        if (!isByCategoryPageVisible) return null;

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

    async function fetchItemsForCategory() {
        if (isObjEmpty(currentCategory)) return null;

        const res = await fetch(`${BACKEND_HOST}/inventory/getAllItemsForCategory/${currentCategory.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('There was an error while fetching items for the current category.');
        }

        return await res.json();
    }

    function handleOnCategoryChange(e) {

    }

    useEffect(() => {
        if (!isByCategoryPageVisible) return;

        fetchCategories()
            .then((data) => {
                if (data.shortCode === 'NO_CATEGORIES') {
                    setIsCategorySelectorHidden(true);
                } else if (data.shortCode === 'SUCCESS') {
                    setIsCategorySelectorHidden(false);
                    const categories = data.categories.map(cat => ({
                        value: cat.categoryId,
                        label: cat.categoryName
                    }))
                    console.log(categories);
                    setCurrentCategories(categories);
                    setCurrentCategory(categories[0]);
                }
            })
            .catch((err) => {
                notify('Sorry, something went wrong. Please reload.');
                logErr({
                    errMsg: err
                })
            })
    }, [isByCategoryPageVisible]);

    /**
    * Fetch items by category, when the current category is changed.
    */
    useEffect(() => {
        if (isObjEmpty(currentCategory)) return;

        fetchItemsForCategory()
            .then((data) => {
                setCurrentItems(data.items);
            })
            .catch((err) => {
                notify('Sorry, something went wrong. Please reload.');
                logErr({
                    errMsg: err
                });
            })
    }, [currentCategory]);

    return <>
        <style>{`
            #category-select {
                margin-bottom: 50px;
            }
            
            #category-options-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                justify-content: center;
                align-items: center;
            }
            
            #list-items-outer-wrapper .item-outer-wrapper {
                justify-content: center;
                grid-column-gap: 15px;
                padding: 0 10px;
            }
        `}</style>

        <div id={'inventory-by-category-page'} className={`by-category-page is-stacked ${isByCategoryPageVisible ? 'is-visible' : 'is-hidden'}`}>
            {isCategorySelectorHidden && (
                <h2>No Categories</h2>
            )}

            {!isCategorySelectorHidden && (
                <>
                    <h2>By Category</h2>

                    <div id={'category-options-container'}>
                        <CustomSelect
                            idName={'current-category-select'}
                            options={currentCategories}
                            value={currentCategory?.value}
                            onChange={(val) => {
                                setCurrentCategory(currentCategories.find(cat => cat.value === val));
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
                            containerMargin={'35px 0 0 0'}
                        />
                    </div>

                    {!isArrayEmpty(currentItems) && currentViewOption.value === 'list-view' && (
                        <div id={'list-items-outer-wrapper'}>
                            {currentItems.map((item) => (
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

                    {!isArrayEmpty(currentItems) && currentViewOption.value === 'card-view' && (
                        <div id={'items-outer-wrapper'}>
                            {currentItems.map((item) => (
                                <div key={item.itemId} className={'item-outer-wrapper frosted-glass'}>
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
                </>
            )}
        </div>
    </>
}

export default InventoryCategoryPage;