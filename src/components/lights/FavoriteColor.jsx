import {useRef} from "react";
import {useLightsUI} from "./LightsUIContext.jsx";
import {hexToColorStr} from "../../utils/Utils.js";


function FavoriteColor({ rgbaStr, colorStr, favoriteColorId, controlDeviceId,
                       groupId, lightId }) {

    const {
        pendingColorRef
    } = useLightsUI();

    const timerRef = useRef(null);
    const didLongPressRef = useRef(false);

    const LONG_PRESS_MS = 500;

    function handleShortPress(e) {
        const favColorId = e.currentTarget.dataset.favoriteColorId;
        const colStr = e.currentTarget.dataset.colorString;

        console.log(`Favorite Color ID: ${favColorId}`);
        console.log(`Color String: ${colStr}`);

        // TODO: Set lights color to the selected color
    }

    function handleLongPress(e) {
        const favColorId = e.target.dataset.favoriteColorId;
        const colStr = e.target.dataset.colorString;

        console.log(`Favorite Color ID: ${favColorId}`);
        console.log(`Color String: ${colStr}`);
        console.log(`Pending Color Ref Val: ${hexToColorStr(pendingColorRef.current)}`);

        // TODO: Update the pressed color to the current bulb color
    }

    function handlePressStart(e) {
        didLongPressRef.current = false;

        timerRef.current = setTimeout(() => {
            didLongPressRef.current = true;
            console.log("Long press");
            handleLongPress(e);
        }, LONG_PRESS_MS);
    }

    function handlePressEnd(e) {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (!didLongPressRef.current) {
            console.log("Short press");
            handleShortPress(e);
        }
    }

    return <>
        <style>{`
            .favorite-color {
                height: 50px;
                width: 50px;
            }
        `}</style>

        <div style={{
                background: rgbaStr
            }}
             data-favorite-color-id={favoriteColorId}
             data-color-string={colorStr}
             data-control-device-id={controlDeviceId}
             data-light-id={lightId}
             data-group-id={groupId}
             className={'favorite-color'}
             onPointerDown={handlePressStart}
             onPointerUp={handlePressEnd}
             onPointerLeave={() => clearTimeout(timerRef.current)}
             onContextMenu={(e) => e.preventDefault()}></div>
    </>
}

export default FavoriteColor;