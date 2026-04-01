import {useEffect, useRef, useState} from "react";
import {isStrEmpty} from "../../utils/Utils.js";

function CustomSelect({ idName, options = [], value, onChange = () => {}, border, fontSize, borderRadius,
                      background, selectionFlashBackground, dropdownBackground, selectionFlashTime, selectOptionPadding,
                      selectOptionFontSize, upArrowOnMenuClose, arrowTransitionSpeed, selectDisplayBackgroundColor,
                      selectDisplayTransitionTime, containerJustify, containerMargin}) {
    const [open, setOpen] = useState(false);
    const [pressedValue, setPressedValue] = useState(null);
    const [isPressed, setIsPressed] = useState(false);

    const customSelectRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                customSelectRef.current &&
                !customSelectRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <style>
                {`
                    #${idName}.custom-select {
                        position: relative;
                        width: 200px;
                        justify-self: ${!isStrEmpty(containerJustify) ? containerJustify : 'none'};
                        margin: ${!isStrEmpty(containerMargin) ? containerMargin : 'none'};
                    }
                    
                    #${idName} .select-display {
                        position: relative;
                        padding: 10px 36px 10px 10px;
                        border-radius: ${!isStrEmpty(borderRadius) ? borderRadius : 'var(--common-button-border-radius)'};
                        border: ${!isStrEmpty(border) ? border : 'var(--common-border)'};
                        backdrop-filter: blur(10px);
                        background: ${!isStrEmpty(background) ? background : 'var(--frosted-glass-background)'};
                        cursor: pointer;
                        font-size: ${!isStrEmpty(fontSize) ? fontSize : '14px'};
                        -webkit-tap-highlight-color: transparent;
                        transition: background-color ${!isStrEmpty(selectDisplayTransitionTime) ? selectDisplayTransitionTime : '120ms'} ease;
                    }
                    
                    #${idName} .select-display.is-pressed {
                        background-color: ${!isStrEmpty(selectDisplayBackgroundColor) ? selectDisplayBackgroundColor : 'rgba(255, 255, 255, 0.2)'};
                    }
                    
                    #${idName} .select-display:active {
                        background-color: ${!isStrEmpty(selectDisplayBackgroundColor) ? selectDisplayBackgroundColor : 'rgba(255, 255, 255, 0.2)'};
                    }

                    #${idName} .select-display::after {
                        content: '';
                        position: absolute;
                        right: 12px;
                        top: 50%;

                        width: 0;
                        height: 0;

                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        border-top: 6px solid rgba(255,255,255,0.8);

                        transform: translateY(-50%) rotate(${upArrowOnMenuClose ? '180deg' : '0deg'});
                        transition: transform ${!isStrEmpty(arrowTransitionSpeed) ? arrowTransitionSpeed : '200ms'} ease;

                        pointer-events: none;
                    }

                    #${idName} .select-display.is-open::after {
                        transform: translateY(-50%) rotate(${upArrowOnMenuClose ? '0deg' : '180deg'});
                    }
                    
                    #${idName} .select-dropdown {
                        position: absolute;
                        top: 100%;
                        width: 100%;
                        margin-top: 5px;
                    
                        border-radius: 10px;
                        
                        background: ${!isStrEmpty(dropdownBackground) ? dropdownBackground : 'rgba(0,0,0,0.5)'};
                    
                        overflow: hidden;
                        z-index: 10;
                    }
                    
                    #${idName} .select-option {
                        padding: ${!isStrEmpty(selectOptionPadding) ? selectOptionPadding : '10px'};
                        cursor: pointer;
                        transition: background ${!isStrEmpty(selectionFlashTime) ? selectionFlashTime : '120ms'} ease;
                        -webkit-tap-highlight-color: transparent;
                        font-size: ${!isStrEmpty(selectOptionFontSize) ? selectOptionFontSize : '16pt'};
                    }

                    #${idName} .select-option.is-pressed {
                        background-color: ${!isStrEmpty(selectionFlashBackground)
                        ? selectionFlashBackground
                        : 'rgb(255, 255, 255, 0.3)'} !important;
                    }
                `}
            </style>

            <div id={idName} className="custom-select" ref={customSelectRef}>
                <div
                    className={`select-display ${open ? 'is-open' : ''}`}
                    onMouseDown={() => setIsPressed(true)}
                    onMouseUp={() => setIsPressed(false)}
                    onMouseLeave={() => setIsPressed(false)}
                    onTouchStart={() => setIsPressed(true)}
                    onTouchEnd={() => setIsPressed(false)}
                    onClick={() => setOpen(!open)}
                >
                    {options.find(o => o.value === value)?.label}
                </div>

                {open && (
                    <div className="select-dropdown">
                        {options.map(opt => (
                            <div
                                key={opt.value}
                                className={`select-option ${pressedValue === opt.value ? 'is-pressed' : ''}`}
                                onClick={() => {
                                    setPressedValue(opt.value);

                                    window.setTimeout(() => {
                                        setPressedValue(null);
                                        setOpen(false);
                                        onChange(opt.value);
                                    }, 120);
                                }}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default CustomSelect;