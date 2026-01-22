import {useEffect, useRef, useState} from "react";
import {subscribe} from "../services/NotificationService.jsx";
import "/src/css/components/NotificationHost.css"

const DISPLAY_DURATION = 3000;

export default function NotificationHost() {
    const [payload, setPayload] = useState(null);
    const [visible, setVisible] = useState(false);
    const hideTimerRef = useRef(null);

    useEffect(() => {
        return subscribe((p) => {
            // Clear any existing hide timer
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
            }

            setPayload(p);
            setVisible(true);

            // Schedule hide
            hideTimerRef.current = setTimeout(() => {
                setVisible(false);
            }, DISPLAY_DURATION);
        })
    }, []);

    return (
        <div id={'notify-container'} className={`frosted-glass 
        ${visible ? 'is-visible' : ''}`}>
        { payload && <h1>{payload.message}</h1> }
        </div>
    )
}