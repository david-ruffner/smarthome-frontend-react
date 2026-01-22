import {useEffect, useState} from "react";


export function useCollapseTransition(isVisible, durationMs = 500) {
    const [ isCollapsed, setIsCollapsed ] = useState(!isVisible);

    useEffect(() => {
        let timeout;

        if (isVisible) {
            setIsCollapsed(false);
        } else {
            timeout = setTimeout(() => setIsCollapsed(true), durationMs);
        }

        return () => clearTimeout(timeout);
    }, [isVisible, durationMs]);

    return isCollapsed;
}