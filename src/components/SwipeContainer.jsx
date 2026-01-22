import { useSwipeable } from "react-swipeable";
import {useUI} from "../context/UIContext.jsx";
import {useEffect, useRef} from "react";



function SwipeContainer({ children }) {
    const {
        currentDashboardIndex, slideDashboardCarousel,
        newDashboardIndex, setNewDashboardIndex
    } = useUI();

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            console.log(`Swiped Left!`);
            // slideDashboardCarousel(currentDashboardIndex + 1);
            setNewDashboardIndex(currentDashboardIndex + 1);
        },
        onSwipedRight: () => {
            console.log(`Swiped Right!`);
            // slideDashboardCarousel(currentDashboardIndex - 1)
            setNewDashboardIndex(currentDashboardIndex - 1);
        },
        delta: {
            left: 60,
            right: 60,
            up: 120,
            down: 120
        },
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    return <div {...handlers}>{children}</div>;
}

export default SwipeContainer;