import {useEffect, useRef, useState} from "react";

function ItemModalTile({ title, value, setValue }) {

    const [ inEditModeInit, setInEditModeInit ] = useState(false);
    const [ inEditMode, setInEditMode ] = useState(false);
    const [ inputOpacity, setInputOpacity ] = useState(false);
    const [ inputDisplay, setInputDisplay ] = useState(false);
    const [ valDisplay, setValDisplay ] = useState(true);
    // const [ currentValue, setCurrentValue ] = useState(null);

    const timerRef = useRef(null);
    const didLongPressRef = useRef(false);

    const LONG_PRESS_MS = 1500;

    // useEffect(() => {
    //     setCurrentValue(value);
    // }, [value]);

    function handleLongPress() {
        setInEditMode(false);
    }

    function handlePressStart(e) {
        didLongPressRef.current = false;

        timerRef.current = setTimeout(() => {
            didLongPressRef.current = true;
            console.log("Long press");
            handleLongPress();
        }, LONG_PRESS_MS);
    }

    function handlePressEnd(e) {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (!didLongPressRef.current) {
            console.log("Short press");
            // handleShortPress(e);
        }
    }

    useEffect(() => {
        // Prevents firing on DOM load
        if (!inEditModeInit) {
            setInEditModeInit(true);
            return;
        }

        if (inEditMode) {
            setInputDisplay(true);
            setTimeout(() =>  {
                setInputOpacity(true);

                setTimeout(() => {
                    setValDisplay(false);
                }, 500);
            }, 50);
        } else {
            setInputOpacity(false);
            setValDisplay(true);
            setTimeout(() => {
                setInputDisplay(false);
            }, 500);
        }
    }, [inEditMode]);

    // function handleOnValueClick() {
    //     if (inEditMode) {
    //         setInEditMode(false);
    //     } else {
    //         setInEditMode(true);
    //     }
    // }

    return (
        <>
            <div className={'item-modal-tile frosted-glass-dark-gray'} style={{width: '90%',
                justifySelf: 'center', margin: '25px 0 25px 0'}}>
                <h2 style={{fontSize: '32pt', fontWeight: 400}} onClick={() => setInEditMode(false)}>{title}</h2>
                <div style={{width: '75%', height: '1px', justifySelf: 'center', backgroundColor: 'white',
                    marginTop: '25px'}}></div>
                <div style={{display: 'grid'}}>
                    <input type="text" value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={{fontSize: '24pt', fontWeight: 400,
                    gridColumn: 1, gridRow: 1, zIndex: 175, position: 'relative', opacity: inputOpacity ? 1 : 0,
                    display: inputDisplay ? 'block' : 'none', transition: 'opacity 500ms ease-in', padding: '15px'}}/>

                    <p style={{fontSize: '24pt', fontWeight: 400, gridColumn: 1, gridRow: 1,
                    zIndex: 200, position: 'relative', display: valDisplay ? 'block' : 'none'}}
                    onClick={() => setInEditMode(true)}>{value}</p>
                </div>
            </div>
        </>
    );
}

export default ItemModalTile;