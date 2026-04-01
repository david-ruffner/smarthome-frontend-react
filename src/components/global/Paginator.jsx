import {isArrayEmpty, isStrEmpty} from "../../utils/Utils.js";
import {useInventoryContext} from "../../context/InventoryContext.jsx";
import {useEffect} from "react";
import CustomSelect from "./CustomSelect.jsx";


function Paginator({ idName, visibilityToggle, searchResults, paginationOptions, currentPaginationOption,
                   setCurrentPaginationOption,
                   pageNumbers, setPageNumbers, paginatedResults, setPaginatedResults,
                   currentPageNumber, setCurrentPageNumber, onBackBtnClick }) {
    /**
     * Fires on startup and whenever currentPaginationOption changes
     */
    useEffect(() => {
        const items = searchResults?.items ?? [];
        const pageSize = Number(currentPaginationOption.value);

        if (items.length === 0 || !pageSize) {
            setPageNumbers([]);
            setPaginatedResults([]);
            setCurrentPageNumber(1);
            return;
        }

        const pagResults = [];
        for (let i = 0; i < items.length; i += pageSize) {
            pagResults.push(items.slice(i, i + pageSize));
        }

        const pn = pagResults.map((_, index) => ({
            value: index + 1,
            label: index + 1
        }));

        setPageNumbers(pn);
        setPaginatedResults(pagResults);
        setCurrentPageNumber(1);
    }, [searchResults, currentPaginationOption, setPageNumbers, setPaginatedResults, setCurrentPageNumber]);

    return <>
        <style>{`
            #${idName} .results-header-container {
                display: grid;
                grid-template-columns: 80% 20%;
                align-items: 'center';
            }
            
            #${idName} .results-pagination-container {
                display: flex;
                margin: 15px;
                align-self: center;
            }
            
            #${idName} .results-pagination-container p {
                font-size: 28pt;
                padding: 10px 25px;
                margin: 0;
                transition: color 200ms ease;
            }
            
            #${idName} .results-pagination-container p.active-page {
                color: var(--electric-blue);
            }
            
            #${idName} .results-pagination-container p:active {
                color: var(--btn-light-blue);
            }
            
            #results-back-btn {
                background-color: var(--btn-light-blue);
                font-size: 24pt;
                font-weight: 400;
                padding: 15px;
                justify-self: center;
                margin-bottom: 25px;
                color: white;
                border: none;
                
                transition: background-color 200ms ease;
            }
        `}</style>

        <div id={idName} className={`by-category-page fadable is-stacked ${visibilityToggle ? 'is-visible' : 'is-hidden'}`}>
            <div className={'results-header-container'}>
                <h2 style={{
                    gridColumn: '1 / span 2',
                    fontSize: '26pt',
                    margin: '25px 0'
                }}>Results</h2>

                <button style={{
                    gridColumn: '1 / span 2'
                }}
                id={'results-back-btn'}
                className={'override-tap-color no-select'}
                onClick={() => { onBackBtnClick() }}>Back</button>

                {!isArrayEmpty(pageNumbers) && (
                    <div
                        className={'results-pagination-container frosted-glass'}>
                        {pageNumbers.map(pn => (
                            <p
                                key={pn.value}
                                data-index={pn.value}
                                className={currentPageNumber === pn.value ? 'active-page' : ''}
                                onClick={(e) => {
                                    const index = Number(e.currentTarget.dataset.index) - 1;
                                    setCurrentPageNumber(pn.value);
                                    console.log(`Indexed Results:`);
                                    console.log(paginatedResults[index]);
                                }}
                            >{pn.label}</p>
                        ))}
                    </div>
                )}

                <CustomSelect
                    styleOverride={{
                        gridColumn: '2',
                        alignSelf: 'center',
                        margin: '0',
                        justifySelf: 'center',
                        width: '75%'
                    }}
                    selectOptionFontSize={'18pt'}
                    idName={'inventory-results-pagination-selector'}
                    options={paginationOptions}
                    value={currentPaginationOption.value}
                    onChange={(val) => {
                        setCurrentPaginationOption(paginationOptions.find(p => p.value === val));
                        setCurrentPageNumber(1);
                    }}
                    dropdownBackground={'rgba(0,0,0,0.8)'}
                    background={'var(--frosted-glass-faded-blue-background)'}
                    fontSize={'24pt'}
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

            {!isArrayEmpty(paginatedResults) && (
                <div id={'results-outer-wrapper'}>
                    {paginatedResults[currentPageNumber - 1]?.map((item) => (
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
        </div>
    </>
}

export default Paginator;