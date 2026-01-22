import {useUI} from "../context/UIContext.jsx";
import {useEffect} from "react";


function DashboardTrolley() {

    const {
        currentDashboardIndex, setNewDashboardIndex
    } = useUI();

    function swapActiveTrolleyCircle() {
        const currentTrolleyCircle = document
            .querySelector(`.trolley-circle.active-trolley-circle`);
        const newTrolleyCircle = document
            .querySelector(`.trolley-circle[data-index="${currentDashboardIndex}"]`);

        if (currentTrolleyCircle && newTrolleyCircle) {
            currentTrolleyCircle.classList.remove('active-trolley-circle');
            newTrolleyCircle.classList.add('active-trolley-circle');
        }
    }

    function onTrolleyCircleClick(e) {
        const newIndex = e.currentTarget.dataset.index;
        if (newIndex) {
            setNewDashboardIndex(newIndex);
        }
    }

    useEffect(() => {
        console.log(`Trolley Current Index: ${currentDashboardIndex}`);
        swapActiveTrolleyCircle();
    }, [currentDashboardIndex]);

    return <>
        <style>{`
            #dashboard-trolley {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                margin: 25px 0 25px 0;
                width: 30%;
                justify-self: center;
            }
            
            .trolley-circle {
                width: 35px;
                height: 35px;
                border-radius: 35px;
                justify-self: center;
            }
            
            .active-trolley-circle {
                background: rgba(111, 192, 63, 0.85);
            }
        `}</style>

        <div id={'dashboard-trolley'}>
            <div onClick={onTrolleyCircleClick} data-index={-1} className={'trolley-circle frosted-glass-faded-blue'}></div>
            <div onClick={onTrolleyCircleClick} data-index={0} className={'trolley-circle frosted-glass-faded-blue active-trolley-circle'}></div>
            <div onClick={onTrolleyCircleClick} data-index={1} className={'trolley-circle frosted-glass-faded-blue'}></div>
        </div>
    </>
}

export default DashboardTrolley;